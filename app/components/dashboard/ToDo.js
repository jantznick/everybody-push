import React from 'react';
import classNames from "classnames";
import { Draggable } from '@hello-pangea/dnd';
import { useNavigate, useLocation } from "react-router-dom";

export const ToDo = ({ id, i, title, category, status }) => {
	const navigate = useNavigate();
	const location = useLocation();

    const handleEditClick = (event) => {
        navigate(`${location.pathname}?task=${{...event.target.dataset}.taskId}`)
    }

    return (
        <Draggable
            draggableId={id}
            index={i}
            key={id}
        >
            {(provided, snapshot) => (
                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} key={id} id={id} className={classNames(
                    "task",
                    "mt-2",
                    "mx-2",
                    "rounded",
                    "p-2",
                    "flex",
                    "justify-between",
                    "items-center",
                    "bg-gray-300",
                    "hover:cursor-pointer",
                )}
                >
                    <span className={classNames({ 'line-through': status == 'done' })}>{title}</span>
                    <span onClick={handleEditClick} data-task-id={id} className="hover:cursor-pointer material-symbols-outlined">edit</span>
                </div>
            )}
        </Draggable>
    )
}
