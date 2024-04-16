const express = require('express');
const project = express.Router();

const { 
    Project,
    Task,
    Team,
    Org
} = require('../models');

const {isAuthorizedForThat} = require('../utils/authMiddleware')

module.exports = (() => {

	project.use("*", (req, res, next) => {
		next();
	})

	project.get("/test", (req, res) => {
		res.send('API project test call')
	})

	project.get("/:handler", (req, res) => {
		res.send("API project Call to: " + req.params.handler);
	});

    project.get("/:projectId/tasks", async (req, res) => {
        const {projectId} = req.params;
        const fetchedProject = await Project.findOne({ where: { id: projectId }})
        const tasks = await Task.findAll({ where: { project: projectId }})

        if (!fetchedProject) {
            return res.status(200).json({ message: `Project ${projectId} does not exist` });
        }

        const fetchedTeam = await Team.findOne({ where: { id: fetchedProject.team }})
        const fetchedOrg = await Org.findOne({ where: { id: fetchedTeam.org }})

        if (!tasks) {
            return res.status(200).json({ message: `Project ${tableName} contains no tasks` });
        }

        res.status(200).json({
            project: fetchedProject,
            team: fetchedTeam || {},
            org: fetchedOrg || {},
            tasks: tasks || {}
        })
    })

	project.use("*", (req, res) => {
		res.send("API project CALL ENDED");
	});

	return project;
})();