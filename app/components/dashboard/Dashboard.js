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
            title: 'Category One'
        }, {
            id: 2,
            title: 'Category Two'
        }, {
            id: 3,
            title: 'Category Three'
        }
    ],
    tasks: [
        {
            category: 1,
            name: 'Something to do',
            status: 'to-do',
            id: 'a',
            priority: 0
        }, {
            category: 1,
            name: 'Something else to do',
            status: 'to-do',
            id: 'b',
            priority: 1
        }, {
            category: 2,
            name: 'Something to do that\'s in Category Two',
            status: 'to-do',
            id: 'c',
            priority: 0
        }, {
            category: 2,
            name: 'Something from Category Two to do',
            status: 'to-do',
            id: 'd',
            priority: 1
        }, {
            category: 2,
            name: 'A very important task in progress',
            status: 'in-progress',
            id: 'e',
            priority: 0
        }, {
            category: 2,
            name: 'Another very important task that is in progress',
            status: 'in-progress',
            id: 'f',
            priority: 1
        }, {
            category: 3,
            name: 'A very important task to refine',
            status: 'refinement',
            id: 'g',
            priority: 0
        }, {
            category: 3,
            name: 'A completed task',
            status: 'done',
            id: 'h',
            priority: 0
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

        const moved = tasks.filter(task => task.id === draggableId)[0];
        const newLane = swimLanes.filter(lane => lane.id === Array.from(destination.droppableId)[0])[0].key;
        const newCategory = Array.from(destination.droppableId)[1] === 'x' ? parseInt(Array.from(source.droppableId)[1]) : parseInt(Array.from(destination.droppableId)[1])
        const place = destination.index
        tasks.splice(tasks.findIndex(task => task.id === draggableId), 1);
        tasks.map(task => {
            // handle task priority in new category/swimlane
            if (tasks.filter(task => task.category == newCategory).length == 1) {
                if (place == 0) {
                    task.priority = 1
                } else {
                    task.priority = 0
                }
            } else if (
                task.category == newCategory &&
                task.status == newLane &&
                task.priority >= place
            ) {
                task.priority += 1
            } else if (task.priority == place) {
                task.priority -= 1
            }
            // handle task priority in category/swimlane that was 'abandoned'
            if (
                task.category == moved.category &&
                task.status == moved.status &&
                task.priority > moved.priority
            ) {
                task.priority -= 1
            }
        })
        setTasks([
            ...tasks,
            {
                ...moved,
                status: newLane,
                category: newCategory,
                priority: place
            }
        ])
        
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
                            {...data}
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
