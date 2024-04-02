import React, { useContext } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import classNames from 'classnames';

import { Category } from './Category';

import { DraggingContext } from './Dashboard';

export const SwimLane = ({ lane, laneI, tasks, categories }) => {
    const isDragging = useContext(DraggingContext)

    return (
        <div className="swimLane mx-2 bg-slate-400 p-2 w-[24%] rounded flex flex-col">
            <div className="swimLaneTitle p-4 uppercase border-b-black border-b-2">{lane.title}</div>
            <div className={classNames(
                    "categoryHolder",
                    "flex",
                    "flex-col",
                    "justify-evenly",
                    {"grow": isDragging}
                )}>
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
            </div>
            {/* TODO: put these in order based on priority so that tasks moving around aren't so jerky */}
            {/* Note: it might break order across swimlanes so might have to order categories based on swimlanes */}
            {/* Note from above: same way categories have tasks, swimlanes will have to have orders */}
            {/* Note: Categories will have to grow a little bit if there is a drag happening */}
            {/* Note: make it bigger onDragStart, then if there's a drag over it make it even bigger with background */}
            <Droppable droppableId={lane.id} >
            {(provided, snapshot) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className={classNames(
                    "laneHolder",
                    "flex-grow",
                    "rounded-md",
                    "my-2",
                    {'float-background': isDragging},
                    {'float-background-dark': snapshot.isDraggingOver}
                )}
                >
                    {provided.placeholder}
                </div>
            )}
            </Droppable>
        </div>
    )
}
