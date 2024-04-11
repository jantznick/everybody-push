import React from 'react';
import {useParams} from "react-router-dom";

import { LeftDrawer } from '../utils/LeftDrawer';
import { Dashboard } from '../dashboard/Dashboard';
import { PageWrapper } from '../utils/PageWrapper';

export const EverybodyPush = () => {
    const {projectId} = useParams();

	return (
        <PageWrapper>
            {/* <div className="flex"> */}
                {/* <LeftDrawer /> */}
                <Dashboard projectId={projectId} />
            {/* </div> */}
        </PageWrapper>
	)
}
