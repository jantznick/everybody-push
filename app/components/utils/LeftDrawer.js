import React from 'react';


export const LeftDrawer = () => {
	return (
		<div id="leftDrawer" className="fixed bg-blue-900 w-[15%] h-screen pt-10">
            <div className="item nav-org my-2">Organization One</div>
			<div className="item mt-2 nav-team">Team One</div>
			<div className="item my-2 mt-0 nav-project nav-project-active">Project One</div>
			<div className="item my-2 nav-project">Project Two</div>
			<div className="item mt-2 nav-team">Team Two</div>
			<div className="item my-2 mt-0 nav-project">Project Three</div>
			<div className="item p-2 my-2 mt-6 text-white underline">View all lists</div>

		</div>
	)
}
