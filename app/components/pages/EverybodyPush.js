import React from 'react';
import {useParams} from "react-router-dom";

import { LeftDrawer } from '../utils/LeftDrawer';
import { Dashboard } from '../dashboard/Dashboard';
import { AuthGate } from '../utils/AuthGate';

export const EverybodyPush = () => {
    const {projectId} = useParams();

	return (
        <AuthGate>
            {/* <div className="flex"> */}
                {/* <LeftDrawer /> */}
                <Dashboard projectId={projectId} />
            {/* </div> */}
        </AuthGate>
	)
}
