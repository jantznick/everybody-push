import { type User, type Task } from 'wasp/entities';
import { HttpError } from 'wasp/server';
import { type GetProjectTasks } from 'wasp/server/operations';

export default interface iTask {
	createdAt: Date;
	title: string;
	project: number;
	done: boolean;
	assignee: number;
	description: string;
}

export const getProjectTasks: GetProjectTasks<any, any> = async (args: any, context) => {
	const projectTasks = await context.entities.Task.findMany({
		where: {
			project: args.project,
		},
		select: {
			createdAt: true,
			title: true,
			project: true,
			done: true,
			assignee: true,
			description: true
		}
	});
	return projectTasks;
}
