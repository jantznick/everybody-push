import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import classNames from 'classnames';

import { ToDo } from './ToDo';

export const Category = ({ laneId, category, index, tasks }) => {
	return (
		<>
			<div key={index} className="category mt-2 flex justify-between items-center">{category.title}<span className="hover:cursor-pointer material-symbols-outlined">drag_handle</span></div>
			<Droppable droppableId={laneId + category.id} >
				{(provided, snapshot) => (
					<div ref={provided.innerRef} {...provided.droppableProps} className={classNames(
						"taskContainer",
						"rounded-md",
						"pt-1",
						"pb-4",
						{ 'float-background': snapshot.isDraggingOver }
					)}
					>
						{tasks.map((task, i) =>
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
