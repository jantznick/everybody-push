const express = require('express');
const user = express.Router();

const { sequelize, User } = require('../models/index');

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

	user.use("*", (req, res) => {
		res.send("API user CALL ENDED");
	});

	return user;
})();