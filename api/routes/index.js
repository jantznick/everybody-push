const express = require('express');
const api = express.Router();
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Everybody Push API Docs',
			version: '1.0.0',
		},
	},
	apis: ['./api/routes/*.js', './api/routes/**/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = (() => {


	/**
	 * @swagger
	 * tags:
	 *   - name: Users
	 *     description: API for user management
	 *   - name: Lists
	 *     description: API for list management
	 *   - name: Organizations
	 *     description: API for organization management
	 */

	api.use("*", (req, res, next) => {
		next();
	})

	api.get("/swagger/swagger.json", (req, res) => res.json(swaggerSpec));
	api.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

	api.use("/user", require('./user'));
	api.use("/payment", require('./payment.js'));
	api.use("/management", require('./management.js'));
	api.use("/task", require('./task.js'));
	api.use("/project", require('./project.js'));

	/**
	 * @openapi
	 * /api/test:
	 *   get:
	 *     description: Test API Index Route!
	 *     responses:
	 *       200:
	 *         description: Returns API test call.
	 */
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