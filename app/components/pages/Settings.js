import React, { useContext } from 'react';

import { AuthGate, UserContext } from '../utils/AuthGate';

export const Settings = () => {
	return (
        <AuthGate>
            <Auths></Auths>
        </AuthGate>
	)
}

const Auths = () => {
    const {user} = useContext(UserContext)

    return (
        <div className="w-3/4 min-h-screen mt-4">
            <div className='pb-4 text-xl'>User Dashboard</div>
            <div className="card">
                <h1>{user?.first_name + ' ' + user?.last_name}</h1>
                <h2>{user?.email}</h2>
            </div>
            <div className="card">
                <h1>Organization</h1>
                <h2>Team</h2>
                <h3>Project</h3>
            </div>
        </div>
    )
}