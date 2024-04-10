import React, { useState, createContext } from 'react';
import { useNavigate } from "react-router-dom";

import { getUserInfo } from '../../utils/fetch';

export const UserContext = createContext({});

export const AuthGate = ({ children }) => {
    const [user, setUser] = useState({})
    const [hasUser, setHasUser] = useState(false);
    let navigate = useNavigate()

    if (typeof window !== 'undefined' && !hasUser) {
        const newUser = getUserInfo()
        newUser.then(result => {
            if (result == 'nouser') {
                navigate("/");
            } else {
                setUser(result)
            }
        })
        setHasUser(true)
    }

	return (
        <UserContext.Provider value={{user: user}}>
			<header className='bg-blue-500 p-8 flex flex-wrap justify-between'>
				<h1 className='font-bold text-3xl'>Everybody Push - Project Management</h1>
                <div className="icons">
                    <a href="/dashboard"><span className="material-symbols-outlined text-2xl pr-8">dashboard</span></a>
                    <span className="material-symbols-outlined text-2xl pr-8">settings</span>
                </div>
			</header>
			<div id="body" className="grow flex justify-center">
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
        </UserContext.Provider>
	)
}
