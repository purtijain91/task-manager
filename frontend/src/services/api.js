const API_URL = 'http://localhost:5001/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  async register(email, password) {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to register');
    return data;
  },

  async login(email, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to login');
    return data;
  },

  async getTasks() {
    const res = await fetch(`${API_URL}/tasks`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch tasks');
    return data;
  },

  async createTask(title) {
    const res = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ title }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create task');
    return data;
  },

  async updateTask(id, updates) {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update task');
    return data;
  },

  async deleteTask(id) {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete task');
    return data;
  },
};
