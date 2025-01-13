export type TaskPriority = "低" | "中" | "高";

export interface TaskFormState {
  title: string;
  description: string;
  assignee: string;
  dueDate: Date;
  priority: TaskPriority;
}

export interface TaskFormErrors {
  title?: string;
  description?: string;
  assignee?: string;
}
