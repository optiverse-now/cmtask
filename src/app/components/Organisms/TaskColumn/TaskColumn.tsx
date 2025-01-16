import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Card } from '@/app/components/Atomic/card';
import Droppable from '@/app/components/Atomic/droppable';

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
    <Droppable id={id}>
      <Card 
        ref={setNodeRef}
        className={`
          flex flex-col h-[calc(100vh-8rem)] w-full overflow-hidden
          ${isOver ? 'bg-accent' : ''}
        `}
      >
        <h3 className="text-lg font-semibold p-4">{title}</h3>
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-2">
          {children}
        </div>
      </Card>
    </Droppable>
  );
}; 