const express = require('express');
const payment = express.Router();

module.exports = (() => {

	payment.use("*", (req, res, next) => {
		next();
	})

	payment.get("/test", (req, res) => {
		res.send('API payment test call')
	})

	payment.get("/:handler", (req, res) => {
		res.send("API payment Call to: " + req.params.handler);
	});

	payment.use("*", (req, res) => {
		res.send("API payment CALL ENDED");
	});

	return payment;
})();