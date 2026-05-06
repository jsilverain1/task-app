const API_BASE_URL = 'http://localhost:8080/api';

export const API_ROUTES = {
    // Auth
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
  
    // Tasks
    TASKS: `${API_BASE_URL}/tasks`,
    TASK: (id: string) => `${API_BASE_URL}/tasks/${id}`,
  };