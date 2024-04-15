import { useContext } from "react";

import LoginForm from '../pages/LoginForm';

export const Interstitial = ({slug, setShowInterstitial}) => {

    let children;
    switch(slug){
        case 'login':
            children = <LoginForm setShowInterstitial={setShowInterstitial} />;
            break;
    }

    return (
		<div id="interstitial" className="text-white flex" style={{top: window.scrollY + 'px'}}>
			<div className="max-w-md w-full m-auto shadow-md bg-white rounded-md text-black pt-6 px-8">
                {children}
            </div>
        </div>
    )
}