const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const priority = document.getElementById('priority');
const deadline = document.getElementById('deadline');
const taskList = document.getElementById('taskList');
const streakCounter = document.getElementById('streak');
const toggleModeBtn = document.getElementById('toggleMode');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let completedToday = JSON.parse(localStorage.getItem('completedToday')) || 0;

streakCounter.textContent = completedToday;

renderTasks();

// Handle form submission
taskForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const task = {
    id: Date.now(),
    text: taskInput.value,
    priority: priority.value,
    deadline: deadline.value,
    completed: false
  };
  tasks.push(task);
  saveAndRender();
  taskForm.reset();
});

// Render all tasks
function renderTasks() {
  taskList.innerHTML = '';
  const now = new Date();
  tasks.forEach(task => {
    const taskEl = document.createElement('div');
    taskEl.className = task;{task.priority};
    if (task.completed) taskEl.classList.add('completed');

    const deadlineTime = new Date(task.deadline);
    const timeRemaining = deadlineTime - now;
    const countdown = timeRemaining > 0
      ? Math.floor(timeRemaining / 1000 / 60) + ' min left'
      : 'Expired';

    taskEl.innerHTML = `
      <span>${task.text}</span>
      <span class="deadline">${countdown}</span>
      <button onclick="completeTask(${task.id})">✔️</button>
      <button onclick="deleteTask(${task.id})">❌</button>
    `;
    taskList.appendChild(taskEl);
  });
}

// Complete a task
window.completeTask = function(id) {
  const task = tasks.find(t => t.id === id);
  if (task && !task.completed) {
    task.completed = true;
    completedToday++;
    streakCounter.textContent = completedToday;
    saveAndRender();
  }
};

// Delete a task
window.deleteTask = function(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveAndRender();
};

// Save to local storage and re-render
function saveAndRender() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  localStorage.setItem('completedToday', JSON.stringify(completedToday));
  renderTasks();
}

// Dark Mode Toggle
toggleModeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});
