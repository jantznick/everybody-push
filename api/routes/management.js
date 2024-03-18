const express = require('express');
const management = express.Router();

module.exports = (() => {

	management.use("*", (req, res, next) => {
		next();
	})

	management.get("/test", (req, res) => {
		res.send('API management test call')
	})

	management.get("/:handler", (req, res) => {
		res.send("API management Call to: " + req.params.handler);
	});

	// todo CRUD on org, team, project, category

	management.use("*", (req, res) => {
		res.send("API management CALL ENDED");
	});

	return management;
})();