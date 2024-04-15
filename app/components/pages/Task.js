import React, { useEffect } from 'react';
import classNames from "classnames";
import { useNavigate, useLocation } from "react-router-dom";

import { getTaskInfo } from '../../utils/fetch';

const Task = ({setShowInterstitial, task}) => {
    const navigate = useNavigate();
	const location = useLocation();

    useEffect(() => {
        console.log('new task');
        console.log(task);
        // const taskInfo = getTaskInfo(task);
	}, [task]);

    const closeInterstitial = () => {
		setShowInterstitial(false)
        navigate(location.pathname)
	};

    return (
		<div id="task">
			<div className="flex justify-center w-full mb-4">
				<span className="material-symbols-outlined mr-auto text-4xl text-white">close</span>
                <div className="font-bold">Individual Task - {task}</div>
				<span onClick={closeInterstitial} className="material-symbols-outlined ml-auto text-4xl hover:cursor-pointer">close</span>
			</div>
		</div>
	);
}

export default Task