import { API_ROUTES } from '../constants/api';

type LoginInput = {
    email: string;
    password: string;
  };
  
  type RegisterInput = {
    email: string;
    password: string;
  };
  
  type AuthResponse = {
    token: string;
    email: string;
  };
  
  export const login = async (input: LoginInput): Promise<AuthResponse> => {
    const response = await fetch(API_ROUTES.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });
  
    if (!response.ok) {
      throw new Error('Invalid email or password');
    }
  
    return response.json();
  };
  
  export const register = async (input: RegisterInput): Promise<AuthResponse> => {
    const response = await fetch(API_ROUTES.REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });
  
    if (!response.ok) {
      throw new Error('Registration failed');
    }
  
    return response.json();
  };