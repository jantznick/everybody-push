const express = require('express');
const api = express.Router();

module.exports = (() => {
	api.use("*", (req, res, next) => {
		next();
	})

	api.use("/user", require('./user'));
	api.use("/payment", require('./payment.js'));
	api.use("/management", require('./management.js'));
	api.use("/task", require('./task.js'));

	api.get("/test", (req, res) => {
		res.send("API test call");
	});

	api.get("/:handler", (req, res) => {
		res.send("API call to: " + req.params.handler);
	});

	api.use("*", (req, res) => {
		res.send("API CALL ENDED");
	});

	return api;
})();