

const Task = ({ task }) => {
    return (
        <div>
            <input type="checkbox" checked={task.done} />
            {task.title} - {task.description}
        </div>
    )
}

export default Task