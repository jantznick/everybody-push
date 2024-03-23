import React from 'react';
import { Droppable } from 'react-beautiful-dnd';

import { ToDo } from './ToDo';

export const Category = ({ laneId, category, index, tasks, key }) => {
	return (
		<>
			<div key={index} className="category mt-2">{category.title}</div>
			<Droppable droppableId={laneId + category.id} >
				{(provided, snapshot) => (
					<div ref={provided.innerRef} {...provided.droppableProps} className="taskContainer rounded-md pt-1 pb-4">
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
