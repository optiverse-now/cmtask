import { useDroppable } from '@dnd-kit/core';
import { Card } from '@/app/components/Atomic/card';

interface TaskColumnProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

export const TaskColumn: React.FC<TaskColumnProps> = ({ id, title, children }) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: 'column'
    }
  });

  return (
    <Card 
      ref={setNodeRef}
      className={`
        p-4 h-full
        ${isOver ? 'bg-accent' : ''}
      `}
    >
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-2">
        {children}
      </div>
    </Card>
  );
}; 