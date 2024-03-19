const express = require('express');
const management = express.Router();

const { 
    Org,
    Team,
    Project,
    Category,
} = require('../models');

const isAuthorizedForThat = (req, res, next) => {
    // your authorization logic here 
    next();
};

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
	management.post('/orgs/:method', isAuthorizedForThat, async (req, res) => {
		// Include validations, try-catch and business logic as necessary
		console.log(req.body)
		// TODO: update looks like this: { lastName: "Doe" }, {
		//   where: {
		//     lastName: null
		//   }
		// }
		// so we'll have to create logic for the different methods but it would still work better than rewriting a ton of methods
		// might be able to put a orgs/teams/projects handler in too
		const org = await Org[req.params.method](req.body);
		res.json(org);
	});
	
	management.post('/teams/create', isAuthorizedForThat, async (req, res) => {
		const team = await Team.create(req.body);
		res.json(team);
	});
	
	management.post('/projects/create', isAuthorizedForThat, async (req, res) => {
		const project = await Project.create(req.body);
		res.json(project);
	});
	
	management.post('/categories/create', isAuthorizedForThat, async (req, res) => {
		const category = await Category.create(req.body);
		res.json(category);
	});

	management.use("*", (req, res) => {
		res.send("API management CALL ENDED");
	});

	return management;
})();