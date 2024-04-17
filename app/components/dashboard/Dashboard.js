import React, { useState, createContext, useContext, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import classNames from 'classnames';
import { v4 as uuidv4 } from 'uuid';
import { useLocation } from "react-router-dom";

import { SwimLane } from './SwimLane';

import { UserContext } from '../utils/PageWrapper';
import { InterstitialContext } from '../utils/PageWrapper';
import { getProjectTasks, saveTaskToServer } from '../../utils/fetch';

export const DraggingContext = createContext();

const data = {
	// categories: [
	// 	{
	// 		id: 'aklsjdhf',
	// 		title: 'Category One',
	// 		tasks: ['1dfha', '2ertewb'],
	// 		priority: 0
	// 	}, {
	// 		id: 'poquweiyr',
	// 		title: 'Category Two',
	// 		tasks: ['3vvrfvfc', '4ikihhjd', '5xcvxce', '6ntyhnyf'],
	// 		priority: 1
	// 	}, {
	// 		id: 'mnxcbvmxv',
	// 		title: 'Category Three',
	// 		tasks: ['7klopiog', '8xcvdfh'],
	// 		priority: 2
	// 	}
	// ]
}


const swimLanes = [
	{
		title: 'Needs Refinement',
		key: 'refinement',
		id: 'a'
	}, {
		title: 'To Do',
		key: 'to-do',
		id: 'b'
	}, {
		title: 'In Progress',
		key: 'in-progress',
		id: 'c'
	}, {
		title: 'Done',
		key: 'done',
		id: 'd'
	}
];

export const Dashboard = ({projectId, setSelectedTask}) => {
	const location = useLocation();

	const [tasks, setTasks] = useState([]);
	const [categories, setCategories] = useState([]);
	const [addingTask, setAddingTask] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const [project, setProject] = useState('');
	const [team, setTeam] = useState('');
	const [org, setOrg] = useState('');
	const [checkSelectedTask, setCheckSelectedTask] = useState(false);

	const { user } = useContext(UserContext);
	const { setShowInterstitial, setInterstitialSlug } = useContext(InterstitialContext);

	useEffect(() => {
		const endOfString = location.pathname.substring(9);
		const slash = endOfString.indexOf('/');
		const question = endOfString.indexOf('?');
		const neither = slash == -1 && question == -1;
		let firstOption = slash > question  ? '?' : '/';
		if (slash == -1) {
			firstOption = '?'
		}
		if (question == -1) {
			firstOption = '/'
		}
		const projectId = neither ? endOfString : endOfString.substring(0, endOfString.indexOf(firstOption))
		// A lot of this comes from stackoverflow, only skimmed but it seems pretty accurate
		if (location.search) location.search.substr(1).split("&").forEach(function(item) {
			var s = item.split("="),
				k = s[0],
				v = s[1] && decodeURIComponent(s[1]); //  null-coalescing / short-circuit
			if (k == 'task') {
				setSelectedTask(v)
				setShowInterstitial(true)
				setInterstitialSlug('task')
			}
		})
		setProject(projectId);
		const taskResponse = getProjectTasks(projectId);
		taskResponse.then(response => {
			setTasks(response.tasks);
			setProject(response.project.name)
			setTeam(response.team?.name)
			setOrg(response.org?.name)
		})
	}, [location]);

	const addTask = () => {
		setAddingTask(true);
	}

	const saveTask = (detailed) => {
		setAddingTask(false)
		const taskId = uuidv4();
		if (detailed) {
			setSelectedTask(taskId)
			setShowInterstitial(true)
			setInterstitialSlug('task')
		}
		const newTask = saveTaskToServer({
			title: document.getElementById('addTaskInput').value,
			status: document.getElementById('swimLanePicker').value,
			done: document.getElementById('swimLanePicker').value == 'done',
			created_by: user.id,
			project: projectId,
			id: taskId
		})
		newTask.then(response => {
			setTasks([
				...tasks,
				response
			])
		})

		// const selectedCategory = document.getElementById('categoriesPicker').value
		// const newCategories = categories.map(category => category.id == selectedCategory ? (category.tasks.push(taskId), { ...category, tasks: category.tasks }) : category)
		// setCategories([
		// 	...newCategories
		// ])
	}

	const finishDrag = (result) => {
		console.log(result);
		setIsDragging(false);

		const { destination, source, draggableId } = result;

		if (!destination) {
			return;
		}
		// TODO: validate this is accurate after update to data format change
		if (destination.droppableId === source.droppableId &&
			destination.index === source.index) {
			return;
		}

		// TODO: if droppableId is 1 character that means the task only changed lanes, not to a new category
		// droppableId of more than 1 character means the task changed lanes and new category, the first character is the new lane
		// need to bug check this but it should work
		const moved = tasks.filter(task => task.id === draggableId)[0];
		const newLane = swimLanes.filter(lane => lane.id === Array.from(destination.droppableId)[0])[0];
		const oldLane = swimLanes.filter(lane => lane.id === Array.from(source.droppableId)[0])[0];
		const oldCategoryId = source.droppableId.slice(1);
		const newCategoryId = destination.droppableId.slice(1);
		// remove task from tasks if it changed lanes or changed categories
		if (newLane.id != oldLane.id || oldCategoryId != newCategoryId) {
			tasks.splice(tasks.findIndex(task => task.id === draggableId), 1);
		}
		// task only changed lanes
		if (destination.droppableId.length == 1 && destination.droppableId != source.droppableId) {
			// set tasks plus new task
			setTasks([
				...tasks,
				{
					...moved,
					status: newLane.key,
				}
			])
		} else {
			// TODO: This is all wrong if there aren't categories and needs to be fixed
			// get old category
			const oldCategory = categories.filter(category => category.id == oldCategoryId)[0];
			// remove moved task from old category
			const taskIndexInOldCategory = oldCategory.tasks.findIndex(task => task == draggableId);
			oldCategory.tasks.splice(taskIndexInOldCategory, 1);
			// if category id is old category id, return the old category without the task, other wise return category
			const categoriesWithTaskRemoved = categories.map(category => category.id == oldCategoryId ? oldCategory : category)
			// get new category, even if its same as old
			const newCategory = categoriesWithTaskRemoved.filter(category => category.id == newCategoryId)[0];
			// add task to new category in proper spot
			// TODO: tasks aren't broken out into categories until swimlane component so this isn't working right
			newCategory.tasks.splice(destination.index, 0, draggableId)
			// if category is new category return new category with task added, otherwise return category
			const categoriesWithNewTaskAdded = categoriesWithTaskRemoved.map(category => category.id == newCategoryId ? newCategory : category)
			setTasks([
				...tasks,
				{
					...moved,
					status: newLane.key,
				}
			])
			setCategories(categoriesWithNewTaskAdded)
		}

	}

	const startDrag = () => {
		setIsDragging(true);
	}

	return (
		<DraggingContext.Provider value={isDragging}>
			<div id="dashboard" className="bg-gray-300 min-h-screen w-full">
				<div id="dashHeader" className="flex justify-between items-center px-4 py-8 uppercase">
					<div className='flex items-center'>
						<div>{org} - {team} - {project} - To Do List</div>
						{addingTask ?
							<div className='ml-20 flex justify-center items-center bg-gray-300 border-2 border-black rounded-md p-2'>
								<input type="text" name="New Task" id="addTaskInput" placeholder='Add task...' className='bg-gray-300 focus-visible:outline-none focus:outline-none placeholder:text-black' />
								{categories.length > 0 &&
									<select name="categories" id="categoriesPicker" className='p-2 bg-gray-300 mr-2'>
										{categories.map((category, index) =>
											<option value={category.id} key={index}>{category.title}</option>
										)}
									</select>
								}
								<select name="swimLanes" id="swimLanePicker" className='p-2 bg-gray-300 mr-2'>
									{swimLanes.map((lane, index) =>
										<option value={lane.key} key={index}>{lane.title}</option>
									)}
								</select>
								{/* TODO: change to be a button called save and add details or a save only button */}
								<div onClick={() => saveTask(true)} className='button mr-2'>Save and Add Details</div>
								<div onClick={() => saveTask(false)} className='button'>Save</div>
								{/* <span onClick={saveTask} className="hover:cursor-pointer material-symbols-outlined">save</span> */}
							</div>
							:
							<div onClick={addTask} className={classNames(
								"newTask",
								{ "ml-4": addingTask },
								{ "ml-20": !addingTask },
								"button"
							)}>
								NEW TASK
								<span className="material-symbols-outlined">add</span>
							</div>
						}
					</div>
				</div>
				<div className="lanes flex justify-between pb-4 min-h-[75%]">

					<DragDropContext
						onDragEnd={finishDrag}
						onDragStart={startDrag}
					>
						{/* loop through each swimlane and set the swim lane titles */}
						{swimLanes.map((lane, laneI) =>
							<SwimLane
								key={lane.key}
								categories={categories}
								tasks={tasks.filter(task => task.status == lane.key)}
								lane={lane}
								laneI={laneI}
							/>
						)}
					</DragDropContext>

				</div>
			</div>
		</DraggingContext.Provider>
	)
}
