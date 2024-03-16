import { useState } from 'react';
import { useQuery, getProjectTasks } from 'wasp/client/operations';

import Task from './Task';

const Main = () => {
	const [tasks, setTasks] = useState([])

    const handleClick = (e) => {
        console.log(e)
        const data = getProjectTasks({
            project: 3,
        }, null)
        data.then((value) => {
            setTasks(value)
        })
    }

    return (
        <div>
            <button
                onClick={handleClick}
                className='inline-flex justify-center mx-8 py-2 px-4 border border-transparent shadow-md text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            >
                Click Me
            </button>
            {tasks && tasks.map((task, idx) => (
                <Task task={task} key={idx} />
            ))}
        </div>
    )
}

export default Main