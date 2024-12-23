const tasks = JSON.parse(localStorage.getItem("tasks")) ?? [];

const taskList = document.querySelector("#task-list");
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");

function escapeHTML(html) {
    const div = document.createElement("div");
    div.innerText = html;
    return div.innerHTML;
}

function isDuplicateTask(newTitle, excludeIndex = -1) {
    const isDuplicate = tasks.some(
        (task, index) =>
            task.title.toLowerCase() === newTitle.toLowerCase() &&
            excludeIndex !== index
    );
    return isDuplicate;
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function handleTaskActions(e) {
    const taskItem = e.target.closest(".task-item");
    if (!taskItem) return;

    const taskIndex = +taskItem.dataset.index;
    const task = tasks[taskIndex];

    if (e.target.closest(".edit")) {
        let newTitle = prompt("Enter the new task title:", task.title);

        if (newTitle === null) return;

        newTitle = newTitle.trim();

        if (!newTitle) {
            alert("Task title cannot be empty!");
            return;
        }

        if (isDuplicateTask(newTitle, taskIndex)) {
            alert(
                "Task with this title already exist! Please use a different task title!"
            );
            return;
        }

        task.title = newTitle;
        renderTasks();
        saveTasks();
        return;
    }

    if (e.target.closest(".done")) {
        task.completed = !task.completed;
        renderTasks();
        saveTasks();
        return;
    }

    if (e.target.closest(".delete")) {
        if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
            tasks.splice(taskIndex, 1);
            renderTasks();
            saveTasks();
        }
    }
}

function addTask(e) {
    e.preventDefault();
    const value = todoInput.value.trim();
    if (!value) return alert("Please write something!");

    if (isDuplicateTask(value)) {
        alert(
            "Task with this title already exists! Please use a different title."
        );
        return;
    }

    tasks.push({
        title: value,
        completed: false,
    });
    renderTasks();
    saveTasks();
    todoInput.value = "";
}

function renderTasks() {
    if (!tasks.length) {
        taskList.innerHTML =
            '<li class="empty-message">No tasks available.</li>';
        return;
    }

    const html = tasks
        .map(
            (task, index) => `
    <li class="task-item ${
        task.completed ? "completed" : ""
    }" data-index="${index}">
        <span class="task-title">${escapeHTML(task.title)}</span>
        <div class="task-action">
            <button class="task-btn edit">Edit</button>
            <button class="task-btn done">${
                task.completed ? "Mark as undone" : "Mark as done"
            }</button>
            <button class="task-btn delete">Delete</button>
        </div>
    </li>
`
        )
        .join("");

    taskList.innerHTML = html;
}

todoForm.addEventListener("submit", addTask);
taskList.addEventListener("click", handleTaskActions);

renderTasks();
