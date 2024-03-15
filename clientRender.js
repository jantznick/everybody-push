import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import AppRoutes from './app/routes/index';

hydrateRoot(
	document.getElementById("root"),
	<BrowserRouter>
		<AppRoutes />
	</BrowserRouter>);