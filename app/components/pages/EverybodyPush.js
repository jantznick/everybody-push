import React from 'react';

import { LeftDrawer } from '../utils/LeftDrawer';
import { Dashboard } from '../dashboard/Dashboard';


export const EverybodyPush = () => {
	return (
        <div className="flex">
            <LeftDrawer />
            <Dashboard />
        </div>
	)
}
