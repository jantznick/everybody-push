const Sequelize = require('sequelize');
const pg = require('pg');
const bcrypt = require('bcryptjs');

require('dotenv').config()

const sequelize = new Sequelize(process.env.DATABASE_URL, {
	dialectModule: pg
})

const Org = sequelize.define('org', {
	id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	name: Sequelize.STRING,
	folder: Sequelize.STRING,
	admin: Sequelize.STRING
});

const Team = sequelize.define('team', {
	id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	name: Sequelize.STRING,
	org: { type: Sequelize.INTEGER, references: { model: Org, key: 'id' } },
	folder: Sequelize.STRING,
	admin: Sequelize.STRING
});

const Project = sequelize.define('project', {
	id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	name: Sequelize.STRING,
	team: { type: Sequelize.INTEGER, references: { model: Team, key: 'id' } },
	folder: Sequelize.STRING,
	admin: Sequelize.STRING
});

const Category = sequelize.define('category', {
	id: { type: Sequelize.INTEGER, primaryKey: true },
	name: Sequelize.STRING,
	project: { type: Sequelize.INTEGER, references: { model: Project, key: 'id' } },
	admin: Sequelize.STRING
});

const User = sequelize.define('user', {
	id: { type: Sequelize.INTEGER, primaryKey: true },
	name: Sequelize.STRING,
	email: Sequelize.STRING,
	password: Sequelize.STRING,
	createdAt: Sequelize.DATE,
	lastActiveAt: Sequelize.DATE,
	subscriptionTier: Sequelize.STRING,
	subscriptionStatus: Sequelize.STRING,
	org: Sequelize.INTEGER,
	team: Sequelize.INTEGER,
	project: Sequelize.INTEGER
}, {
	hooks: {
		beforeCreate: (user) => {
			const salt = bcrypt.genSaltSync(10);
			user.password = bcrypt.hashSync(user.password, salt);
		}
	}
});

const Task = sequelize.define('task', {
	id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	created_at: Sequelize.DATE,
	assignee: { type: Sequelize.INTEGER, references: { model: User, key: 'id' } },
	done: Sequelize.BOOLEAN,
	category: { type: Sequelize.INTEGER, references: { model: Category, key: 'id' } },
	title: Sequelize.STRING,
	description: Sequelize.STRING,
	createdAt: Sequelize.DATE,
	dueDate: Sequelize.DATE
});

const Comment = sequelize.define('comment', {
	id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	name: Sequelize.STRING,
	task: { type: Sequelize.INTEGER, references: { model: Task, key: 'id' } },
	user: { type: Sequelize.INTEGER, references: { model: User, key: 'id' } },
	content: Sequelize.STRING,
	createdAt: Sequelize.DATE
});

const Tag = sequelize.define('tag', {
	id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	name: Sequelize.STRING,
	task: { type: Sequelize.INTEGER, references: { model: Task, key: 'id' } }
});

const Subtask = sequelize.define('subtask', {
	id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	done: Sequelize.BOOLEAN,
	task: { type: Sequelize.INTEGER, references: { model: Task, key: 'id' } },
	assignee: { type: Sequelize.INTEGER, references: { model: User, key: 'id' } }
});

const LoginToken = sequelize.define('loginToken', {
	token: { type: Sequelize.STRING, primaryKey: true, unique: true },
	dateCreated: Sequelize.DATE,
	user: { type: Sequelize.INTEGER, references: { model: User, key: 'id' } },
	shortCode: Sequelize.STRING,
	used: Sequelize.BOOLEAN
});

const ResetPasswordToken = sequelize.define('resetPasswordToken', {
	token: { type: Sequelize.STRING, primaryKey: true, unique: true },
	dateCreated: Sequelize.DATE,
	user: { type: Sequelize.INTEGER, references: { model: User, key: 'id' } },
	shortCode: Sequelize.STRING,
	used: Sequelize.BOOLEAN
});

// sequelize.sync({force: true})
// .then(() => console.log('Tables have been successfully created, if one doesn\'t exist'))
// .catch(error => console.log('An error occurred while creating the table:', error));

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
	ResetPasswordToken
}