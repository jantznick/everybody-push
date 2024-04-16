import React, { useContext } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import classNames from 'classnames';

import { Category } from './Category';
import { ToDo } from './ToDo';

import { DraggingContext } from './Dashboard';

export const SwimLane = ({ lane, laneI, tasks, categories }) => {
    const isDragging = useContext(DraggingContext)

    return (
        <div className="swimLane mx-2 bg-slate-400 p-2 w-[24%] rounded flex flex-col">
            <div className="swimLaneTitle p-4 uppercase border-b-black border-b-2">{lane.title}</div>
            <div className={classNames(
                    "categoryHolder",
                )}>
                {
                categories.length ?
                <>
                    {categories.map((category, index) => {
                        const categoryTasks = tasks.filter(task => category.tasks.includes(task.id))
                        return categoryTasks.length > 0 &&
                        <Category
                            category={category}
                            laneId={lane.id}
                            index={index}
                            tasks={categoryTasks}
                            key={category.id}
                        />}
                    )}
                    {/* TODO: Change this to grow based on a state set in on drag start so the size is caught properly? Might already be happening based on min-h to isDragging but not sure */}
                    <Droppable droppableId={lane.id} >
                    {(provided, snapshot) => (
                        <div ref={provided.innerRef} {...provided.droppableProps} className={classNames(
                            "laneHolder",
                            "rounded-md",
                            "my-2",
                            {'float-background': isDragging},
                            {'grow': isDragging},
                            {'float-background-dark': snapshot.isDraggingOver}
                        )}
                        >
                            {provided.placeholder}
                        </div>
                    )}
                    </Droppable>
                </>
                :
                <Droppable droppableId={lane.id} >
                    {(provided, snapshot) => (
                        <div ref={provided.innerRef} {...provided.droppableProps} className={classNames(
                            "taskContainer",
                            "rounded-md",
                            {"grow": isDragging},
                            {"pt-1": tasks.length > 0},
                            {"pb-4": tasks.length > 0},
                            {'float-background': isDragging},
                            {'float-background-dark': snapshot.isDraggingOver}
                        )}
                        >
                            {tasks && tasks.map((task, i) =>
                                <ToDo
                                    key={task.id}
                                    {...task}
                                    i={i}
                                />
                            )}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
                }
            </div>
        </div>
    )
}
