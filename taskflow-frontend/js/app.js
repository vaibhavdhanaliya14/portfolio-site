document.addEventListener('DOMContentLoaded', () => {
  let tasks = TaskStorage.getTasks();
  let currentFilter = 'all';

  const taskForm = document.getElementById('task-form');
  const taskInput = document.getElementById('task-input');
  const taskList = document.getElementById('task-list');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const clearCompletedBtn = document.getElementById('clear-completed');
  const itemsLeftEl = document.getElementById('items-left');

  function render() {
    taskList.innerHTML = '';

    const filteredTasks = tasks.filter(task => {
      if (currentFilter === 'active') return !task.completed;
      if (currentFilter === 'completed') return task.completed;
      return true;
    });

    filteredTasks.forEach(task => {
      const li = document.createElement('li');
      li.className = `task-item ${task.completed ? 'completed' : ''}`;
      
      li.innerHTML = `
        <div class="task-left">
          <input type="checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}" class="toggle-checkbox">
          <span class="task-text">${escapeHTML(task.title)}</span>
        </div>
        <button class="btn-delete" data-id="${task.id}">&times;</button>
      `;

      taskList.appendChild(li);
    });

    const activeCount = tasks.filter(t => !t.completed).length;
    itemsLeftEl.textContent = `${activeCount} item${activeCount === 1 ? '' : 's'} left`;
  }

  function addTask(title) {
    const newTask = {
      id: Date.now().toString(),
      title,
      completed: false,
      createdAt: new Date().toISOString()
    };
    tasks.push(newTask);
    saveAndRender();
  }

  function toggleTask(id) {
    tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    saveAndRender();
  }

  function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveAndRender();
  }

  function clearCompleted() {
    tasks = tasks.filter(t => !t.completed);
    saveAndRender();
  }

  function saveAndRender() {
    TaskStorage.saveTasks(tasks);
    render();
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = taskInput.value.trim();
    if (title) {
      addTask(title);
      taskInput.value = '';
    }
  });

  taskList.addEventListener('click', (e) => {
    const id = e.target.getAttribute('data-id');
    if (!id) return;

    if (e.target.classList.contains('toggle-checkbox')) {
      toggleTask(id);
    } else if (e.target.classList.contains('btn-delete')) {
      deleteTask(id);
    }
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => btn.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter');
      render();
    });
  });

  clearCompletedBtn.addEventListener('click', clearCompleted);

  render();
});