document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const taskInput = document.getElementById('task-input');
    const dateInput = document.getElementById('date-input');
    const todoList = document.getElementById('todo-list');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const deleteAllBtn = document.getElementById('delete-all-btn');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const renderTasks = (filter = 'all') => {
        todoList.innerHTML = '';
        const filteredTasks = tasks.filter(task => {
            if (filter === 'completed') return task.completed;
            if (filter === 'pending') return !task.completed;
            return true;
        });

        if (filteredTasks.length === 0) {
            const noTasksMsg = document.createElement('p');
            noTasksMsg.textContent = 'No tasks found.';
            noTasksMsg.classList.add('no-tasks');
            todoList.appendChild(noTasksMsg);
            return;
        }

        filteredTasks.forEach(task => {
            const item = document.createElement('div');
            item.classList.add('todo-list-item');
            if (task.completed) {
                item.classList.add('completed');
            }

            const taskText = document.createElement('div');
            taskText.textContent = task.text;
            taskText.classList.add('task-text');

            const taskDate = document.createElement('div');
            taskDate.textContent = task.date;
            taskDate.classList.add('task-date');

            const statusBadge = document.createElement('span');
            statusBadge.textContent = task.completed ? 'Completed' : 'Pending';
            statusBadge.classList.add('status-badge', task.completed ? 'completed' : 'pending');

            const actions = document.createElement('div');
            actions.classList.add('actions');

            const completeBtn = document.createElement('button');
            completeBtn.classList.add('action-btn', 'complete-btn');
            completeBtn.innerHTML = '✔';
            completeBtn.onclick = () => toggleComplete(task.id);

            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('action-btn', 'delete-btn');
            deleteBtn.innerHTML = '✖';
            deleteBtn.onclick = () => deleteTask(task.id);

            actions.appendChild(completeBtn);
            actions.appendChild(deleteBtn);

            item.appendChild(taskText);
            item.appendChild(taskDate);
            item.appendChild(statusBadge);
            item.appendChild(actions);
            todoList.appendChild(item);
        });
    };

    const toggleComplete = (id) => {
        tasks = tasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        saveTasks();
        renderTasks(document.querySelector('.filter-btn.active').dataset.filter);
    };

    const deleteTask = (id) => {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks(document.querySelector('.filter-btn.active').dataset.filter);
    };

    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskText = taskInput.value.trim();
        const taskDate = dateInput.value;

        if (taskText === '' || taskDate === '') {
            alert('Please fill in both the task and the date.');
            return;
        }

        const newTask = {
            id: Date.now(),
            text: taskText,
            date: taskDate,
            completed: false
        };

        tasks.push(newTask);
        saveTasks();
        renderTasks();
        taskInput.value = '';
        dateInput.value = '';
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            renderTasks(button.dataset.filter);
        });
    });

    deleteAllBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete all tasks?')) {
            tasks = [];
            saveTasks();
            renderTasks();
        }
    });

    renderTasks();
});