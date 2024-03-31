import React, { useContext } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import classNames from 'classnames';

import { ToDo } from './ToDo';

import { DraggingContext } from './Dashboard';

export const Category = ({ laneId, category, index, tasks }) => {
    const isDragging = useContext(DraggingContext)

	return (
		<>
			<div key={index} className={classNames(
				"category",
				"mt-2",
				"flex",
				{"h-0": tasks.length < 1 && !isDragging },
				{"hidden": tasks.length < 1 && !isDragging }
			)}>{category.title}</div>
			<Droppable droppableId={laneId.concat(category.id)} >
				{(provided, snapshot) => (
					<div ref={provided.innerRef} {...provided.droppableProps} className={classNames(
						"taskContainer",
						"rounded-md",
						{"grow": isDragging},
						{"pt-1": tasks.length > 0},
						{"pb-4": tasks.length > 0},
						// {"min-h-[100px]": isDragging},
						// changed from snapshot.isDraggingOver to isDragging for testing visual
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
		</>
	)
}
