export type Task = {
    id: string;
    title: string;
    completed: boolean;
  };
  
  export type CreateTaskInput = {
    title: string;
  };
  
  export type UpdateTaskInput = {
    id: string;
    title: string;
  };