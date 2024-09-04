import classNames from 'classnames';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const LoginForm = ({setShowInterstitial}) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [first_name, setFirstName] = useState('');
	const [last_name, setLastName] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [forgotPassword, setForgotPassword] = useState(false);
	const [register, setRegister] = useState(false);
	const [formError, setFormError] = useState('');

	let navigate = useNavigate();

	const handleLogin = () => {
		setFormError('');
		fetch('/api/user/login', {
			method: "POST",
			headers: {
				"accept": "application/json, text/plain, */*",
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				"email": email,
				"password": password
			})
		}).then(response => response.json())
		.then(data => {
			if (data.slug == 'loggedIn') {
				navigate("/dashboard")
			} else if (data.slug == 'error') {
				setFormError(data.message)
			}
		})
	};

	const handleRegister = () => {
		setFormError('');
		fetch('/api/user/create', {
			method: "POST",
			headers: {
				"accept": "application/json, text/plain, */*",
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				"email": email,
				"password": password,
				"first_name": first_name,
				"last_name": last_name
			})
		}).then(response => response.json())
		.then(data => {
			if (data.slug == 'registered') {
				navigate("/dashboard")
			} else if (data.slug == 'error') {
				setFormError(data.message)
			}
		})
	};

	const forgotPasswordToggle = () => {
		setForgotPassword(!forgotPassword)
	}

	const closeInterstitial = () => {
		setShowInterstitial(false)
	};

	const submitForgotPassword = () => {
		// axios.post('/path/to/your/api', {
		// 	email: email
		// })
		// .then((response) => {
		// 	console.log(response.data);
		// })
		// .catch((error) => {
		// 	console.error(`There was an error! ${error}`);
		// });
	};

	const toggleRegister = () => {
		setRegister(!register);
	};

	return (
		<div id="loginForm" className='w-[30vw]'>
			<div className="flex justify-center w-full mb-4">
				<span className="material-symbols-outlined mr-auto text-4xl ">close</span>
				{!forgotPassword ?
					<div className="loginSwitcher w-1/2 flex">
						<div
							onClick={toggleRegister}
							className={classNames(
								"border-2",
								"py-2",
								"rounded-l-md",
								"hover:cursor-pointer",
								"register",
								"flex",
								"justify-center",
								"w-1/2"
							)}
						>
							Register
						</div>
						<div
							onClick={toggleRegister}
							className={classNames(
								"border-2",
								"py-2",
								"rounded-r-md",
								"hover:cursor-pointer",
								"login",
								"flex",
								"justify-center",
								"w-1/2"
							)}>
							Login
						</div>
					</div>
				:
					<div className="font-bold">Forgot Password</div>
				}
				<span onClick={closeInterstitial} className="material-symbols-outlined ml-auto text-4xl hover:cursor-pointer">close</span>
			</div>
			{forgotPassword ? (
				<div className="forgotPasswordForm">
					<form className="rounded pb-8 mb-4">
						<div className="mb-6">
							<label className="block  text-sm font-bold mb-2" htmlFor="email">
								Email
							</label>
							<input onChange={(e) => setEmail(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline"
								id="email" type="text" placeholder="Email" />
						</div>
						<div className="flex items-center justify-between">
							<button onClick={submitForgotPassword} className=" font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
								Send Reset Email
							</button>
							<a onClick={forgotPasswordToggle} className="inline-block align-baseline font-bold text-sm " href="#">
								Back
							</a>
						</div>
					</form>
				</div>
			) : (
				<div className="loginForm">
					<form className="rounded pb-8 mb-4 flex flex-wrap w-full">
						{register &&
							<div className="mb-4 flex flex-wrap w-full">
								<div className="input w-1/2 pr-2">
									<label className="block  text-sm font-bold mb-2" htmlFor="first_name">
										First name
									</label>
									<input onChange={(e) => setFirstName(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline"
										id="first_name" type="text" placeholder="First Name" />
								</div>
								<div className="input w-1/2">
									<label className="block  text-sm font-bold mb-2" htmlFor="last_name">
										Last name
									</label>
									<input onChange={(e) => setLastName(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline"
										id="last_name" type="text" placeholder="Last Name" />
								</div>
							</div>
						}
						<div className="mb-4 w-full">
							<label className="block  text-sm font-bold mb-2" htmlFor="email">
								Email
							</label>
							<input onChange={(e) => setEmail(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline"
								id="email" type="text" placeholder="Email" />
						</div>
						<div className={classNames(
							{"mb-6": !formError},
							{"mb-2": formError},
							"w-full"
						)}>
							<label className="block  text-sm font-bold mb-2" htmlFor="password">
								Password
							</label>
							<input onChange={(e) => setPassword(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3  mb-3 leading-tight focus:outline-none focus:shadow-outline"
								id="password" type="password" placeholder="******************" />
						</div>
						{formError && 
							<div className='w-full mb-4'>
								{formError}
							</div>
						}
						<div className="flex flex-wrap items-center justify-end w-full">
							{register ?
								<button onClick={handleRegister} className="  font-bold py-2 px-4 rounded w-full mb-3 focus:outline-none focus:shadow-outline" type="button">
									Register
								</button>
							:
								<button onClick={handleLogin} className=" border-2 border-blue-500 border-solid  font-bold py-2 px-4 rounded w-full mb-3 focus:outline-none focus:shadow-outline" type="button">
									Sign In
								</button>
							}
							<a onClick={forgotPasswordToggle} className="inline-block align-baseline font-bold text-sm " href="#">
								Forgot Password?
							</a>
						</div>
					</form>
				</div>
			)}
		</div>
	);
}

export default LoginForm;