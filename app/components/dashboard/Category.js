import React from 'react';

import { ToDo } from './ToDo';

export const Category = ({category, index, tasks}) => {
	return (
        <>
            <div key={index} className="category mt-2">{category.title}</div>
            {tasks.map((task,i) => 
                <ToDo
                    {...task} 
                    i={i}
                />
            )}
        </>
	)
}
