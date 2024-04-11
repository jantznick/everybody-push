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
	getCurrentTimeStamp
} = require('../../models/index.js');

module.exports = (() => {

	user.use("*", (req, res, next) => {
		next();
	})

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


			res.status(200).json({user, orgs, teams, projects})
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
			return res.status(400).json({ message: 'Email and password are required' });
		}
		// check if there's already a user with given email
		const existingUser = await User.findOne({
			where: {
				email: email
			}
		})
		if (existingUser) {
			console.log('User exists');
			res.status(200).json({ message: 'That user already exists' });
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

			// todo: setup verification email
			const session_id = uuidv4();
			await Session.create({ token: session_id, user_id: newUser.id });

			res.cookie('session_id', session_id, { httpOnly: true }); // Possibly add more cookie options

			res.json({
				message: 'User created successfully',
				user: newUser,
				org: newOrg,
				team: newTeam,
				project: newProject
			});
		} catch (error) {
			console.log(error);
			res.status(500).json({ message: 'An error occurred during user creation' });
		}
	});

	user.post('/login', async (req, res) => {
		try {
			const { email, password } = req.body;
			const user = await User.findOne({ where: { email: email } });
			console.log(user);
			if (!user) {
				return res.status(400).json({ message: 'No user with that email' });
			}

			const validPassword = bcrypt.compareSync(password, user.password);
			if (!validPassword) {
				return res.status(401).json({ message: 'Incorrect password' });
			}

			const session_id = uuidv4();
			await Session.create({ token: session_id, user_id: user.id });
			await User.update({ last_active_at: getCurrentTimeStamp() }, {
				where: {
					id: user.id
				}
			});

			res.cookie('session_id', session_id, { httpOnly: true }); // Possibly add more cookie options
			res.json({ message: 'Logged in!' });

		} catch (error) {
			console.log(error);
			res.status(500).json({ message: 'An error occurred during login' });
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
			res.json({ message: 'Logged out!' });

		} catch (error) {
			console.log(error);
			res.status(500).json({ message: 'An error occurred during logout' });
		}
	});

	user.use("*", (req, res) => {
		res.send("API user CALL ENDED");
	});

	return user;
})();