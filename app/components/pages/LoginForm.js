import React, { useState } from 'react';

const LoginForm = ({setShowLogin}) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [forgotPassword, setForgotPassword] = useState(false);
	const [title, setTitle] = useState('Login');

	const handleLogin = () => {
		fetch('/api/user/login', {
			method: "POST",
			headers: {
				"accept": "application/json, text/plain, */*",
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				"email": email,
				"password": password,
			})
		}).then(response => response.json())
		.then(data => {
			console.log(data)
		})
	};

	const handleRegister = () => {
		fetch('/api/user/create', {
			method: "POST",
			headers: {
				"accept": "application/json, text/plain, */*",
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				"email": email,
				"password": password,
			})
		}).then(response => response.json())
		.then(data => {
			console.log(data)
		})
	};

	const forgotPasswordToggle = () => {
		setTitle(title === 'Login' ? 'Forgot Password' : 'Login')
		setForgotPassword(!forgotPassword)
	}

	const closeInterstitial = () => {
		setShowLogin(false)
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

	return (
		<div id="interstitial" className="text-white flex" style={{top: window.scrollY + 'px'}}>
			<div className="max-w-md w-full m-auto shadow-md bg-white text-black pt-6 px-8">
				<div className="flex justify-center w-full mb-4">
                    <div className="mr-auto"></div>
                    <div className="font-bold">{title}</div>
                    <span onClick={closeInterstitial} className="material-symbols-outlined ml-auto text-4xl hover:cursor-pointer">close</span>
                </div>
				{forgotPassword ? (
					<div className="forgotPasswordForm">
						<form className="rounded pb-8 mb-4">
							<div className="mb-6">
								<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
									Email
								</label>
								<input onChange={(e) => setEmail(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
									id="email" type="text" placeholder="Email" />
							</div>
							<div className="flex items-center justify-between">
								<button onClick={submitForgotPassword} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
									Send Reset Email
								</button>
								<a onClick={forgotPasswordToggle} className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
									Back
								</a>
							</div>
						</form>
					</div>
				) : (
					<div className="loginForm">
						<form className="rounded pb-8 mb-4">
							<div className="mb-4">
								<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
									Email
								</label>
								<input onChange={(e) => setEmail(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
									id="email" type="text" placeholder="Email" />
							</div>
							<div className="mb-6">
								<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
									Password
								</label>
								<input onChange={(e) => setPassword(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
									id="password" type="password" placeholder="******************" />
							</div>
							<div className="flex flex-wrap items-center justify-end">
								<button onClick={handleRegister} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mb-3 focus:outline-none focus:shadow-outline" type="button">
									Register
								</button>
								<button onClick={handleLogin} className="bg-white text-blue-500 border-2 border-blue-500 border-solid hover:border-blue-800 font-bold py-2 px-4 rounded w-full mb-3 focus:outline-none focus:shadow-outline" type="button">
									Sign In
								</button>
								<a onClick={forgotPasswordToggle} className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
									Forgot Password?
								</a>
							</div>
						</form>
					</div>
				)}
			</div>
		</div>
	);
}

export default LoginForm;