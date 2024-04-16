import React, { useRef, useEffect, useState } from 'react';
import classNames from "classnames";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuill } from 'react-quilljs';
import { RenderDelta } from 'quill-delta-to-react';

import { getTaskInfo } from '../../utils/fetch';

const EditTask = ({ setShowInterstitial, task }) => {
	const navigate = useNavigate();
	const location = useLocation();

	const [taskInfo, setTaskInfo] = useState({});
	const [quillDelta, setQuillDelta] = useState([]);
	const { quill, quillRef } = useQuill();

	useEffect(() => {
		const fetchedTaskInfo = getTaskInfo(task);
		fetchedTaskInfo.then(response => {
			setTaskInfo(response);
		})
	}, [task]);

	useEffect(() => {
		if (quill) {
			quill.on('text-change', (delta, oldDelta, source) => {
				// console.log('Text change!');
				// console.log(quill.getContents().ops); // Get delta contents
				setQuillDelta(quill.getContents().ops)
			});
		}
	}, [quill]);

	const closeInterstitial = () => {
		setShowInterstitial(false)
		navigate(location.pathname)
	};

	return (
		<div id="task">
			<div className="flex justify-center items-center w-full mb-4">
				<span className="material-symbols-outlined mr-auto text-4xl text-white">close</span>
				<div className="font-bold">Individual Task - {taskInfo.title}</div>
				<span onClick={closeInterstitial} className="material-symbols-outlined ml-auto text-4xl hover:cursor-pointer">close</span>
			</div>
			<div id="editTaskBody" className=''>
				<div className="taskDetails">

				</div>
				<div className="description" style={{ width: 500, height: 300 }}>
					<div ref={quillRef} />
				</div>
				<div className="subTasks">

				</div>
				<div className="comments">
					<RenderDelta ops={quillDelta} />
				</div>
			</div>
		</div>
	);
}

export default EditTask