import { useDraggable, useDroppable } from '@dnd-kit/core';
import { Card } from '@/app/components/Atomic/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/Atomic/avatar';
import { Badge } from '@/app/components/Atomic/badge';
import { CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import { TaskCardProps } from '@/app/types/props';

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
    setNodeRef: setDraggableRef,
    transform,
    isDragging
  } = useDraggable({
    id,
    data: {
      type: 'task'
    }
  });

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `droppable-${id}`,
    data: {
      type: 'task'
    }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <Card
      ref={(node) => {
        setDraggableRef(node);
        setDroppableRef(node);
      }}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={`
        cursor-pointer hover:shadow-md transition-shadow
        ${isDragging ? 'opacity-50' : ''}
        ${isOver ? 'border-t-2 border-blue-500' : ''}
      `}
    >
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg">{title}</h3>
          <Badge variant={priority === '高' ? 'destructive' : priority === '中' ? 'default' : 'secondary'}>
            {priority}
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        
        <div className="flex justify-between items-center pt-2">
          {assignee && (
            <div className="flex items-center space-x-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={assignee.avatarUrl} />
                <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">{assignee.name}</span>
            </div>
          )}
          
          {dueDate && (
            <div className="flex items-center space-x-1 text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              <span className="text-sm">{format(new Date(dueDate), 'MM/dd')}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}; 