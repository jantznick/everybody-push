import React from 'react';
import {useDroppable} from '@dnd-kit/core';

import { Category } from './Category';

export const SwimLane = ({lane, laneI, tasks, categories}) => {
    const {isOver, setNodeRef} = useDroppable({
        id: lane.key,
    });

    const style = {
        border: isOver ? '1px solid black' : undefined,
    };

	return (
        <div key={laneI} ref={setNodeRef} style={style} className="swimLane mx-2 bg-slate-400 p-2 w-[24%] rounded">
            <div className="swimLaneTitle p-4 uppercase border-b-black border-b-2">{lane.title}</div>

            {[...new Set(tasks.filter(task => task.status == lane.key).map(task => task.category))].map((category, index) =>
                <Category
                    category={categories.filter(cat => cat.id == category)[0]}
                    index={index}
                    tasks={tasks.filter(task => task.category == category)}
                />
            )}
        </div>
	)
}
