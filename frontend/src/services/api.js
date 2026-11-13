// API Service communicating with the FastAPI backend

const API_BASE = ''; // Relies on Vite proxy to http://localhost:8000

export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const parseErrorMessage = async (response) => {
  try {
    const data = await response.json();
    if (data.detail) {
      if (Array.isArray(data.detail)) {
        // Pydantic validation error list
        return data.detail.map((err) => `${err.loc?.slice(-1)[0] || 'field'}: ${err.msg}`).join(', ');
      }
      return String(data.detail);
    }
    if (data.message) return data.message;
    return `Error: ${response.status} ${response.statusText}`;
  } catch {
    return `Server error (${response.status})`;
  }
};

export const authAPI = {
  // Register a new user (USER, CREATOR, or ADMIN)
  async register({ username, email, password, role = 'USER' }) {
    const res = await fetch(`${API_BASE}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, role }),
    });

    if (!res.ok) {
      const errorMsg = await parseErrorMessage(res);
      throw new Error(errorMsg);
    }

    return await res.json();
  },

  // Login with username_or_email and password
  async login({ username_or_email, password }) {
    const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username_or_email, password }),
    });

    if (!res.ok) {
      const errorMsg = await parseErrorMessage(res);
      throw new Error(errorMsg);
    }

    return await res.json();
  },

  // Get current user profile using JWT token
  async getProfile() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const res = await fetch(`${API_BASE}/api/v1/auth/me`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('token');
        return null;
      }
      const errorMsg = await parseErrorMessage(res);
      throw new Error(errorMsg);
    }

    return await res.json();
  },

  // Backend Health check
  async getHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`, { method: 'GET' });
      if (!res.ok) return { status: 'down', code: res.status };
      const data = await res.json();
      return { status: data.status === 'healthy' ? 'online' : 'degraded', raw: data };
    } catch (e) {
      return { status: 'offline', error: e.message };
    }
  },

  // Backend Root info
  async getHome() {
    try {
      const res = await fetch(`${API_BASE}/`, { method: 'GET' });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },
};

