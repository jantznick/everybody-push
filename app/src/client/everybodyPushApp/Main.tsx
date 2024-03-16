import { useState } from 'react';
import { useQuery, getProjectTasks } from 'wasp/client/operations';

import iTask from '../../server/everybodyPushQueries';

import Task from './Task';

const Main = () => {
    const {data: projectTasks} = useQuery(getProjectTasks, {
        project: 3,
    })

    return (
        <div>
            {projectTasks && projectTasks.map((task, idx) => (
                <Task task={task} key={idx} />
            ))}
        </div>
    )
}

export default Main