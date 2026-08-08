const TaskApi = (() => {
  const API_BASE_URL = 'http://localhost:5000/api/tasks';

  async function request(path = '', options = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (response.status === 204) return null;

    const payload = await response.json();
    if (!response.ok || payload.success === false) {
      throw new Error(payload.error || 'API request failed');
    }

    return payload.data ?? payload;
  }

  return {
    getTasks() {
      return request();
    },

    createTask(title) {
      return request('', {
        method: 'POST',
        body: JSON.stringify({ title })
      });
    },

    updateTask(id, updates) {
      return request(`/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
    },

    deleteTask(id) {
      return request(`/${id}`, { method: 'DELETE' });
    }
  };
})();
