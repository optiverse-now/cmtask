import React from 'react';
import { useDroppable } from '@dnd-kit/core';

interface TaskColumnProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

export const TaskColumn: React.FC<TaskColumnProps> = ({ id, title, children }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="mb-4 text-lg font-semibold">{title}</h3>
      <div
        ref={setNodeRef}
        className={`min-h-[200px] space-y-2 transition-colors ${
          isOver ? 'bg-accent/50' : ''
        }`}
      >
        {children}
      </div>
    </div>
  );
}; 