const express = require('express');
const list = express.Router();

const { isAuthorizedForThat } = require('../../utils/authMiddleware')

// const { 
//     list,
//     Sublist,
//     Comment,
//     Tag
// } = require('../models');

module.exports = (() => {

	list.use("*", (req, res, next) => {
		next();
	})

	/**
	 * @openapi
	 * /api/user/list/test:
	 *   get:
	 *     description: Test API Index Route!
	 *     tags:
	 *      - Lists
	 *     responses:
	 *       200:
	 *         description: Returns API test call.
	 */
	list.get("/test", (req, res) => {
		res.send('API list test call')
	})

	list.get("/:handler", isAuthorizedForThat, (req, res) => {
		res.send("API list Call to: " + req.params.handler);
	});

	list.post('/create', isAuthorizedForThat, async (req, res) => {
		const list = await list.create(req.body);
		res.json(list);
	});

	list.post('/sublist/create', isAuthorizedForThat, async (req, res) => {
		const sublist = await Sublist.create(req.body);
		res.json(sublist);
	});

	list.use("*", (req, res) => {
		res.send("API list CALL ENDED");
	});

	return list;
})();