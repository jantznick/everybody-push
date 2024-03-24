import React, { useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';

import { SwimLane } from './SwimLane';

const data = {
    orgs: ['Organization 1'],
    teams: ['Team 1'],
    projects: ['Project 1'],
    categories: [
        {
            id: 1,
            title: 'Category A'
        }, {
            id: 2,
            title: 'Category B'
        }, {
            id: 3,
            title: 'Category C'
        }
    ],
    tasks: [
        {
            category: 1,
            name: 'Something to do',
            status: 'to-do',
            id: 'a'
        }, {
            category: 1,
            name: 'Something else to do',
            status: 'to-do',
            id: 'b'
        }, {
            category: 2,
            name: 'Something to do that\'s in Category 2',
            status: 'to-do',
            id: 'c'
        }, {
            category: 2,
            name: 'Something from Category 2 to do',
            status: 'to-do',
            id: 'd'
        }, {
            category: 2,
            name: 'A very important task in progress',
            status: 'in-progress',
            id: 'e'
        }, {
            category: 2,
            name: 'Another very important task that is in progress',
            status: 'in-progress',
            id: 'f'
        }, {
            category: 3,
            name: 'A very important task to refine',
            status: 'refinement',
            id: 'g'
        }, {
            category: 3,
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
        tasks.splice(tasks.findIndex(task => task.id === draggableId), 1);
        setTasks([
            ...tasks,
            {
                ...moved,
                status: newLane,
                category: newCategory
            }
        ])
        
    }

    return (
        <div id="dashboard" className="bg-gray-300 w-[85%] ml-[15%] min-h-screen">
            <div id="dashHeader" className="flex justify-start items-center px-4 py-8 uppercase">
                {data.orgs[0]} - {data.teams[0]} - {data.projects[0]} - To Do List
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
