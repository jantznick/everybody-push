const express = require('express');
const user = express.Router();

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

	user.use("*", (req, res) => {
		res.send("API user CALL ENDED");
	});

	return user;
})();