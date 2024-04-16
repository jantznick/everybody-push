export const getUserLists = () => {
    return fetch('/api/user/lists', {
        method: "GET",
        headers: {
            "accept": "application/json, text/plain, */*",
        },
    }).then(response => response.json())
        .then(data => {
            return data
        });
}

export const getUserInfo = () => {
    return fetch(`/api/user/info`, {
        method: "GET",
        headers: {
            "accept": "application/json, text/plain, */*",
        },
    }).then(response => response.json())
        .then(data => {
            return data
        });
}

export const getProjectTasks = async (projectId) => {
    const response = await fetch(`/api/project/${projectId}/tasks`, {
        method: "GET",
        headers: {
            "accept": "application/json, text/plain, */*",
        },
    })
    const data = await response.json();
    return data;
}

export const getTaskInfo = async (taskId) => {
    const response = await fetch(`/api/task/${taskId}/info`, {
        method: "GET",
        headers: {
            "accept": "application/json, text/plain, */*",
        },
    });
    const data = await response.json();
    return data;
}

export const giveUserPermissions = async ({giverId, giveeEmail, entityId, entityType, sendInviteEmail}) => {
    const response = await fetch('/api/user/invite', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "accept": "application/json",
        },
        body: {
            giverId: giverId,
            giveeEmail: giveeEmail,
            entityId: entityId,
            entityType: entityType,
            sendInviteEmail: sendInviteEmail
        }
    });
    const data = await response.json();
    return data
}

export const saveTaskToServer = async (taskData) => {
    try {
        const response = await fetch('/api/task/create', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "accept": "application/json",
            },
            body: JSON.stringify(taskData)
        });
        const data = await response.json();
        return data
    } catch (error) {
        return error
    }
}