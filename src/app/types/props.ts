import { DragEndEvent } from '@dnd-kit/core';
import { TaskPriority } from './task';

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