const express = require('express');
const user = express.Router();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const { sequelize, User, Session, getCurrentTimeStamp } = require('../../models/index.js');

module.exports = (() => {

	user.use("*", (req, res, next) => {
		next();
	})

	user.get("/test", (req, res) => {
		res.send('API user test call')
	})

	user.get("/:handler", (req, res) => {
		res.send("API user Call to: " + req.params.handler);
	});

    user.use("/lists", require('./lists.js'));

	user.post('/create', async (req, res) => {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ message: 'Email and password are required' });
		}

		try {
			const newUser = await User.create({ email, password });

			delete newUser.dataValues.password;
			// todo: add session cookie to response to login user
			// todo: setup verification email
			res.json({ message: 'User created successfully', user: newUser });
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