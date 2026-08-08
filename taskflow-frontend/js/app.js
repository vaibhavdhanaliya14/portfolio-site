document.addEventListener('DOMContentLoaded', () => {
  const MAX_TASK_LENGTH = 120;

  let tasks = [];
  let currentFilter = 'all';
  let usingApi = true;

  const taskForm = document.getElementById('task-form');
  const taskInput = document.getElementById('task-input');
  const taskList = document.getElementById('task-list');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const clearCompletedBtn = document.getElementById('clear-completed');
  const itemsLeftEl = document.getElementById('items-left');
  const formError = document.getElementById('form-error');
  const dataStatus = document.getElementById('data-status');
  const themeToggle = document.getElementById('theme-toggle');

  function getTaskId(task) {
    return task._id || task.id;
  }

  function isCompleted(task) {
    return task.completed === true || task.status === 'completed';
  }

  function normalizeTask(task) {
    return {
      ...task,
      id: getTaskId(task),
      title: task.title || task.text || ''
    };
  }

  function getFilteredTasks() {
    return tasks.filter(task => {
      if (currentFilter === 'active') return !isCompleted(task);
      if (currentFilter === 'completed') return isCompleted(task);
      return true;
    });
  }

  function render() {
    taskList.innerHTML = '';

    const filteredTasks = getFilteredTasks();

    if (filteredTasks.length === 0) {
      const emptyState = document.createElement('li');
      emptyState.className = 'empty-state';
      emptyState.textContent = currentFilter === 'all'
        ? 'No tasks yet. Add your first task.'
        : `No ${currentFilter} tasks.`;
      taskList.appendChild(emptyState);
    }

    filteredTasks.forEach(task => {
      const taskId = getTaskId(task);
      const li = document.createElement('li');
      li.className = `task-item ${isCompleted(task) ? 'completed' : ''}`;
      li.dataset.id = taskId;

      li.innerHTML = `
        <div class="task-left">
          <input type="checkbox" ${isCompleted(task) ? 'checked' : ''} data-action="toggle" aria-label="Toggle task completion">
          <span class="task-text">${escapeHTML(task.title)}</span>
        </div>
        <div class="task-actions">
          <button class="btn-icon" type="button" data-action="edit" aria-label="Edit task">Edit</button>
          <button class="btn-icon danger" type="button" data-action="delete" aria-label="Delete task">Delete</button>
        </div>
      `;

      taskList.appendChild(li);
    });

    const activeCount = tasks.filter(task => !isCompleted(task)).length;
    itemsLeftEl.textContent = `${activeCount} item${activeCount === 1 ? '' : 's'} left`;
    dataStatus.textContent = usingApi ? 'Connected to API' : 'Offline localStorage mode';
  }

  function validateTitle(title) {
    if (!title) return 'Task title is required.';
    if (title.length > MAX_TASK_LENGTH) return `Task title must be ${MAX_TASK_LENGTH} characters or fewer.`;
    return '';
  }

  function showError(message) {
    formError.textContent = message;
    formError.classList.toggle('hidden', !message);
  }

  async function loadTasks() {
    try {
      const apiTasks = await TaskApi.getTasks();
      tasks = apiTasks.map(normalizeTask);
      usingApi = true;
      TaskStorage.saveTasks(tasks);
    } catch (error) {
      usingApi = false;
      tasks = TaskStorage.getTasks().map(normalizeTask);
    }

    render();
  }

  async function persist(action, fallback) {
    try {
      if (usingApi) {
        await action();
        await loadTasks();
        return;
      }

      fallback();
      TaskStorage.saveTasks(tasks);
      render();
    } catch (error) {
      showError(error.message);
    }
  }

  async function addTask(title) {
    await persist(
      () => TaskApi.createTask(title),
      () => {
        tasks.push({
          id: Date.now().toString(),
          title,
          status: 'pending',
          createdAt: new Date().toISOString()
        });
      }
    );
  }

  async function toggleTask(task) {
    const taskId = getTaskId(task);
    const completed = !isCompleted(task);

    await persist(
      () => TaskApi.updateTask(taskId, { completed }),
      () => {
        tasks = tasks.map(item => getTaskId(item) === taskId
          ? { ...item, completed, status: completed ? 'completed' : 'pending' }
          : item);
      }
    );
  }

  async function editTask(task) {
    const taskId = getTaskId(task);
    const updatedTitle = window.prompt('Edit task', task.title);
    if (updatedTitle === null) return;

    const title = updatedTitle.trim();
    const error = validateTitle(title);
    if (error) {
      showError(error);
      return;
    }

    await persist(
      () => TaskApi.updateTask(taskId, { title }),
      () => {
        tasks = tasks.map(item => getTaskId(item) === taskId ? { ...item, title } : item);
      }
    );
  }

  async function deleteTask(task) {
    if (!window.confirm('Delete this task permanently?')) return;

    const taskId = getTaskId(task);
    await persist(
      () => TaskApi.deleteTask(taskId),
      () => {
        tasks = tasks.filter(item => getTaskId(item) !== taskId);
      }
    );
  }

  async function clearCompleted() {
    const completedTasks = tasks.filter(isCompleted);
    if (completedTasks.length === 0) return;
    if (!window.confirm('Delete all completed tasks?')) return;

    try {
      if (usingApi) {
        await Promise.all(completedTasks.map(task => TaskApi.deleteTask(getTaskId(task))));
        await loadTasks();
        return;
      }

      tasks = tasks.filter(task => !isCompleted(task));
      TaskStorage.saveTasks(tasks);
      render();
    } catch (error) {
      showError(error.message);
    }
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g,
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('taskflow_theme', theme);
    themeToggle.textContent = theme === 'dark' ? 'Light' : 'Dark';
  }

  taskInput.setAttribute('maxlength', MAX_TASK_LENGTH);

  taskInput.addEventListener('input', () => {
    showError(validateTitle(taskInput.value.trim()));
  });

  taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = taskInput.value.trim();
    const error = validateTitle(title);

    if (error) {
      showError(error);
      return;
    }

    showError('');
    await addTask(title);
    taskInput.value = '';
  });

  taskList.addEventListener('click', async (e) => {
    const action = e.target.dataset.action;
    const taskElement = e.target.closest('.task-item');
    if (!action || !taskElement) return;

    const task = tasks.find(item => getTaskId(item) === taskElement.dataset.id);
    if (!task) return;

    if (action === 'toggle') await toggleTask(task);
    if (action === 'edit') await editTask(task);
    if (action === 'delete') await deleteTask(task);
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(filterBtn => filterBtn.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      render();
    });
  });

  clearCompletedBtn.addEventListener('click', clearCompleted);

  themeToggle.addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  });

  applyTheme(localStorage.getItem('taskflow_theme') || 'light');
  loadTasks();
});
