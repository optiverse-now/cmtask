import { DragEndEvent } from '@dnd-kit/core';

export interface TaskBoardProps {
  selectedProjectId: string | null;
  onAddTask: () => void;
  onTaskMove: (event: DragEndEvent) => void;
  onEditTask: (taskId: string) => void;
  onCompleteProject?: () => void;
  projectStatus?: string;
}

export interface TaskItemProps {
  id: string;
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  priority: TaskPriority;
  onClick: () => void;
}

export interface TaskColumnProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

export interface TaskModalProps {
  taskId: string;
  onClose: () => void;
}

export interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  assignee?: {
    name: string;
    avatarUrl?: string;
  };
  dueDate?: string;
  priority: TaskPriority;
  onClick: () => void;
}

export type ProjectStatus = '未着手' | '進行中' | '完了';
export type TaskStatus = '未着手' | '進行中' | '完了';
export type TaskPriority = '低' | '中' | '高';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignee: {
    name: string;
    avatarUrl?: string;
  };
  dueDate: string;
  priority: TaskPriority;
  createdAt: string;
  updatedAt: string;
} 