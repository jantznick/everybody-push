const express = require('express');
const management = express.Router();

const {
	Org,
	Team,
	Project,
	Category,
	Session,
	sequelize
} = require('../models');

const {isAuthorizedForThat} = require('../utils/authMiddleware')

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
		// TODO: update looks like this: { last_name: "Doe" }, {
		//   where: {
		//     last_name: null
		//   }
		// }
		// so we'll have to create logic for the different methods but it would still work better than rewriting a ton of methods
		// might be able to put a orgs/teams/projects handler in too
		const org = await Org[req.params.method](req.body);
		res.json(org);
	});

	const operations = {
		add: (item, path, value) => item.set(path, value),
		replace: (item, path, value) => item.set(path, value),
		remove: (item, path) => item.set(path, null),
	};

	management.post('/items/:tableName/:itemId?', isAuthorizedForThat, async (req, res) => {
		console.log('task CRUD endpoint hit')
		try {
			const { tableName, itemId } = req.params;
			const Model = sequelize.models[tableName];
			console.log(Object.keys(sequelize.models));

			if (!Model) {
				return res.status(400).json({ message: `Table ${tableName} does not exist` });
			}

			let item;
			if (req.body[0].op !== 'add') {
				item = await Model.findOne({ where: { id: itemId } });

				if (!item) {
					return res.status(404).json({ message: 'Item not found' });
				}
			}

			req.body.forEach(async ({ op, path, value }) => {
				if (!operations[op]) {
					// TODO, don't return status, just add to list of operations that were done
					return res.status(400)({ message: `Invalid operation ${op}` });
				}
				if (op == 'add') {
					const newTask = await Model.create(value);
					console.log("New Task:", newTask);
					res.json({ message: 'Item created!', item });
				} else {
					operations[op](item, path, value);
					await item.save();
					res.json({ message: 'Item updated!', item });
				}
			});

		} catch (error) {
			console.error("An error occurred:", error);
			res.status(500).json({ message: 'An error occurred' });
		}
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