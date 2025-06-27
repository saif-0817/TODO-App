const form = document.getElementById('form');
const inputTask = document.getElementById('input-task');
const addTask = document.getElementById('add-task');
const updateBtn = document.getElementById('update-btn');
const clearInput = document.getElementById('clearInput');
const tasks = document.getElementById('tasks');
const notifications = document.getElementById('notifications');
const message = document.getElementById('message');
const error = document.getElementById('error');
const taskItems = document.querySelectorAll('.task-items');
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modal-close');
const offset = document.getElementById('offset');
const modalContent = document.querySelector('.modal-content');
let listIndex = null;

document.addEventListener('DOMContentLoaded', fetchTask);
clearInput.addEventListener('click', clearTaskInput);
inputTask.addEventListener('input', (e) => {
    let keys = e.target.value.trim();
    clearInput.style.display = keys.length ? 'block' : 'none';
});
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = inputTask.value.trim();
    if (!input || input.length < 4) {
        error.innerHTML = `Please add a valid input (ex: Input must not be of less than 4 charecters)!`;
        error.style.display = 'block';
        inputTask.focus();
        return;
    } else {

        const newTask = {
            id: Date.now(),
            savedTask: input
        };
        const saveTasksList = JSON.parse(localStorage.getItem('storedList')) || [];
        console.log(saveTasksList);
        saveTasksList.push(newTask);
        localStorage.setItem('storedList', JSON.stringify(saveTasksList));
        notificationAlert(`<h3>Task successfully added!</h3 >`);
        error.innerHTML = ``;
        error.style.display = 'none';
        tasks.style.display = 'block';
        clearTaskInput();
        fetchTask();
    }
})

updateBtn.addEventListener('click', updateTask);
offset.addEventListener('click', () => {
    offset.style.display = 'none';
    modal.style.display = 'none';

});
modalClose.addEventListener('click', () => {
    modal.style.display = 'none';
    offset.style.display = 'none';
})

function clearTaskInput() {
    inputTask.value = '';
    clearInput.style.display = 'none';

}

function editTask(event, index) {
    event.stopPropagation();
    listIndex = index;
    addTask.style.display = 'none';
    updateBtn.style.display = 'block';
    console.log(index);
    const saveTasksList = JSON.parse(localStorage.getItem('storedList')) || [];
    const editedItem = saveTasksList[index];
    console.log(editedItem);
    inputTask.value = editedItem.savedTask;
    clearInput.style.display = 'block';
    inputTask.focus();
}

function updateTask(e) {
    e.preventDefault();
    const input = inputTask.value.trim();
    if (!input || input.length < 4) {
        error.innerHTML = `Please add a valid input (ex: Input must not be of less than 4 charecters)!`;
        error.style.display = 'block';
        inputTask.focus();
        return;
    } else {
        const saveTasksList = JSON.parse(localStorage.getItem('storedList')) || [];
        console.log(input + 'updatedTaskValue');
        const updatedTask = {
            id: saveTasksList[listIndex].id,
            savedTask: input
        };
        console.log(updatedTask);
        saveTasksList[listIndex] = updatedTask;
        console.log(saveTasksList);
        localStorage.setItem('storedList', JSON.stringify(saveTasksList));
        notificationAlert(`<h3>Task successfully updated!</h3 >`);
        error.innerHTML = ``;
        error.style.display = 'none';
        tasks.style.display = 'block';
        addTask.style.display = 'block';
        updateBtn.style.display = 'none';
        clearTaskInput();
        fetchTask();
    }
}

function deleteTask(event, index) {
    event.stopPropagation();
    if (listIndex !== null) {
        listIndex = null;
        inputTask.value = null;
        addTask.style.display = 'block';
        updateBtn.style.display = 'none';
    }
    const saveTasksList = JSON.parse(localStorage.getItem('storedList')) || [];
    saveTasksList.splice(index, 1);
    localStorage.setItem('storedList', JSON.stringify(saveTasksList));
    fetchTask();
    notificationAlert('<h3>Task successfully deleted!</h3 >');
}

function fetchTask() {
    tasks.innerHTML = '';
    const saveTasksList = JSON.parse(localStorage.getItem('storedList')) || [];

    if (saveTasksList.length > 0) {
        saveTasksList.forEach((task, index) => {
            tasks.innerHTML += `
                <li class="task-items" onClick="taskDetails(${index})">
                    <span class="task-content">${index + 1}. ${task.savedTask}</span>
                    <button class="editbtn" onClick="editTask(event,${index})" type="button">🖊</button>
                    <button class="deletebtn" onClick="deleteTask(event,${index})" type="button">❌</button>
                </li>`;
        });
    } else {
        tasks.innerHTML += `
            <li id="empty-task">
                <h3 class="task-content">No tasks available</h3>
            </li>`;
    }

}


function notificationAlert(content) {
    notifications.innerHTML = content;
    notifications.style.visibility = 'visible';
    setTimeout(() => notifications.style.visibility = 'hidden', 2000)
}

function taskDetails(index) {
    const listIndex = index;
    modal.style.display = 'block';
    offset.style.display = 'block';
    const saveTasksList = JSON.parse(localStorage.getItem('storedList')) || [];
    const showListDetails = saveTasksList[listIndex];
    modalContent.innerHTML =
        ` <table>
            <tr>
                <td>Task no.</td>
                <td> ${index + 1}</td>
            </tr>
            <tr>
                <td>Date</td>
                <td>${new Date(showListDetails.id).toDateString()}</td>
            </tr>
            <tr>
                <td>Time</td>
                 <td>${new Date(showListDetails.id).toLocaleTimeString()}</td>
            </tr>
             <tr>
                <td>Task</td>
                 <td>${showListDetails.savedTask}</td>
            </tr>
        </table>
        `

}