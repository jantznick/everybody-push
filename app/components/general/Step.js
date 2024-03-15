import React from 'react';

import classNames from "classnames";

export const Step = ({
	icon,
	index,
	title,
	formStep,
	handleClick
}) => {
	return (
		<>
			<div onClick={(() => handleClick(icon))} className={classNames(
				"step",
				"flex",
				"justify-center",
				"mx-auto",
				"space-x-2",
				"hover:cursor-pointer",
				{ 'text-gray-500': icon !== formStep }
			)}>
				<div id="icon" className={classNames(
					'center-flex',
					'items-center',
					'rounded-full',
					'px-3',
					'w-12',
					'h-12',
					{ 'text-white': icon === formStep },
					{ 'bg-gray-100': icon !== formStep },
					{ 'bg-orange-500': icon === formStep },
					{ 'shadow-md': icon === formStep },
				)}>
					<span className="material-symbols-outlined">{icon}</span>
				</div>
				<div id="step-info" className={classNames(
						'flex-col',
						'font-bold',
						'justify-center',
						'text-sm',
						'flex',
						'w-max',
						'hidden',
						'xl:flex',
						{ 'md:flex': icon === formStep }
					)}>
					<span className={classNames(
						{ 'text-orange-500': icon === formStep },
						{ 'drop-shadow-sm': icon === formStep },
					)}>Step {index + 1}</span>
					<span className={classNames(
						{ 'text-black': icon === formStep },
						{ 'drop-shadow-sm': icon === formStep },
					)}>{title}</span>
				</div>
			</div>
		</>
	)
}
