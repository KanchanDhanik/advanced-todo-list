// Get references to HTML elements
const todoInput = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");
const prioritySelect = document.getElementById("priority-select");
const dueDateInput = document.getElementById("due-date-input");
const sortBtn = document.getElementById("sort-btn");

// Load tasks from local storage
document.addEventListener("DOMContentLoaded", loadTasks);

// Function to create a new to-do item
function createTodoItem(taskContent, priority, dueDate, isCompleted = false) {
    const li = document.createElement("li");
    const taskText = document.createElement("span");
    taskText.textContent = taskContent;
    if (isCompleted) {
        taskText.classList.add("completed");
    }
    li.appendChild(taskText);

    // Display the priority level
    const priorityLabel = document.createElement("span");
    priorityLabel.textContent = `Priority: ${priority}`;
    priorityLabel.classList.add(priority);
    li.appendChild(priorityLabel);

    // Display the due date
    const dueDateLabel = document.createElement("span");
    dueDateLabel.textContent = `Due: ${dueDate}`;
    li.appendChild(dueDateLabel);

    // Edit button
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.onclick = function() {
        const newTask = prompt("Edit your task:", taskContent);
        if (newTask) {
            taskText.textContent = newTask;
            updateLocalStorage();
        }
    };
    li.appendChild(editBtn);

    // Mark as completed button
    const completeBtn = document.createElement("button");
    completeBtn.textContent = "Done";
    completeBtn.onclick = function() {
        taskText.classList.toggle("completed");
        updateLocalStorage();
    };
    li.appendChild(completeBtn);

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = function() {
        li.remove();
        updateLocalStorage();
    };
    li.appendChild(deleteBtn);

    return li;
}

// Add event listener to the "Add Task" button
addBtn.addEventListener("click", function() {
    const taskContent = todoInput.value.trim();
    const priority = prioritySelect.value;
    const dueDate = dueDateInput.value;

    if (taskContent !== "") {
        const todoItem = createTodoItem(taskContent, priority, dueDate);
        todoList.appendChild(todoItem);
        todoInput.value = ""; // Clear input field
        dueDateInput.value = ""; // Clear date field
        updateLocalStorage(); // Save task to local storage
    }
});

// Optionally, allow pressing "Enter" to add tasks
todoInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        addBtn.click();
    }
});

// Save tasks to local storage
function updateLocalStorage() {
    const tasks = [];
    const taskElements = todoList.getElementsByTagName("li");

    for (let taskElement of taskElements) {
        const taskText = taskElement.querySelector("span").textContent;
        const priority = taskElement.querySelector("span:last-child").textContent.split(": ")[1];
        const dueDate = taskElement.querySelector("span:last-child").nextSibling ? taskElement.querySelector("span:last-child").nextSibling.textContent.split(": ")[1] : '';
        const isCompleted = taskElement.querySelector("span").classList.contains("completed");
        tasks.push({ text: taskText, priority, dueDate, completed: isCompleted });
    }

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from local storage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => {
        const todoItem = createTodoItem(task.text, task.priority, task.dueDate, task.completed);
        todoList.appendChild(todoItem);
    });
}

// Sort tasks by priority
sortBtn.addEventListener("click", function() {
    const tasks = Array.from(todoList.children);
    tasks.sort((a, b) => {
        const priorityA = a.querySelector("span:last-child").textContent.split(": ")[1];
        const priorityB = b.querySelector("span:last-child").textContent.split(": ")[1];

        const priorities = { low: 1, medium: 2, high: 3 };
        return priorities[priorityB] - priorities[priorityA];
    });

    tasks.forEach(task => todoList.appendChild(task)); // Re-order tasks
});
