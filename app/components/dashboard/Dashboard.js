import React, { useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import classNames from 'classnames';

import { SwimLane } from './SwimLane';

const data = {
    orgs: ['Organization 1'],
    teams: ['Team 1'],
    projects: ['Project 1'],
    categories: [
        {
            id: 1,
            title: 'Category One',
            tasks: ['a', 'b'],
            priority: 0
        }, {
            id: 2,
            title: 'Category Two',
            tasks: ['c', 'd', 'e', 'f'],
            priority: 1
        }, {
            id: 3,
            title: 'Category Three',
            tasks: ['g', 'h'],
            priority: 2
        }
    ],
    tasks: [
        {
            name: 'Something to do',
            status: 'to-do',
            id: 'a'
        }, {
            name: 'Something else to do',
            status: 'to-do',
            id: 'b'
        }, {
            name: 'Something to do that\'s in Category Two',
            status: 'to-do',
            id: 'c'
        }, {
            name: 'Something from Category Two to do',
            status: 'to-do',
            id: 'd'
        }, {
            name: 'A very important task in progress',
            status: 'in-progress',
            id: 'e'
        }, {
            name: 'Another very important task that is in progress',
            status: 'in-progress',
            id: 'f'
        }, {
            name: 'A very important task to refine',
            status: 'refinement',
            id: 'g'
        }, {
            name: 'A completed task',
            status: 'done',
            id: 'h'
        },
    ]
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

export const Dashboard = () => {
    const [tasks, setTasks] = useState(data.tasks);
    const [categories, setCategories] = useState(data.categories);
    const [addingTask, setAddingTask] = useState(false);

    const addTask = () => {
        setAddingTask(true);
    }

    const saveTask = () => {
        setAddingTask(false)
    }

	const finishDrag = (result) => {
        console.log(result);
        const { destination, source, draggableId } = result;

		if (!destination) {
			return;
		}

		if (destination.droppableId === source.droppableId &&
			destination.index === source.index) {
				return;
		}

        // lot of bugs in this logic should probably start over
        const moved = tasks.filter(task => task.id === draggableId)[0];
        const newLane = swimLanes.filter(lane => lane.id === Array.from(destination.droppableId)[0])[0].key;
        const oldCategory = parseInt(Array.from(source.droppableId)[1]);
        const oldCategoryData = categories.filter(category => category.id === oldCategory)[0];
        const newCategory = Array.from(destination.droppableId)[1] === 'x' ? parseInt(Array.from(source.droppableId)[1]) : parseInt(Array.from(destination.droppableId)[1])
        const newCategoryData = categories.filter(category => category.id === newCategory)[0]
        const place = destination.index
        tasks.splice(tasks.findIndex(task => task.id === draggableId), 1);
        // remove old category
        categories.splice(categories.findIndex(category => category.id === oldCategory), 1)
        // remove new category if it's different than the old
        if (newCategory != oldCategory) {
            categories.splice(categories.findIndex(category => category.id === newCategory), 1)
        }
        // remove old category data task from tasks
        oldCategoryData.tasks.splice(source.index, 1)
        // if task only moved location then put it in new location
        if (newCategory == oldCategory) {
            oldCategoryData.tasks.splice(place, 0, draggableId)
        } else if (newCategory != oldCategory) {
            newCategoryData.tasks.splice(place, 0, draggableId)
        }
        // create new categories array
        const newCategories = [...categories, oldCategoryData];
        if (newCategory != oldCategory) {
            newCategories.push(newCategoryData);
        }
        // sort new categories array
        newCategories.sort((a, b) => parseFloat(a.priority) - parseFloat(b.priority))
        setTasks([
            ...tasks,
            {
                ...moved,
                status: newLane,
            }
        ])
        setCategories(newCategories)
    }

    return (
        <div id="dashboard" className="bg-gray-300 w-[85%] ml-[15%] min-h-screen">
            <div id="dashHeader" className="flex justify-start items-center px-4 py-8 uppercase">
                <div>{data.orgs[0]} - {data.teams[0]} - {data.projects[0]} - To Do List</div>
                {addingTask &&
                    <div className='ml-20 flex justify-center items-center bg-gray-300 border-2 border-black rounded-md p-2'>
                        <input type="text" name="New Task" id="addTask" className='bg-gray-300 focus-visible:outline-none focus:outline-none'/>
                        <span onClick={saveTask} className="hover:cursor-pointer material-symbols-outlined">save</span>
                    </div>
                }
                <div onClick={addTask} className={classNames(
                    "newTask",
                    { "ml-4": addingTask },
                    { "ml-20": !addingTask },
                    "button"
                )}>
                    NEW TASK
                    <span className="material-symbols-outlined">add</span>
                </div>
            </div>
            <div className="lanes flex justify-between pb-4 min-h-[75%]">

                <DragDropContext
                    onDragEnd={finishDrag}
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
    )
}
