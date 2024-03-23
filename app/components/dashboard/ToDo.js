import React from 'react';
import classNames from "classnames";
import { Draggable } from 'react-beautiful-dnd';

export const ToDo = ({ id, i, name, category, status }) => {

    return (
        <Draggable 
            draggableId={id}
            index={i}
        >
            {(provided, snapshot) => (
                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} key={id} id={id} className={classNames(
                    "task",
                    "mt-2",
                    "mx-2",
                    "rounded",
                    "p-2",
                    "bg-gray-300",
                    "hover:cursor-pointer",
                    { 'line-through': status == 'done' }
                )}
                >{name}</div>
            )}
        </Draggable>
    )
}
