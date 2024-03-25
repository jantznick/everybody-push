import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import classNames from 'classnames';

import { Category } from './Category';

export const SwimLane = ({ lane, laneI, tasks, categories }) => {

    // TODO: Order categories and tasks within categories so the drag and drop is a little smoother
    return (
        <div className="swimLane mx-2 bg-slate-400 p-2 w-[24%] rounded flex flex-col">
            <div className="swimLaneTitle p-4 uppercase border-b-black border-b-2">{lane.title}</div>
            {[...new Set(tasks.filter(task => task.status == lane.key).map(task => task.category))].map((category, index) =>
                <Category
                    category={categories.filter(thisCategory => thisCategory.id == category)[0]}
                    laneId={lane.id}
                    index={index}
                    tasks={tasks.filter(task => task.category == category).sort((a, b) => parseFloat(a.priority) - parseFloat(b.priority))}
                    key={category}
                />
            )}
            <Droppable droppableId={lane.id + 'x'} >
            {(provided, snapshot) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className={classNames(
                    "laneHolder",
                    "flex-grow",
                    "rounded-md",
                    "m-2",
                    { 'float-background': snapshot.isDraggingOver }
                )}
                >
                    {provided.placeholder}
                </div>
            )}
            </Droppable>
        </div>
    )
}
