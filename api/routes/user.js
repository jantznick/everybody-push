const express = require('express');
const user = express.Router();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const { sequelize, User, Session } = require('../models/index');

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

	user.post('/create', async (req, res) => {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ message: 'Email and password are required' });
		}

		try {
			const newUser = await User.create({ email, password });

			// We don't want to display hashed password in response
			delete newUser.dataValues.password;

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

			const sessionId = uuidv4();
			await Session.create({ token: sessionId, userId: user.id });

			res.cookie('sessionId', sessionId, { httpOnly: true }); // Possibly add more cookie options
			res.json({ message: 'Logged in!' });

		} catch (error) {
			console.log(error);
			res.status(500).json({ message: 'An error occurred during login' });
		}
	});

	user.post('/logout', async (req, res) => {
		try {
			const { sessionId } = req.cookies;
			if (!sessionId) {
				return res.status(400).json({ message: 'No active session found' });
			}

			const session = await Session.findOne({ where: { token: sessionId } });
			if (session) {
				await session.destroy();
			}

			// Possibly add more cookie options, like domain, secure, sameSite, etc
			res.clearCookie('sessionId', { httpOnly: true });
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