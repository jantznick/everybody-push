import React, { useState, createContext } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

import { getUserInfo } from '../../utils/fetch';

import { Interstitial } from './Interstitial';

export const UserContext = createContext({});
export const InterstitialContext = createContext({});

export const PageWrapper = ({ children }) => {
	const [userData, setUserData] = useState({})
    const [hasUser, setHasUser] = useState(false);
	const [showInterstitial, setShowInterstitial] = useState(false)
	const [interstitialSlug, setInterstitialSlug] = useState('')

    let navigate = useNavigate();
	const location = useLocation();

    if (typeof window !== 'undefined' && !hasUser) {
		console.log('getting user info');
        const newUser = getUserInfo()
        newUser.then(result => {
            if (result == 'nouser') {
                navigate("/");
            } else {
                setUserData(result)
				// this is dumb and probably not needed but it feels like it should be here
				if (location.pathname == "/") {
					navigate("/dashboard")
				}
            }
        })
        setHasUser(true)
    }

	const handleLoginTrigger = () => {
		setInterstitialSlug('login');
		setShowInterstitial(!showInterstitial);
	};

	return (
        <UserContext.Provider value={{...userData}}>
			<InterstitialContext.Provider value={{setShowInterstitial, setInterstitialSlug}}>
				<header className='bg-blue-500 p-8 flex flex-wrap justify-between'>
					<h1 className='font-bold text-3xl'>Everybody Push - Project Management</h1>
					{Object.keys(userData).length ? 
					<div className="icons">
						<a href="/dashboard"><span className="material-symbols-outlined text-2xl pr-8">dashboard</span></a>
						<span className="material-symbols-outlined text-2xl pr-8">settings</span>
					</div>
					:
					<div id="links" className='lg:space-x-8 hidden md:space-x-2 md:flex'>
						<a href="/demo" className="link">Demo</a>
						<button onClick={handleLoginTrigger} className="link">Login</button>
					</div>
					}
				</header>
				<div id="body" className="grow flex justify-center">
					{showInterstitial && 
						<Interstitial slug={interstitialSlug} setShowInterstitial={setShowInterstitial}/>
					}
					{children &&
						children
					}
				</div>
				<footer className='flex flex-wrap justify-between bg-cyan-700 text-gray-100 px-40 py-8'>
					<div id="left" className='grow'>
						<h1>Everybody Push - Project Management</h1>
					</div>
					<div id="center" className='flex-col flex grow items-start'>
						<a href="#" className="">About Us</a>
						<a href="#" className="">Careers</a>
						<a href="#" className="">Documentation</a>
						<a href="#" className="">Help Desk</a>
						<a href="#" className="">Contact</a>
					</div>
					<div id="right" className='flex-col flex grow items-start'>
						<a href="#" className=''>About Us</a>
						<a href="#" className=''>Pricing</a>
						<a href="#" className=''>Contact</a>
					</div>
				</footer>
			</InterstitialContext.Provider>
		</UserContext.Provider>
	)
}
