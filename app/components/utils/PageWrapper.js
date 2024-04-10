import React, { useState, useMemo } from 'react';
import LoginForm from '../pages/LoginForm';

export const PageWrapper = ({ children }) => {
	const [showLogin, setShowLogin] = useState(false);

	const handleLoginTrigger = () => {
		setShowLogin(!showLogin);
	};

	return (
		<>
			<header className='bg-blue-500 p-8 flex flex-wrap justify-between'>
				<h1 className='font-bold text-3xl'>Everybody Push - Project Management</h1>
				<div className="flex items-center transition-all hover:cursor-pointer hover:text-gray-600 md:hidden">
					<span className="material-symbols-outlined text-[2rem]">menu</span>
				</div>
				<div id="links" className='lg:space-x-8 hidden md:space-x-2 md:flex'>
					<a href="/demo" className="link">Demo</a>
					<button onClick={handleLoginTrigger} className="link">Login</button>
				</div>
			</header>
			<div id="body" className="grow flex justify-center">
				{children &&
					children
				}
				{showLogin && 
					<LoginForm setShowLogin={setShowLogin} />
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
		</>
	)
}
