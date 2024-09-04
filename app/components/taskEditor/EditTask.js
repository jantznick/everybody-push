import React, { useRef, useEffect, useState } from 'react';
import classNames from "classnames";
import { useNavigate, useLocation } from "react-router-dom";

import { getTaskInfo } from '../../utils/fetch';
import Tiptap from '../utils/TipTap';

const Tags = () => {
	return (
		<div className="tags flex gap-2 p-2">
			<div className="tag">important</div>
			<div className="tag">future-work</div>
			<div className="tag">bug-fix</div>
			<div className="tag">preplanned</div>
		</div>
	)
}
const DescriptionTop = () => {
	return (
		<div className="taskDescriptionTop flex justify-between p-2">
			<div className='assignee'>Assignee: Nick Jantz</div>
			<div className="dueDate">09/17/2025</div>
		</div>
	)
}

const EditTask = ({ setShowInterstitial, task }) => {
	const navigate = useNavigate();
	const location = useLocation();

	const [taskInfo, setTaskInfo] = useState({});

	const [fullWidthComments, setFullWidthComments] = useState(false);
	const [isEditingDescription, setIsEditingDescription] = useState(true);

	useEffect(() => {
		const fetchedTaskInfo = getTaskInfo(task);
		fetchedTaskInfo.then(response => {
			setTaskInfo(response);
		})
	}, [task]);

	const closeInterstitial = () => {
		setShowInterstitial(false)
		navigate(location.pathname)
	};

	return (
		<div id="task" className='w-[80vw] h-[80vh]'>
			<div className="flex justify-center items-center w-full mb-4">
				<span className="material-symbols-outlined mr-auto text-4xl text-white">close</span>
				<div onClick={() => setFullWidthComments(!fullWidthComments)} className="font-bold">Individual Task - {taskInfo.title}</div>
				<span onClick={closeInterstitial} className="material-symbols-outlined ml-auto text-4xl hover:cursor-pointer">close</span>
			</div>
			<div id="editTaskBody" className={classNames(
				'flex',
				'flex-wrap',
				'gap-6'
			)}>
			{fullWidthComments ?
				<>
					<div className="taskDetails w-[64%]  shadow-lg">
						<DescriptionTop />
						<div className="description h-60">
							<div className=''>Description:</div>
							<div className='RTE'>
								<Tiptap />
							</div>
						</div>
						<Tags />
					</div>
					<div className={classNames(
						"comments",
						"h-40",
						"w-full",
						"order-last",
						"shadow-lg"
					)}>
					</div>
					<div className={classNames(
						"subTasks",
						"w-[34%]",
						"shadow-lg"
					)}>
					</div>
				</>
			:
			<>
				<div className="containThings flex flex-col gap-6 w-[64%]">
					<div className="taskDetails  shadow-lg">
						<DescriptionTop />
						<div className='RTE'>
							<Tiptap />
						</div>
						<Tags />
					</div>
					<div className={classNames(
						"comments",
						"h-40",
						"w-full",
						"shadow-lg"
					)}>
					</div>
				</div>
				<div className={classNames(
					"subTasks",
					"w-[34%]",
					"order-last",
					"shadow-lg"
				)}>
				</div>
			</>
			}
			</div>
		</div>
	);
}

export default EditTask