import React from 'react';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
  } from "../ui/select"  

import { PageWrapper } from '../utils/PageWrapper';

export const App = () => {
	return (
		<PageWrapper>
			<Select>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder="Theme" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="light">Light</SelectItem>
				<SelectItem value="dark">Dark</SelectItem>
				<SelectItem value="system">System</SelectItem>
			</SelectContent>
			</Select>

		</PageWrapper>
	)
}
