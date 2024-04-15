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