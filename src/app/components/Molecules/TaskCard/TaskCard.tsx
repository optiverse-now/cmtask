import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Badge } from '@/app/components/Atomic/badge';
import { Card } from '@/app/components/Atomic/card';
import { TaskPriority } from '@/app/types/task';

interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  priority: TaskPriority;
  onClick: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  id,
  title,
  description,
  assignee,
  dueDate,
  priority,
  onClick,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityColors: Record<TaskPriority, 'default' | 'secondary' | 'destructive'> = {
    '高': 'destructive',
    '中': 'secondary',
    '低': 'default',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card
        className="cursor-pointer hover:bg-accent"
        onClick={onClick}
      >
        <div className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-lg font-semibold">{title}</h3>
            <Badge variant={priorityColors[priority]}>{priority}</Badge>
          </div>
          <p className="mb-2 text-sm text-muted-foreground">{description}</p>
          <div className="flex items-center justify-between text-sm">
            <span>{assignee}</span>
            <span>{new Date(dueDate).toLocaleDateString()}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}; 