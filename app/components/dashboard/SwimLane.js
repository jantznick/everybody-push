import React from 'react';

import { Category } from './Category';

export const SwimLane = ({ lane, laneI, tasks, categories }) => {

    // TODO: Make the ones without tasks invisible unless there's a drag over how jira does it
    return (
        <div key={laneI} className="swimLane mx-2 bg-slate-400 p-2 w-[24%] rounded">
            <div className="swimLaneTitle p-4 uppercase border-b-black border-b-2">{lane.title}</div>
            {/* {[...new Set(tasks.filter(task => task.status == lane.key).map(task => task.category))].map((category, index) => */}
            {categories.map((category, index) => 
                <Category
                    category={category}
                    laneId={lane.id}
                    index={index}
                    tasks={tasks.filter(task => task.category == category.id)}
                    key={category.id}
                />
            )}
        </div>
    )
}
