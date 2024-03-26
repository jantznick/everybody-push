const Sequelize = require('sequelize');
const pg = require('pg');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

require('dotenv').config()

const sequelize = new Sequelize(process.env.DATABASE_URL, {
	dialectModule: pg
})

const User = sequelize.define('user', {
	id: { type: Sequelize.STRING, primaryKey: true },
	firstName: Sequelize.STRING,
	lastName: Sequelize.STRING,
	email: Sequelize.STRING,
	password: Sequelize.STRING,
	createdAt: Sequelize.DATE,
	lastActiveAt: Sequelize.DATE,
	subscriptionTier: Sequelize.STRING,
	subscriptionStatus: Sequelize.STRING,
	org: Sequelize.ARRAY({ type: Sequelize.STRING,}),
	team: Sequelize.ARRAY({ type: Sequelize.STRING }),
	project: Sequelize.ARRAY({ type: Sequelize.STRING})
}, {
	hooks: {
		beforeCreate: (user) => {
			const salt = bcrypt.genSaltSync(10);
			user.password = bcrypt.hashSync(user.password, salt);
			user.id = uuidv4();
			user.subscriptionTier = user.subscriptionTier || 'free'
			user.subscriptionStatus = user.subscriptionStatus || 'not-paid'
			user.org = user.org || []
			user.team = user.team || []
			user.project = user.project || []
		}
	}
});

const Org = sequelize.define('org', {
	id: { type: Sequelize.STRING, primaryKey: true },
	name: Sequelize.STRING,
	folder: Sequelize.STRING,
	admin: Sequelize.ARRAY({ type: Sequelize.STRING, references: {model: User.id}})
}, {
	hooks: {
		beforeCreate: (org) => {
			org.id = uuidv4();
			org.name = org.name || ''
			org.folder = org.folder || ''
			org.admin = org.admin || []
		}
	}
});

const Team = sequelize.define('team', {
	id: { type: Sequelize.STRING, primaryKey: true },
	name: Sequelize.STRING,
	org: { type: Sequelize.STRING, references: { model: Org, key: 'id' } },
	folder: Sequelize.STRING,
	admin: Sequelize.ARRAY({ type: Sequelize.STRING, references: {model: User.id}})
}, {
	hooks: {
		beforeCreate: (team) => {
			team.id = uuidv4();
			team.name = team.name || ''
			team.org = team.org || ''
			team.folder = team.folder || ''
			team.admin = team.admin || []
		}
	}
});

const Project = sequelize.define('project', {
	id: { type: Sequelize.STRING, primaryKey: true, autoIncrement: true },
	name: Sequelize.STRING,
	team: { type: Sequelize.STRING, references: { model: Team, key: 'id' } },
	folder: Sequelize.STRING,
	admin: Sequelize.ARRAY({ type: Sequelize.STRING, references: {model: User.id}})
});

const Task = sequelize.define('task', {
	id: { type: Sequelize.STRING, primaryKey: true, autoIncrement: true },
	created_at: Sequelize.DATE,
	created_by: { type: Sequelize.STRING, references: { model: User, key: 'id' } },
	assignee: { type: Sequelize.STRING, references: { model: User, key: 'id' } },
	done: Sequelize.BOOLEAN,
	project: { type: Sequelize.INTEGER, references: { model: Project, key: 'id' } },
	title: Sequelize.STRING,
	status: Sequelize.STRING,
	description: Sequelize.STRING,
	createdAt: Sequelize.DATE,
	dueDate: Sequelize.DATE
}, {
	hooks: {
		beforeCreate: (task) => {
			task.id = uuidv4();
			var d = new Date(0);
			d.setUTCSeconds(Date.now()/1000);
			task.created_at = d
			task.created_by = task.userId || 0
			task.assignee = task.assignee || 0
			task.done = task.done || false
			task.project = task.project || []
			task.title = task.title || ''
			task.status = task.status || ''
			task.description = task.description || ''
			task.createdAt = d
			task.dueDate = task.dueDate || null
		}
	}
});

const Category = sequelize.define('category', {
	id: { type: Sequelize.INTEGER, primaryKey: true },
	name: Sequelize.STRING,
	project: { type: Sequelize.INTEGER, references: { model: Project, key: 'id' } },
	admin: Sequelize.ARRAY({ type: Sequelize.STRING, references: {model: User.id}}),
	tasks: Sequelize.ARRAY({ type: Sequelize.STRING, references: {model: Task.id}})
});

const Comment = sequelize.define('comment', {
	id: { type: Sequelize.STRING, primaryKey: true, autoIncrement: true },
	name: Sequelize.STRING,
	task: { type: Sequelize.STRING, references: { model: Task, key: 'id' } },
	user: { type: Sequelize.STRING, references: { model: User, key: 'id' } },
	content: Sequelize.STRING,
	createdAt: Sequelize.DATE
});

const Tag = sequelize.define('tag', {
	id: { type: Sequelize.STRING, primaryKey: true, autoIncrement: true },
	name: Sequelize.STRING,
	task: { type: Sequelize.STRING, references: { model: Task, key: 'id' } }
});

const Subtask = sequelize.define('subtask', {
	id: { type: Sequelize.STRING, primaryKey: true, autoIncrement: true },
	done: Sequelize.BOOLEAN,
	task: { type: Sequelize.STRING, references: { model: Task, key: 'id' } },
	assignee: { type: Sequelize.STRING, references: { model: User, key: 'id' } }
});

const LoginToken = sequelize.define('loginToken', {
	token: { type: Sequelize.STRING, primaryKey: true, unique: true },
	dateCreated: Sequelize.DATE,
	user: { type: Sequelize.STRING, references: { model: User, key: 'id' } },
	shortCode: Sequelize.STRING,
	used: Sequelize.BOOLEAN
});

const ResetPasswordToken = sequelize.define('resetPasswordToken', {
	token: { type: Sequelize.STRING, primaryKey: true, unique: true },
	dateCreated: Sequelize.DATE,
	user: { type: Sequelize.STRING, references: { model: User, key: 'id' } },
	shortCode: Sequelize.STRING,
	used: Sequelize.BOOLEAN
});

const Session = sequelize.define('session', {
	token: { type: Sequelize.STRING, allowNull: false },
	userId: { type: Sequelize.STRING, allowNull: false, references: { model: User, key: 'id' }}
});

sequelize.sync({ alter: true })
.then(() => console.log('Tables have been successfully updated, if one doesn\'t exist'))
.catch(error => console.log('An error occurred while creating the table:', error));

module.exports = {
	sequelize,
	Org,
	Team,
	Project,
	Category,
	Task,
	Subtask,
	Comment,
	Tag,
	User,
	LoginToken,
	ResetPasswordToken,
	Session
}