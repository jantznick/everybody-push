import { useContext } from "react";

import LoginForm from '../pages/LoginForm';
import EditTask from '../taskEditor/EditTask';

import { TaskContext } from "../pages/EverybodyPush";

export const Interstitial = ({slug, setShowInterstitial}) => {
    const task = useContext(TaskContext)

    let children;
    switch(slug){
        case 'login':
            children = <LoginForm setShowInterstitial={setShowInterstitial} />;
            break;
        // TODO: putting the task editor in an interstitial might break everything
        case 'task':
            children = <EditTask task={task} setShowInterstitial={setShowInterstitial} />;
            break;
    }

    return (
		<div id="interstitial" className="text-white flex" style={{top: window.scrollY + 'px'}}>
			<div className="max-w-[85%] m-auto shadow-md bg-white rounded-md text-black pt-6 px-8">
                {children}
            </div>
        </div>
    )
}