import React, { useState } from 'react';
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core';

import { SwimLane } from './SwimLane';
import { PresentationalToDo } from './PresentationalToDo';

const data = {
    orgs: ['Organization 1'],
    teams: ['Team 1'],
    projects: ['Project 1'],
    categories: [
        {
            id: 1,
            title: 'High Priority'
        }, {
            id: 2,
            title: 'Medium Priority'
        }, {
            id: 3,
            title: 'Low Priority'
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
        key: 'refinement'
    }, {
        title: 'To Do',
        key: 'to-do'
    }, {
        title: 'In Progress',
        key: 'in-progress'
    }, {
        title: 'Done',
        key: 'done'
    }
];

export const Dashboard = () => {
    const [tasks, setTasks] = useState(data.tasks);
    const [activeId, setActiveId] = useState(null);

    function handleDragStart(event) {
        console.log(event)
        const { active } = event;

        setActiveId(active.id);
    }

    function handleDragEnd(event) {
        console.log(event);
        if (event.active.id !== event.over.id) {
            if (['done', 'to-do', 'in-progress', 'refinement'].includes(event.over.id)) {
                setTasks(tasks.map(task => task.id == event.active.id ? { ...task, status: event.over.id } : task))
            } else if (event.over.id.includes('category')) {
                setTasks(tasks.map(task => task.id == event.active.id ? {
                    ...task,
                    status: tasks.filter(task => task.id == event.over.data.current.sortable.items[0])[0].status,
                    category: tasks.filter(task => task.id == event.over.data.current.sortable.items[0])[0].category,
                } : task))
            } else {
                setTasks(tasks.map(task => task.id == event.active.id ? {
                    ...task,
                    status: tasks.filter(task => task.id == event.over.id)[0].status,
                    category: tasks.filter(task => task.id == event.over.id)[0].category,
                } : task))
            }
        }
        setActiveId(null);
    }

    return (
        <div id="dashboard" className="bg-gray-300 w-[85%] ml-[15%] min-h-screen">
            <div id="dashHeader" className="flex justify-start items-center px-4 py-8 uppercase">
                {data.orgs[0]} - {data.teams[0]} - {data.projects[0]} - To Do List
            </div>
            <div className="lanes flex justify-between pb-4 min-h-[75%]">

                <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart} collisionDetection={closestCenter}>
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
                    <DragOverlay >
                        {activeId ? <PresentationalToDo id={activeId} status={tasks.filter(task => task.id == activeId)[0].status} name={tasks.filter(task => task.id == activeId)[0].name} /> : null}
                    </DragOverlay>
                </DndContext>

            </div>
        </div>
    )
}
