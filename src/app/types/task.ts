export type TaskStatus = '未着手' | '進行中' | '完了';
export type TaskPriority = '低' | '中' | '高';

export const TASK_STATUSES: TaskStatus[] = ['未着手', '進行中', '完了'];
export const TASK_PRIORITIES: TaskPriority[] = ['低', '中', '高'];

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignee: string;
  dueDate: string;
  priority: TaskPriority;
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

export interface TaskContextState {
  tasks: { [key: string]: Task };
  columns: { [key: string]: Column };
  columnOrder: string[];
  selectedTaskId: string | null;
}

export interface TaskContextActions {
  addTask: (
    projectId: string,
    title: string,
    description: string,
    assignee: string,
    dueDate: Date,
    priority: TaskPriority
  ) => void;
  updateTask: (
    id: string,
    title: string,
    description: string,
    assignee: string,
    dueDate: Date,
    priority: TaskPriority
  ) => void;
  deleteTask: (id: string) => void;
  selectTask: (id: string | null) => void;
  moveTask: (result: import('@dnd-kit/core').DragEndEvent) => void;
  getIncompleteTasksCount: (projectId: string) => number;
}

export interface TaskContextType extends TaskContextState, TaskContextActions {} 