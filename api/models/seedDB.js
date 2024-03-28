const {
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
} = require('./index');
const { v4 } = require('uuid');

const users = [
    {
        id: v4(),
        name: 'JakeWilliams',
        email: 'jake@email.com',
        password: 'password',
        createdAt: '2020-09-19T03:24:00',
        lastActiveAt: '2021-02-02T13:24:00',
        subscription_tier: 'Premium',
        subscription_status: 'Active',
        org: [],
        team: [],
        project: []
    }, {
        id: v4(),
        name: 'SamBrown',
        email: 'sam@email.com',
        password: 'password',
        createdAt: '2021-01-01T11:30:00',
        lastActiveAt: '2021-03-01T16:40:00',
        subscription_tier: 'Standard',
        subscription_status: 'Active',
        org: [],
        team: [],
        project: []
    }
]

const seedUsers = async () => {
    console.log('seed users');
    await User.bulkCreate(users, {validate: true})
}
seedUsers()

const orgs = [
    {
        id: v4(),
        name: 'Tech Titan Corporation',
        folder: 'tech-titan',
        admin: []
    }, {
        id: v4(),
        name: 'Digital Dynamo Inc.',
        folder: 'digital-dynamo',
        admin: []
    }
]

const seedOrgs = async () => {
    return await Org.bulkCreate(orgs, {validate: true});
}
const [techTitan, digitalDynamo] = seedOrgs()

const teams = [
    {
        id: v4(),
        name: 'Mobile Development',
        org: techTitan.id,
        folder: 'mobile-dev',
        admin: []
    }, {
        id: v4(),
        name: 'CyberSecurity',
        org: techTitan.id,
        folder: 'cyber-sec',
        admin: []
    }, {
        id: v4(),
        name: 'AI Research',
        org: techTitan.id,
        folder: 'ai-research',
        admin: []
    }, {
        id: v4(),
        name: 'Cloud Solutions',
        org: digitalDynamo.id,
        folder: 'cloud-solutions',
        admin: []
    }, {
        id: v4(),
        name: 'Web Development',
        org: digitalDynamo.id,
        folder: 'web-dev',
        admin: []
    }
]

const seedTeams = async () => {
    return await Team.bulkCreate(teams, {validate: true})
}

const [mobileDev, cyberSec, aiResearch, cloudSolutions, webDev] = seedTeams()
const projects = [
    {
        id: v4(),
        name: 'Customer Chatbot',
        team: mobileDev.id,
        folder: 'customer-chatbot',
        admin: []
    }, {
        id: v4(),
        name: 'Interactive Fleet Management App',
        team: mobileDev.id,
        folder: 'fleet-management',
        admin: []
    }, {
        id: v4(),
        name: 'Mobile Health Tracker',
        team: mobileDev.id,
        folder: 'health-tracker',
        admin: []
    }, {
        id: v4(),
        name: 'Secure Cloud Storage',
        team: cyberSec.id,
        folder: 'secure-cloud',
        admin: []
    }, {
        id: v4(),
        name: 'Intrusion Detection System',
        team: cyberSec.id,
        folder: 'ids',
        admin: []
    }, {
        id: v4(),
        name: 'Multi-Factor Authentication',
        team: cyberSec.id,
        folder: 'mfa',
        admin: []
    }, {
        id: v4(),
        name: 'Natural Language Processing',
        team: aiResearch.id,
        folder: 'nlp',
        admin: []
    }, {
        id: v4(),
        name: 'Predictive Customer Analytics',
        team: aiResearch.id,
        folder: 'customer-analytics',
        admin: []
    }, {
        id: v4(),
        name: 'Cloud Migration Strategy',
        team: cloudSolutions.id,
        folder: 'cloud-migration',
        admin: []
    }, {
        id: v4(),
        name: 'Cloud Backup & Restoration',
        team: cloudSolutions.id,
        folder: 'cloud-backup',
        admin: []
    }, {
        id: v4(),
        name: 'Software as a Service Platform',
        team: cloudSolutions.id,
        folder: 'saas-platform',
        admin: []
    }, {
        id: v4(),
        name: 'Website Redesign',
        team: webDev.id,
        folder: 'website-redesign',
        admin: []
    }, {
        id: v4(),
        name: 'E-commerce Platform',
        team: webDev.id,
        folder: 'ecommerce-platform',
        admin: []
    }, {
        id: v4(),
        name: 'Online Booking System',
        team: webDev.id,
        folder: 'online-booking',
        admin: []
    }, {
        id: v4(),
        name: 'Corporate Intranet Portal',
        team: webDev.id,
        folder: 'corporate-intranet',
        admin: []
    }
]

const seedProjects = async () => {
    return await Project.bulkCreate(projects, {validate: true})
}

const [
    customerChatbot,
    fleetManagement,
    healthTracker,
    cloudStorage,
    iDS,
    mFA,
    nLP,
    customerAnalytics,
    cloudMigration,
    cloudBackup,
    saasPlatform,
    websiteRedesign,
    ecommerce,
    onlineBooking,
    intranet
] = seedProjects()

const categories = [
    {
        id: v4(),
        name: 'Frontend',
        project: 1,
        admin: [],
        tasks: []
    }, {
        id: v4(),
        name: 'Backend',
        project: 1,
        tasks: []
    }, {
        id: v4(),
        name: 'UI Design',
        project: 2,
        tasks: []
    }, {
        id: v4(),
        name: 'Server Setup',
        project: 2,
        tasks: []
    }
]

const tasks = [
    {
        id: v4(),
        created_at: '2020-10-01T02:00:00',
        assignee: [],
        done: false,
        title: 'Create Bot Dialogue Tree',
        status: 'in-progress',
        description: 'Create a comprehensive dialogue tree for the customer chatbot',
        createdAt: '2020-10-01T02:00:00',
        dueDate: '2020-10-30T23:59:59',
        project: customerChatbot.id
    }, {
        id: v4(),
        created_at: '2020-11-01T02:00:00',
        assignee: [],
        done: false,
        title: 'Set Up Training Model',
        status: 'refinement',
        description: 'Set up a model for the chatbot to learn from.',
        createdAt: '2020-11-01T02:00:00',
        dueDate: '2020-12-31T23:59:59',
        project: customerChatbot.id
    }
]

const seedTasks = async () => {
    return await Task.bulkCreate(tasks, {validate: true})
}
seedTasks()
