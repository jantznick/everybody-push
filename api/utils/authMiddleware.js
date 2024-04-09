// const { 
//     list,
//     Sublist,
//     Comment,
//     Tag
// } = require('../models');

const {
	Session,
	User,
	Task
} = require('../models')

export const isAuthorizedForThat = async (req, res, next) => {
    console.log("Is authorized for that Middleware:");
    console.log(req.cookies);
	try {
		const token = req.cookies.session_id;
		if (!token) throw new Error("No token provided");

		const session = await Session.findOne({ where: { token: token } });
		if (!session) throw new Error("Session not found");

		const user = await User.findOne({ where: { id: session.user_id } });
		if (!user) throw new Error("User not found");

		// Check if user has the necessary permissions
		// As an example, check if user belongs to the same org
		const taskId = req.params.taskId || req.body.taskId || 'zxcviu-234234-szdcxv-234-dv'; // depends on your endpoint
		const task = await Task.findOne({ where: { id: taskId } });

		console.log(task)
		
		// this is half sudo code to be fixed
		if (!user.project.contains(task.org) && !user.team.contains(task.team)) {
			throw new Error("User does not have necessary permissions");
		}

		next();
	} catch (error) {
		console.error(error);
		res.status(401).json({ message: error.message });
	}
	next();
};
