import React from 'react';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

import { ToDo } from './ToDo';

export const Category = ({ category, index, tasks, key }) => {
	const { isOver, setNodeRef, attributes, listeners } = useSortable({
		id: `category-${category.id}-${tasks[0].status}`
	});

	const style = {
		border: isOver ? '1px solid black' : undefined,
		filter: isOver ? 'blur(2px)' : undefined
	};

	return (
		<>
			<div key={index} className="category mt-2">{category.title}</div>
			<div ref={setNodeRef} {...attributes} {...listeners} style={style} className="taskContainer rounded-md pt-1 pb-4">
				<SortableContext
					items={tasks.filter(task => task.category == category)}
					strategy={verticalListSortingStrategy}
					key={index}
				>
					{tasks.map((task, i) =>
						<ToDo
							key={task.id}
							{...task}
							i={i}
						/>
					)}
				</SortableContext>
			</div>
		</>
	)
}
