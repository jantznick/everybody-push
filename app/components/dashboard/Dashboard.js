import React from 'react';

const data = {
    orgs: ['Organization 1'],
    teams: ['Team 1'],
    projects: ['Project 1'],
    categories: [
        {
            id: 1,
            title: 'Category One'
        }, {
            id: 2,
            title: 'Category Two'
        }, {
            id: 3,
            title: 'Category Three'
        }
    ],
    tasks: [
        {
            category: 1,
            name: 'Something to do',
            status: 'to-do'
        }, {
            category: 1,
            name: 'Something else to do',
            status: 'to-do'
        }, {
            category: 2,
            name: 'Something to do that\'s in Category 2',
            status: 'to-do'
        }, {
            category: 2,
            name: 'Something from Category 2 to do',
            status: 'to-do'
        }, {
            category: 2,
            name: 'A very important task in progress',
            status: 'in-progress'
        }, {
            category: 2,
            name: 'Another very important task that is in progress',
            status: 'in-progress'
        }, {
            category: 3,
            name: 'A very important task to refine',
            status: 'refinement'
        }, {
            category: 3,
            name: 'A completed task',
            status: 'done'
        }, 
    ]
}

const swimLanes = [
    {
        title: 'Needs Refinement',
        key: 'refinement'
    }, {
        title: 'To Do',
        key: 'to-do'
    }, {
        title: 'In Progress',
        key: 'in-progress'
    }, {
        title: 'Done',
        key: 'done'
    }
];

export const Dashboard = () => {

	return (
		<div id="dashboard" className="bg-gray-300 w-[85%] ml-[15%] min-h-screen">
            <div id="dashHeader" className="flex justify-start items-center px-4 py-8 uppercase">
				{data.orgs[0]} - {data.teams[0]} - {data.projects[0]} - To Do List
			</div>
			<div className="lanes flex justify-between pb-4 min-h-[75%]">

            {/* loop through each swimlane and set the swim lane titles */}
            {swimLanes.map((lane, laneI) => 
                <div className="swimLane mx-2 bg-slate-400 p-2 w-[24%] rounded">
					<div className="swimLaneTitle p-4 uppercase border-b-black border-b-2">{lane.title}</div>

                    {[...new Set(data.tasks.filter(task => task.status == lane.key).map(task => task.category))].map((category, index) =>
                        <>
                            <div key={index} className="category mt-2">{data.categories.filter(cat => cat.id == category).map(newCat => newCat.title)}</div>
                            {data.tasks.filter(task => task.category == category && task.status == lane.key).map((task,i) => 
                                <div key={i} className="task mt-2 mx-2 rounded p-2 bg-gray-300 hover:cursor-pointer">{task.name}</div>
                            )}
                        </>
                    )}

                    {

                    }
				</div>
            )}

			</div>
		</div>
	)
}
