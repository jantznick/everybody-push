const Sequelize = require('sequelize');
const pg = require('pg');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

require('dotenv').config()

const sequelize = new Sequelize(process.env.DATABASE_URL, {
	dialectModule: pg
})

const getCurrentTimeStamp = () => {
	var d = new Date(0);
	d.setUTCSeconds(Date.now() / 1000);
	return d;
}

const anonymousAnimalListNames = [
	"Anonymous Alligator's Tasks",
	"Busy Beaver's Chores",
	"Curious Cat's Missions",
	"Diligent Dolphin's Duties",
	"Energetic Elephant's Agenda",
	"Fast Fox's Checklist",
	"Gleeful Gorilla's Assignments",
	"Helpful Hedgehog's Plan",
	"Innovative Iguana's Objectives",
	"Jolly Jellyfish's Undertakings",
	"Keen Kangaroo's Activities",
	"Lively Lion's Worklist",
	"Meticulous Meerkat's Projects",
	"Neat Nightingale's Obligations",
	"Organized Octopus's Goals",
	"Proactive Penguin's Schedule",
	"Quick Quokka's Responsibilities",
	"Resourceful Rabbit's Brief",
	"Smart Squirrel's Blueprint",
	"Tenacious Turtle's Steps",
	"Ultra-guided Unicorn's Tasks",
	"Vigilant Viper's Scheme",
	"Wise Whale's Procedures",
	"Xtra-conscientious X-ray Fish's Designs",
	"Yielding Yak's Program",
	"Zestful Zebra's Framework",
]

const User = sequelize.define('user', {
	id: { type: Sequelize.STRING, primaryKey: true },
	first_name: Sequelize.STRING,
	last_name: Sequelize.STRING,
	email: Sequelize.STRING,
	password: Sequelize.STRING,
	created_at: Sequelize.DATE,
	status: Sequelize.STRING,
	last_active_at: Sequelize.DATE,
	subscription_tier: Sequelize.STRING,
	subscription_status: Sequelize.STRING,
	org: Sequelize.ARRAY({ type: Sequelize.STRING, }),
	team: Sequelize.ARRAY({ type: Sequelize.STRING }),
	project: Sequelize.ARRAY({ type: Sequelize.STRING })
}, {
	hooks: {
		beforeCreate: (user) => {
			const salt = bcrypt.genSaltSync(10);
			user.password = bcrypt.hashSync(user.password ? user.password : '~~~~~~~~', salt);
			user.id = uuidv4();
			user.last_active_At = getCurrentTimeStamp();
			user.subscription_tier = user.subscription_tier || 'free'
			user.subscription_status = user.subscription_status || 'not-paid'
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
	admin: Sequelize.ARRAY({ type: Sequelize.STRING, references: { model: User.id } })
}, {
	hooks: {
		beforeCreate: (org) => {
			org.id = org.id || uuidv4();
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
	admin: Sequelize.ARRAY({ type: Sequelize.STRING, references: { model: User.id } })
}, {
	hooks: {
		beforeCreate: (team) => {
			team.id = team.id || uuidv4();
			team.name = team.name || ''
			team.org = team.org || ''
			team.folder = team.folder || ''
			team.admin = team.admin || []
		}
	}
});

const Project = sequelize.define('project', {
	id: { type: Sequelize.STRING, primaryKey: true },
	name: Sequelize.STRING,
	team: { type: Sequelize.STRING, references: { model: Team, key: 'id' } },
	folder: Sequelize.STRING,
	admin: Sequelize.ARRAY({ type: Sequelize.STRING, references: { model: User.id } })
}, {
	hooks: {
		beforeCreate: (project) => {
			project.id = project.id || uuidv4();
			project.name = project.name || anonymousAnimalListNames[Math.floor(Math.random() * anonymousAnimalListNames.length)]
			project.team = project.team || []
			project.folder = project.folder || ''
			project.admin = project.admin || []
		}
	}
});

const Task = sequelize.define('task', {
	id: { type: Sequelize.STRING, primaryKey: true },
	created_at: Sequelize.DATE,
	created_by: { type: Sequelize.STRING, references: { model: User, key: 'id' } },
	assignee: { type: Sequelize.STRING, allowNull: true, references: { model: User, key: 'id' } },
	done: Sequelize.BOOLEAN,
	project: { type: Sequelize.STRING, references: { model: Project, key: 'id' } },
	title: Sequelize.STRING,
	status: Sequelize.STRING,
	description: Sequelize.STRING,
	due_date: Sequelize.DATE
}, {
	hooks: {
		beforeCreate: (task) => {
			task.id = task.id || uuidv4();
			task.created_at = getCurrentTimeStamp();
			task.created_by = task.created_by || null
			task.assignee = task.assignee || null
			task.done = task.done || false
			task.project = task.project || []
			task.title = task.title || ''
			task.status = task.status || ''
			task.description = task.description || ''
			task.due_date = task.dueDate || null
		}
	}
});

const Category = sequelize.define('category', {
	id: { type: Sequelize.STRING, primaryKey: true },
	title: Sequelize.STRING,
	project: { type: Sequelize.STRING, references: { model: Project, key: 'id' } },
	admin: Sequelize.ARRAY({ type: Sequelize.STRING, references: { model: User.id } }),
	tasks: Sequelize.ARRAY({ type: Sequelize.STRING, references: { model: Task.id } }),
	priority: Sequelize.INTEGER
}, {
	hooks: {
		beforeCreate: (category) => {
			category.id = uuidv4();
		}
	}
});

const Comment = sequelize.define('comment', {
	id: { type: Sequelize.STRING, primaryKey: true },
	name: Sequelize.STRING,
	task: { type: Sequelize.STRING, references: { model: Task, key: 'id' } },
	user: { type: Sequelize.STRING, references: { model: User, key: 'id' } },
	content: Sequelize.STRING,
	created_at: Sequelize.DATE
}, {
	hooks: {
		beforeCreate: (comment) => {
			comment.id = uuidv4();
		}
	}
});

const Tag = sequelize.define('tag', {
	id: { type: Sequelize.STRING, primaryKey: true },
	name: Sequelize.STRING,
	task: { type: Sequelize.STRING, references: { model: Task, key: 'id' } }
}, {
	hooks: {
		beforeCreate: (tag) => {
			tag.id = uuidv4();
		}
	}
});

const Subtask = sequelize.define('subtask', {
	id: { type: Sequelize.STRING, primaryKey: true },
	done: Sequelize.BOOLEAN,
	task: { type: Sequelize.STRING, references: { model: Task, key: 'id' } },
	assignee: { type: Sequelize.STRING, references: { model: User, key: 'id' } }
}, {
	hooks: {
		beforeCreate: (subtask) => {
			subtask.id = uuidv4();
		}
	}
});

const LoginToken = sequelize.define('loginToken', {
	token: { type: Sequelize.STRING, primaryKey: true, unique: true },
	date_created: Sequelize.DATE,
	user: { type: Sequelize.STRING, references: { model: User, key: 'id' } },
	short_code: Sequelize.STRING,
	used: Sequelize.BOOLEAN
}, {
	hooks: {
		beforeCreate: (loginToken) => {
			loginToken.date_created = getCurrentTimeStamp()
		}
	}
});

const ResetPasswordToken = sequelize.define('resetPasswordToken', {
	token: { type: Sequelize.STRING, primaryKey: true, unique: true },
	date_created: Sequelize.DATE,
	user: { type: Sequelize.STRING, references: { model: User, key: 'id' } },
	short_code: Sequelize.STRING,
	used: Sequelize.BOOLEAN
}, {
	hooks: {
		beforeCreate: (resetPasswordToken) => {
			resetPasswordToken.date_created = getCurrentTimeStamp()
		}
	}
});

const Session = sequelize.define('session', {
	token: { type: Sequelize.STRING, allowNull: false },
	user_id: { type: Sequelize.STRING, allowNull: false, references: { model: User, key: 'id' } }
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
	Session,
	getCurrentTimeStamp
}