const express = require('express');
const user = express.Router();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const {
	sequelize,
	User,
	Org,
	Team,
	Project,
	Session,
	ResetPasswordToken,
	LoginToken,
	VerifyAccountToken,
	getCurrentTimeStamp
} = require('../../models/index.js');

const { sendEmail } = require('../../utils/sendgrid');

module.exports = (() => {

	user.use("*", (req, res, next) => {
		next();
	})

	/**
	 * @openapi
	 * /api/user/test:
	 *   get:
	 *     description: Test API User Index Route!
	 *     tags: [Users]
	 *     responses:
	 *       200:
	 *         description: Returns API user test call.
	 */
	user.get("/test", (req, res) => {
		res.send('API user test call')
	})

	user.get("/info", async (req, res) => {
		console.log(req.cookies);
		try {
			const token = req.cookies.session_id;
			if (!token) {
				res.status(200).json('nouser')
				throw new Error("No token provided");
			}

			const session = await Session.findOne({ where: { token: token } });
			if (!session) {
				res.status(200).json('nouser')
				throw new Error("Session not found");
			}

			const user = await User.findOne({ where: { id: session.user_id } });
			delete user.dataValues.password

			if (!user) {
				res.status(200).json('nouser')
				throw new Error("User not found");
			}
			// todo: get user orgs, teams and project info
			const orgs = await Org.findAll({
				where: {
					id: user.org
				}
			});
			const teams = await Team.findAll({
				where: {
					id: user.team
				}
			})
			const projects = await Project.findAll({
				where: {
					id: user.project
				}
			})


			res.status(200).json({ user, orgs, teams, projects })
		} catch (error) {
			console.log(error)
		}

	})

	user.get("/:handler", (req, res) => {
		res.send("API user Call to: " + req.params.handler);
	});

	user.use("/lists", require('./lists.js'));

	user.post('/create', async (req, res) => {
		const { email, password, first_name, last_name } = req.body;

		if (!email || !password) {
			return res.status(400).json({
				message: 'Email and password are required',
				slug: 'error'
			});
		}
		// TODO: figure out how to do this so that a user can be invited by email and given permission to view things based on userId even if they haven't set a password yet. Maybe some combination of a basic 'default' password that's a random string and an account status tier of invited or something  
		// check if there's already a user with given email
		const existingUser = await User.findOne({
			where: {
				email: email
			}
		})
		if (existingUser) {
			console.log('User exists');
			return res.status(400).json({
				message: 'User with that email already exists, try forgot password',
				slug: 'error'
			});
		}

		try {
			const newUser = await User.create({ email, password, first_name, last_name });

			const newOrg = await Org.create({
				name: `${first_name}'s Organization`,
				folder: `${first_name}s-organization`,
				admin: [newUser.id]
			})

			const newTeam = await Team.create({
				name: `${first_name}'s Team`,
				org: newOrg.id,
				folder: `${first_name}s-team`,
				admin: [newUser.id]
			})

			const newProject = await Project.create({
				name: `${first_name}'s Project`,
				team: newTeam.id,
				folder: `${first_name}s-project`,
				admin: [newUser.id]
			})

			newUser.org = sequelize.fn('array_append', sequelize.col('org'), newOrg.id),
				newUser.team = sequelize.fn('array_append', sequelize.col('team'), newTeam.id),
				newUser.project = sequelize.fn('array_append', sequelize.col('project'), newProject.id)
			newUser.last_active_at = getCurrentTimeStamp()

			await newUser.save()

			delete newUser.dataValues.password;

			const { token } = await VerifyAccountToken.create({
				user: newUser.id
			})
			const emailSend = sendEmail({
				email: newUser.email,
				token: token,
				templateString: 'emailConfirm'
			})
			emailSend.then(emailStatus => {
				console.log('email sent');
				console.log(emailStatus);
			}).catch(error => {
				console.log('email not sent');
				console.log(error);
			})
			const session_id = uuidv4();
			await Session.create({ token: session_id, user_id: newUser.id });

			res.cookie('session_id', session_id, { httpOnly: true }); // Possibly add more cookie options

			return res.status(200).json({
				slug: 'registered',
				message: 'User created successfully',
				user: newUser,
				org: newOrg,
				team: newTeam,
				project: newProject
			});
		} catch (error) {
			// TODO: Delete everything created if there was an error?
			// or just recreate whatever wasn't created?
			console.log(error);
			res.status(500).json({
				slug: 'error',
				message: 'An error occurred during user creation'
			});
		}
	});

	user.post('/login', async (req, res) => {
		try {
			const { email, password } = req.body;
			const user = await User.findOne({ where: { email: email } });
			console.log(user);
			if (!user) {
				return res.status(400).json({
					message: 'No user with that email',
					slug: 'error'
				});
			}

			if (user.password == '~~~~~~~~') {
				const existingUser = await User.findOne({
					where: {
						email: email
					}
				})
				const loginTokenInfo = LoginToken.create({
					token: uuidv4(),
					date_created: getCurrentTimeStamp(),
					user: existingUser.id,
					used: false
				})
				const response = sendEmail({
					email: email,
					templateString: 'loginToken',
					token: loginTokenInfo.token
				});
				response.then(emailStatus => {
					console.log(emailStatus)
					res.send({
						message: 'User has no password, please check email for magic login link',
						slug: 'error'
					})
				}).catch(error => {
					console.log(error);
					res.send({ status: 'error', errorMessage: error })
				})
			}

			const validPassword = bcrypt.compareSync(password, user.password);
			if (!validPassword) {
				return res.status(401).json({
					message: 'Incorrect password',
					slug: 'error'
				});
			}

			const session_id = uuidv4();
			await Session.create({ token: session_id, user_id: user.id });
			await User.update({ last_active_at: getCurrentTimeStamp() }, {
				where: {
					id: user.id
				}
			});

			res.cookie('session_id', session_id, { httpOnly: true }); // Possibly add more cookie options
			res.json({
				message: 'Logged in!',
				slug: 'loggedIn'
			});

		} catch (error) {
			console.log(error);
			res.status(500).json({
				message: 'An error occurred during login',
				slug: 'error'
			});
		}
	});

	user.post('/logout', async (req, res) => {
		try {
			const { session_id } = req.cookies;
			if (!session_id) {
				return res.status(400).json({ message: 'No active session found' });
			}

			const session = await Session.findOne({ where: { token: session_id } });
			if (session) {
				await session.destroy();
			}

			// Possibly add more cookie options, like domain, secure, sameSite, etc
			res.clearCookie('session_id', { httpOnly: true });
			res.json({
				message: 'Logged out!',
				slug: 'loggedOut'
			});

		} catch (error) {
			console.log(error);
			res.status(500).json({ message: 'An error occurred during logout' });
		}
	});

	// TODO: add a route for user to finish creating an account that's been invited to
	user.post('/invite', async (req, res) => {
		try {
			const { session_id } = req.cookies;
			const { giveeEmail, giverId, entityType, entityId, sendInviteEmail } = req.body;
			console.log(req.body);
			// TODO: Session ID only matters if user is being added to an organization?
			// if (!session_id) {
			// 	return res.status(400).json({ message: 'No active session found' });
			// }

			// check if there's already a user with given email
			const existingUser = await User.findOne({
				where: {
					email: email
				}
			})
			if (existingUser) {
				console.log('User exists');
				// TODO: update user to have access to whatever was given access too
				res.status(200).json({ message: 'User has been given access to this entity' });
			}
			if (!existingUser && sendInviteEmail) {
				const response = sendEmail({
					email: email,
					templateString: 'userInvite',
					// TODO: add invite type id
				});
				response.then(emailStatus => {
					console.log(emailStatus)
					res.send({ status: 'email sent' })
				}).catch(error => {
					console.log(error);
					res.send({ status: 'error', errorMessage: error })
				})
			}

		} catch (error) {
			console.log(error)
			return res.status(500).json({ message: 'An error occured inviting a new user' })
		}
	})

	user.post('/forgot-password', async (req, res) => {
		try {
			const { email } = req.body;
			console.log(req.body);
			// check if there's already a user with given email
			const existingUser = await User.findOne({
				where: {
					email: email
				}
			})
			if (!existingUser) {
				// TODO: do something real here
				console.log('User doesn\'t exist');
				res.status(200).json({ message: 'User does not exist' });
			}
			const tokenInfo = ResetPasswordToken.create({
				token: uuidv4(),
				date_created: getCurrentTimeStamp(),
				user: existingUser.id,
				used: false
			})
			const response = sendEmail({
				email: email,
				templateString: 'resetPassword',
				token: tokenInfo.token
			});
			response.then(emailStatus => {
				console.log(emailStatus)
				res.send({ status: 'email sent' })
			}).catch(error => {
				console.log(error);
				res.send({ status: 'error', errorMessage: error })
			})

		} catch (error) {
			console.log(error)
			return res.status(500).json({ message: 'An error occured inviting a new user' })
		}
	})

	user.post('/magic-login', async (req, res) => {
		try {
			const { email } = req.body;
			console.log(req.body);
			// check if there's already a user with given email
			const existingUser = await User.findOne({
				where: {
					email: email
				}
			})
			if (!existingUser) {
				// TODO: do something real here
				console.log('User doesn\'t exist');
				res.status(200).json({ message: 'User does not exist' });
			}
			const loginTokenInfo = LoginToken.create({
				token: uuidv4(),
				date_created: getCurrentTimeStamp(),
				user: existingUser.id,
				used: false
			})
			const response = sendEmail({
				email: email,
				templateString: 'loginToken',
				token: loginTokenInfo.token
			});
			response.then(emailStatus => {
				console.log(emailStatus)
				res.send({ status: 'email sent' })
			}).catch(error => {
				console.log(error);
				res.send({ status: 'error', errorMessage: error })
			})


		} catch (error) {
			console.log(error)
			res.status(500).json({ message: 'An error occured inviting a new user' })
		}
	})

	// TODO create verify email route
	user.post('/verify-emai', async (req, res) => {
		try {
			const { token } = req.body;
			if (!token) {
				return res.status(200).json({ message: 'No token sent' });
			}
			const dbToken = await VerifyAccountToken.findOne({
				where: {
					token: token
				}
			})
			// tokens only good for 15 minutes
			if ((getCurrentTimeStamp() - dbToken.date_created) > 900000) {
				return res.status(200).json({ message: 'Token Expired' });
			}
			const updatedUser = await User.update(
				{ verified: true },
				{
					where: {
						id: dbToken.user,
					},
				},
			);

			if (updatedUser) {
				return res.status(200).json({ message: 'User Verified' })
			}
			// TODO: Should we send an email on successful email verification?
			// const response = sendEmail({
			// 	email: email,
			// 	templateString: 'loginToken',
			// 	token: loginTokenInfo.token
			// });
			// response.then(emailStatus => {
			// 	console.log(emailStatus)
			// 	res.send({ status: 'email sent' })
			// }).catch(error => {
			// 	console.log(error);
			// 	res.send({ status: 'error', errorMessage: error })
			// })


		} catch (error) {
			console.log(error)
			return res.status(500).json({ message: 'An error occured verifying email' })
		}
	})

	user.use("*", (req, res) => {
		res.send("API user CALL ENDED");
	});

	return user;
})();