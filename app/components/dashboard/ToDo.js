import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import classNames from "classnames";

export const ToDo = ({ id, i, name, category, status }) => {
    // const {attributes, listeners, setNodeRef, transform} = useDraggable({
    //     id: id,
    // });
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({
        id: id,
        transition: {
            duration: 150, // milliseconds
            easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
        }
    });
    // const style = transform ? {
    //     transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    // } : undefined;

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes} key={id} id={id} className={classNames(
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
    )
}

// className={classNames(
//     "step",
//     "flex",
//     "justify-center",
//     "mx-auto",
//     "space-x-2",
//     "hover:cursor-pointer",
//     { 'text-gray-500': icon !== formStep }
// )}