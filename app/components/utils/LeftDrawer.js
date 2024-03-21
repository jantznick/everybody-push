import React from 'react';


export const LeftDrawer = () => {
	return (
		<div id="leftDrawer" className="fixed bg-blue-900 w-[15%] h-screen">
            <div className="item p-4 bg-slate-400 my-2">One</div>
			<div className="item p-4 bg-slate-400 my-2">Two</div>
			<div className="item p-4 bg-slate-400 my-2">Three</div>
			<div className="item p-4 bg-slate-400 my-2">Four</div>
		</div>
	)
}
