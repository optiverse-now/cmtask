import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { CalendarIcon, User } from 'lucide-react';

interface TaskItemProps {
  id: string;
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  priority: '低' | '中' | '高';
  onClick: () => void;
}

const priorityColors = {
  低: 'bg-blue-100 text-blue-800',
  中: 'bg-yellow-100 text-yellow-800',
  高: 'bg-red-100 text-red-800',
};

export const TaskItem: React.FC<TaskItemProps> = ({
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
    isDragging,
  } = useSortable({
    id: id,
    disabled: false,
  });

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      onClick();
    }
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="touch-none"
    >
      <Card
        className="mb-2 cursor-pointer hover:bg-accent"
        onClick={handleClick}
      >
        <CardHeader className="p-4 pb-2">
          <div className="flex items-start justify-between">
            <CardTitle className="text-base">{title}</CardTitle>
            <Badge
              variant="secondary"
              className={priorityColors[priority]}
            >
              {priority}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="mb-2 text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{assignee}</span>
            </div>
            <div className="flex items-center gap-1">
              <CalendarIcon className="h-4 w-4" />
              <span>{format(new Date(dueDate), 'M/d', { locale: ja })}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskItem; 