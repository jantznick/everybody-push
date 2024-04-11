import React, { useContext } from 'react';

import { PageWrapper, UserContext } from '../utils/PageWrapper';

export const Settings = () => {
	return (
        <PageWrapper>
            <Auths></Auths>
        </PageWrapper>
	)
}

const Auths = () => {
    const {user, orgs, teams, projects} = useContext(UserContext)

    return (
        <div className="w-3/4 mt-4">
            <div className='pb-4 text-xl'>User Dashboard</div>
            <div className="card">
                <h1>{user?.first_name + ' ' + user?.last_name}</h1>
                <h2>{user?.email}</h2>
            </div>
            {/* TODO: This is kinda right, a user could be on a team or project without being on the corresponding org or team */}
            {/* We will need some level of orphan lists where the user sees all their teams/projects */}
            {/* Maybe we show them the team and the project but it's greyed out? */}
            {/* If the user is an admin it should also show all users associated with the org/team */}
            {/* If the user isn't an admin it should only show all users associated with the project */}
            {orgs?.length > 0 &&
                orgs.map((org, orgI) => {
                    const orgTeams = teams.filter(team => team.org == org.id);
                    return (
                        <div className="card">
                            <div className='orgTitle text-2xl pb-4' key={orgI}>
                                {org.name} - {org.admin.includes(user.id) ? <span className="hover:cursor-pointer material-symbols-outlined">edit</span> : null}
                            </div>
                            {orgTeams.map((team, teamI) => {
                                const teamProjects = projects.filter(project => project.team == team.id);
                                return (
                                    <>
                                        <div className='teamTitle text-xl pl-4 pb-4' key={teamI}>
                                            {team.name} - {team.admin.includes(user.id) ? <span className="hover:cursor-pointer material-symbols-outlined">edit</span> : null}
                                        </div>
                                        {teamProjects.map((project, projectI) => (
                                            <div className="projectTitle pl-8 pb-4" key={projectI}>
                                                {project.name} - {project.admin.includes(user.id) ? <span className="hover:cursor-pointer material-symbols-outlined">edit</span> : null}
                                            </div>
                                        ))}
                                    </>
                                )
                            })}
                        </div>
                    )
                })
            }
        </div>
    )
}