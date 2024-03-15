import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import AppRoutes from './app/routes/index';

const root = createRoot(document.getElementById("root"));

root.render(
	<BrowserRouter>
		<AppRoutes />
	</BrowserRouter>
);
