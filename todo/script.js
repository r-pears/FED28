"use strict";

/* ========================================
1. FIND THE HTML ELEMENTS
======================================== */

// We use these references when adding tasks and updating the screen.
const taskForm = document.getElementById("task-form");
const titleInput = document.getElementById("task-title");
const descriptionInput = document.getElementById("task-description");
const initialStatusInput = document.getElementById("task-status");
const formMessage = document.getElementById("form-message");
const lists = {
    todo: document.getElementById("todo-list"),
    ongoing: document.getElementById("ongoing-list"),
    done: document.getElementById("done-list")
};
// These are the only three valid status values.
const statuses = ["todo", "ongoing", "done"];
const statusLabels = ["To do", "Ongoing", "Done"];

/* ========================================
2. STORE OUR DATA IN AN ARRAY
======================================== */

// The app uses an array of objects as its source of truth.
// localStorage keeps a copy between browser visits.
const STORAGE_KEY = "flowboard-todos-v1";
let todos = loadTodos();
let editingTaskId = null;
// WHY THIS FUNCTION EXISTS:
// Read the JSON string from localStorage, parse it into an array, validate
// the records, and recover gracefully from malformed data. This runs once at
// startup.
function loadTodos() {
    try {
        // localStorage only stores strings, so we use JSON.parse().
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === null) return [];
        const parsed = JSON.parse(saved);
        if (!Array.isArray(parsed)) return [];
        // Ignore entries that are not valid tasks.
        const validTasks = [];
        for (let i = 0; i < parsed.length; i++) {
            const task = parsed[i];
            if (
                task &&
                typeof task.id === "string" &&
                typeof task.title === "string" &&
                statuses.includes(task.status)
            ) {
                validTasks.push({
                    id: task.id,
                    title: task.title,
                    description: typeof task.description === "string" ? task.description : "",
                    status: task.status,
                    createdAt: typeof task.createdAt === "string" ? task.createdAt : "",
                    completedAt: typeof task.completedAt === "string" ? task.completedAt : null
                });
            }
        }
        return validTasks;

    } catch (error) {
        // Storage may be disabled or previously saved JSON may be invalid.
        console.warn("Could not load saved tasks:", error);
        const label = document.getElementById("storage-label");
        label.textContent = "Saved tasks could not be loaded";
        document.getElementById("storage-status").classList.add("unsaved");
        return [];

    }
}
// WHY THIS FUNCTION EXISTS:
// Persist the current todos array after every change. JSON.stringify is
// required because localStorage accepts strings, not arrays.
function saveTodos() {
    try {
        // Convert the whole array into JSON whenever a task changes.
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
        document.getElementById("storage-label").textContent = "Saved automatically in this browser";
        document.getElementById("storage-status").classList.remove("unsaved");
        return true;
    } catch (error) {
        console.warn("Could not save tasks:", error);
        document.getElementById("storage-label").textContent = "Changes may not be saved in this browser";
        document.getElementById("storage-status").classList.add("unsaved");
        return false;
    }
}

/* ========================================
3. ADD A NEW TASK FROM THE FORM
======================================== */

// WHY THIS FUNCTION EXISTS:
// Handle form submission, prevent the browser refresh, validate input, create
// a task object, save it, and redraw the board.
function addTask(event) {
    event.preventDefault(); // Prevent the form from reloading the page.
    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    const status = initialStatusInput.value;
    if (title === "") {
        formMessage.textContent = "Enter a name for your task.";

        titleInput.focus();
        return;
    }
    const now = new Date().toISOString();
    // One task is an object with a unique ID and a status.
    const newTask = {
        id: Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8),
        title: title,
        description: description,
        status: status,
        createdAt: now,
        completedAt: status === "done" ? now : null
    };
    todos.unshift(newTask); // Put the newest task at the beginning.
    const wasSaved = saveTodos();
    renderTodos();
    taskForm.reset();
    formMessage.textContent = wasSaved
        ? "Task added and saved."
        : "Task added, but browser storage is unavailable. It may disappear on refresh.";


    titleInput.focus();
}

/* ========================================
4. CHANGE A TASK'S STATUS (NOT DELETE IT)
======================================== */

// WHY THIS FUNCTION EXISTS:
// Change the status of an existing task rather than deleting it. Set
// completedAt when entering Done and clear it when reopening.
function changeStatus(taskId, newStatus) {
    if (!statuses.includes(newStatus)) return;
    for (let i = 0; i < todos.length; i++) {
        if (todos[i].id === taskId) {
            if (todos[i].status === newStatus) return;
            todos[i].status = newStatus;
            // Remember when the task was completed. Reopening removes this date.
            if (newStatus === "done") {
                todos[i].completedAt = new Date().toISOString();
            } else {
                todos[i].completedAt = null;
            }
            // The task remains in the array: it only changes columns.
            saveTodos();
            renderTodos();
            return;
        }
    }
}

/* ========================================
5. EDIT AN EXISTING TASK
======================================== */

// WHY THIS FUNCTION EXISTS:
// Update an existing task by its unique ID, rather than creating a duplicate.
// Save and render afterward.
function saveEditedTask(event, taskId, titleField, notesField) {
    event.preventDefault();
    const title = titleField.value.trim();
    if (title === "") {
        titleField.focus();
        return;
    }
    for (let i = 0; i < todos.length; i++) {

        if (todos[i].id === taskId) {
            todos[i].title = title;
            todos[i].description = notesField.value.trim();
            break;
        }
    }
    editingTaskId = null;
    saveTodos();
    renderTodos();
}

/* ========================================
6. RENDER ONE TASK CARD USING THE DOM
======================================== */

// WHY THIS FUNCTION EXISTS:
// Turn the stored ISO date string into a readable date for the task card.
function formatDate(isoDate) {
    if (!isoDate) return "Just now";
    const date = new Date(isoDate);

    if (Number.isNaN(date.getTime())) return "Just now";
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
// WHY THIS FUNCTION EXISTS:
// Build the HTML elements for a single task, attach edit/status handlers, and
// return the card to the renderer.
function makeTaskCard(task) {
    const card = document.createElement("article");
    card.className = "task-card";
    if (task.status === "done") card.classList.add("is-done");
    // If Edit was clicked, show editable fields instead of the normal card.
    if (editingTaskId === task.id) {
        const form = document.createElement("form");
        form.className = "edit-form";

        const heading = document.createElement("h4");
        heading.textContent = "Edit this task";
        const titleLabel = document.createElement("label");
        titleLabel.textContent = "Task name";
        const titleField = document.createElement("input");
        titleField.type = "text";
        titleField.maxLength = 90;
        titleField.required = true;
        titleField.value = task.title;
        titleLabel.appendChild(titleField);
        const notesLabel = document.createElement("label");
        notesLabel.textContent = "Notes";
        const notesField = document.createElement("input");
        notesField.type = "text";
        notesField.maxLength = 160;
        notesField.value = task.description;
        notesLabel.appendChild(notesField);
        const actions = document.createElement("div");
        actions.className = "edit-actions";
        const cancelButton = document.createElement("button");
        cancelButton.type = "button";
        cancelButton.className = "cancel-edit";
        cancelButton.textContent = "Cancel";
        cancelButton.addEventListener("click", function () {
            editingTaskId = null;
            renderTodos();
        });
        const saveButton = document.createElement("button");
        saveButton.type = "submit";
        saveButton.className = "save-edit";
        saveButton.textContent = "Save changes";

        actions.appendChild(cancelButton);
        actions.appendChild(saveButton);
        form.appendChild(heading);
        form.appendChild(titleLabel);
        form.appendChild(notesLabel);
        form.appendChild(actions);
        form.addEventListener("submit", function (event) {
            saveEditedTask(event, task.id, titleField, notesField);
        });
        card.appendChild(form);
        return card;
    }
    const top = document.createElement("div");
    top.className = "task-card-top";

    const date = document.createElement("span");
    date.className = "task-date";
    date.textContent = task.status === "done"
        ? "Completed " + formatDate(task.completedAt)
        : "Added " + formatDate(task.createdAt);
    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "edit-button";
    editButton.textContent = "Edit";
    editButton.setAttribute("aria-label", "Edit " + task.title);
    editButton.addEventListener("click", function () {
        editingTaskId = task.id;
        renderTodos();
        const editingCard = document.querySelector(".edit-form input");
        if (editingCard) editingCard.focus();
    });
    top.appendChild(date);
    top.appendChild(editButton);

    const title = document.createElement("h4");
    title.textContent = task.title; // Safe: treats user input as text, not HTML.
    card.appendChild(top);
    card.appendChild(title);
    if (task.description !== "") {
        const notes = document.createElement("p");
        notes.className = "task-description";
        notes.textContent = task.description;
        card.appendChild(notes);
    }
    const bottom = document.createElement("div");
    bottom.className = "task-card-bottom";
    const select = document.createElement("select");
    select.className = "status-select";
    select.setAttribute("aria-label", "Change status for " + task.title);
    // The dropdown allows direct movement between all three columns.
    for (let i = 0; i < statuses.length; i++) {
        const option = document.createElement("option");
        option.value = statuses[i];
        option.textContent = statusLabels[i];
        if (task.status === statuses[i]) option.selected = true;
        select.appendChild(option);
    }
    select.addEventListener("change", function () {
        changeStatus(task.id, select.value);
    });
    // Shortcut button advances a task to the next logical stage.
    const actionButton = document.createElement("button");
    actionButton.type = "button";
    actionButton.className = "task-action";
    const nextStatus = task.status === "todo" ? "ongoing" : task.status === "ongoing" ? "done" : "todo";
    actionButton.textContent = task.status === "todo" ? "Start →" : task.status === "ongoing" ? "Mark done ✓" :
        "Reopen ↺";

    actionButton.addEventListener("click", function () {
        changeStatus(task.id, nextStatus);
    });
    bottom.appendChild(select);
    bottom.appendChild(actionButton);
    card.appendChild(bottom);
    return card;
}
/* ========================================
7. REDRAW THE BOARD WHEN DATA CHANGES
======================================== */

// WHY THIS FUNCTION EXISTS:
// Clear and rebuild the three status columns from the todos array. This keeps
// the interface synchronized with the data.
function renderTodos() {
    // Clear only the card containers; keep headings and empty states.
    lists.todo.replaceChildren();
    lists.ongoing.replaceChildren();
    lists.done.replaceChildren();
    const counts = { todo: 0, ongoing: 0, done: 0 };
    // Loop over the array, find each task's column, then append its card.
    for (let i = 0; i < todos.length; i++) {
        const task = todos[i];
        lists[task.status].appendChild(makeTaskCard(task));
        counts[task.status]++;
    }
    for (let i = 0; i < statuses.length; i++) {
        const status = statuses[i];
        document.getElementById(status + "-count").textContent = counts[status];
        document.getElementById(status + "-empty").hidden = counts[status] > 0;
    }

    // Update the progress overview, including finished tasks.
    const total = todos.length;
    const percentage = total === 0 ? 0 : Math.round((counts.done / total) * 100);
    document.getElementById("done-number").textContent = counts.done;
    document.getElementById("total-number").textContent = total;
    document.getElementById("progress-percent").textContent = percentage + "%";
    document.getElementById("progress-fill").style.width = percentage + "%";
    document.getElementById("progress-track").setAttribute("aria-valuenow", percentage);
}
// Attach the form handler once, then draw saved tasks when the page loads.
taskForm.addEventListener("submit", addTask);
renderTodos();