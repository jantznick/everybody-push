const express = require('express');
const task = express.Router();

const { 
    Task,
    Subtask,
    Comment,
    Tag,
	Team,
	Org
} = require('../models');

const {isAuthorizedForThat} = require('../utils/authMiddleware')

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

	task.post('/create', async (req, res) => {
		try {
			const createdTask = await Task.create(req.body);
			res.status(200).json(createdTask);
		} catch (error) {
			console.log(error);
			res.status(400).json({
				slug: 'error',
				message: 'Error saving task to database',
				error: JSON.stringify(error)
			})
		}
	});

	task.get("/:taskId/info", async (req, res) => {
		try {
			const fetchedTask = await Task.findOne({ where: { id: req.params.taskId }})
			res.status(200).json(fetchedTask);
		} catch (error) {
			res.status(400).json({
				slug: 'error',
				message: 'Error retrieving task'
			})
		}
	})

	task.post('/subtask/create', isAuthorizedForThat, async (req, res) => {
		const subtask = await Subtask.create(req.body);
		res.json(subtask);
	});

	task.post('/comment/create', isAuthorizedForThat, async (req, res) => {
		const comment = await Comment.create(req.body);
		res.json(comment);
	});

	task.post('/tag/create', isAuthorizedForThat, async (req, res) => {
		const tag = await Tag.create(req.body);
		res.json(tag);
	});

	task.use("*", (req, res) => {
		res.send("API task CALL ENDED");
	});

	return task;
})();