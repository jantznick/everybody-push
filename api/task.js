const express = require('express');
const task = express.Router();

module.exports = (() => {

	task.use("*", (req, res, next) => {
		next();
	})

	task.get("/test", (req, res) => {
		res.send('API task test call')
	})

	task.get("/:handler", (req, res) => {
		res.send("API task Call to: " + req.params.handler);
	});

	task.use("*", (req, res) => {
		res.send("API task CALL ENDED");
	});

	return task;
})();