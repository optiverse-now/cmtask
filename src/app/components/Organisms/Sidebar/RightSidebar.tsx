import React from 'react';
import { Button } from '@/app/components/Atomic/button';
import { Settings } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface RightSidebarProps {
  selectedTask: Task | null;
  onEditTask: (taskId: string) => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({
  selectedTask,
  onEditTask,
}) => {
  if (!selectedTask) {
    return (
      <div className="flex h-full w-64 flex-col border-l bg-background">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-semibold">AIチャット</h2>
        </div>
        <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          タスクを選択してください
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-64 flex-col border-l bg-background">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-lg font-semibold">タスク詳細</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEditTask(selectedTask.id)}
          className="h-8 w-8"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 space-y-4 overflow-auto p-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">タイトル</h3>
          <p className="mt-1 text-sm">{selectedTask.title}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">説明</h3>
          <p className="mt-1 text-sm">{selectedTask.description}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">ステータス</h3>
          <p className="mt-1 text-sm">{selectedTask.status}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">作成日時</h3>
          <p className="mt-1 text-sm">
            {new Date(selectedTask.createdAt).toLocaleString()}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">更新日時</h3>
          <p className="mt-1 text-sm">
            {new Date(selectedTask.updatedAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar; 