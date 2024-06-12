import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { App } from '../components/pages/App.js';
import { EverybodyPush } from '../components/pages/EverybodyPush.js';
import { NotFound } from '../components/pages/NotFound.js';
import { Settings } from '../components/pages/Settings.js';
import { VerifyEmail } from '../components/pages/VerifyEmail.js';

const AppRoutes = () => {
	return (
        <Routes>
            {/* landing page */}
            <Route path="/" element={<App/>} />
            {/* app */}
            <Route path="/project/:projectId" exact element={<EverybodyPush/>} />
			<Route path="/verify-email" element={<VerifyEmail/>} />
            {/* users self settings: */}
            <Route path="/dashboard" element={<Settings/>} />
            {/* <Route path="/org/:id" element={<Organization/>} /> */}
            {/* <Route path="/team/:id" element={<Team/>} /> */}
            {/* admin user and project management */}
            {/* <Route path="/admin-dashboard" element={<AdminDashboard/>} /> */}
            <Route path="/404" element={<NotFound/>} />
            <Route path="/*" element={<NotFound/>} />
        </Routes>
	);
}

export default AppRoutes;