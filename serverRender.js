import React from 'react';
import express from 'express';
import cookieParser from 'cookie-parser';
import { StaticRouter } from 'react-router-dom/server';
import { renderToString } from 'react-dom/server';

import { StaticProvider } from './StaticContext';
import AppRoutes from './app/routes';

import { Sequelize } from 'sequelize';
import pg from 'pg';

require('dotenv').config()

const sequelize = new Sequelize(process.env.DATABASE_URL, {
	dialectModule: pg
}) 

try {
	await sequelize.authenticate();
	console.log('DB Connection has been established successfully.');
} catch (error) {
	console.error('Unable to connect to the database:', error);
}

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(express.static('public'));

app.use("*", (req, res, next) => {
	next();
})

app.use("/api", require('./api/routes/index'));

app.get('*', (req,res) => {
	const context = {};
	res.send(`<!DOCTYPE html>
			<head>
				<title>Everybody Push - Project Management</title>
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" />
				<link href="/css/style.css" rel="stylesheet">
			</head>
			<body>
				<div id="root" class="min-h-screen flex-col flex">${renderToString(
					<StaticRouter location={req.url} >
						<StaticProvider value={context}>
							<AppRoutes />
						</StaticProvider>
					</StaticRouter>)}
				</div>
				<script src="/js/bundle.js" defer></script>
			</body>
		</html>
	`);
});

app.listen(3000, () => {
	console.log("Server running on port 3000");
});