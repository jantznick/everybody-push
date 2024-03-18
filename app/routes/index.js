import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { App } from '../components/pages/App.js';
import { NotFound } from '../components/pages/NotFound.js';

const AppRoutes = () => {
	return (
        <Routes>
            {/* landing page */}
            <Route path="/" element={<App/>} />
            {/* app */}
            <Route path="/app" element={<App/>} />
            {/* users self settings: */}
            <Route path="/settings" element={<Settings/>} />
            {/* admin user and project management */}
            <Route path="/admin-dashboard" element={<AdminDashboard/>} />
            <Route path="/404" element={<NotFound/>} />
            <Route path="/*" element={<NotFound/>} />
        </Routes>
	);
}

export default AppRoutes;