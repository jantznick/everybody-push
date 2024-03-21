import React from 'react';
import {useDraggable} from '@dnd-kit/core';

export const ToDo = ({id, i, name, category, status}) => {
    const {attributes, listeners, setNodeRef, transform} = useDraggable({
        id: id,
    });
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

	return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes} key={id} id={id} className="task mt-2 mx-2 rounded p-2 bg-gray-300 hover:cursor-pointer">{name}</div>
	)
}
