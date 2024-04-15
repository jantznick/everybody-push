import React, { useState, createContext } from 'react';
import {useParams} from "react-router-dom";

import { LeftDrawer } from '../utils/LeftDrawer';
import { Dashboard } from '../dashboard/Dashboard';
import { PageWrapper } from '../utils/PageWrapper';

export const TaskContext = createContext();

export const EverybodyPush = () => {
    const {projectId} = useParams();

	const [selectedTask, setSelectedTask] = useState('');

	return (
        <TaskContext.Provider value={selectedTask}>
            <PageWrapper>
                {/* <div className="flex"> */}
                    {/* <LeftDrawer /> */}
                    <Dashboard projectId={projectId} setSelectedTask={setSelectedTask} />
                {/* </div> */}
            </PageWrapper>
        </TaskContext.Provider>
	)
}
