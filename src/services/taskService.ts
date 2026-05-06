import { API_ROUTES } from '../constants/api';

import { CreateTaskInput, Task, UpdateTaskInput } from '../types';

type RequestOptions = {
  token: string;
};

const authHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
});

export const getTasks = async ({ token }: RequestOptions): Promise<Task[]> => {
  const response = await fetch(API_ROUTES.TASKS, {
    method: 'GET',
    headers: authHeaders(token),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }

  return response.json();
};

export const createTask = async (
  input: CreateTaskInput,
  { token }: RequestOptions
): Promise<Task> => {
  const response = await fetch(API_ROUTES.TASKS, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to create task');
  }

  return response.json();
};

export const updateTask = async (
  input: UpdateTaskInput,
  { token }: RequestOptions
): Promise<Task> => {
  const response = await fetch(API_ROUTES.TASK(input.id), {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ title: input.title }),
  });

  if (!response.ok) {
    throw new Error('Failed to update task');
  }

  return response.json();
};

export const deleteTask = async (
  id: string,
  { token }: RequestOptions
): Promise<void> => {
  const response = await fetch(API_ROUTES.TASK(id), {
    method: 'DELETE',
    headers: authHeaders(token),
  });

  if (!response.ok) {
    throw new Error('Failed to delete task');
  }
};

export const toggleTask = async (
  id: string,
  completed: boolean,
  { token }: RequestOptions
): Promise<Task> => {
  const response = await fetch(API_ROUTES.TASK(id), {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ completed }),
  });

  if (!response.ok) {
    throw new Error('Failed to update task');
  }

  return response.json();
};