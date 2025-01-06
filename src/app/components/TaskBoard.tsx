import React from 'react';
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Button } from '@/app/components/ui/button';
import { Plus, CheckCircle } from 'lucide-react';
import { TaskItem } from '@/app/components/TaskItem';
import { TaskColumn } from '@/app/components/TaskColumn';
import TaskModal from '@/app/components/TaskModal';
import { useTask } from '@/app/contexts/TaskContext';

interface TaskBoardProps {
  selectedProjectId: string | null;
  onAddTask: () => void;
  onTaskMove: (result: DragEndEvent) => void;
  onEditTask: (taskId: string) => void;
  onCompleteProject?: () => void;
  projectStatus?: string;
}

const TaskBoard: React.FC<TaskBoardProps> = ({
  selectedProjectId,
  onAddTask,
  onTaskMove,
  onEditTask,
  onCompleteProject,
  projectStatus,
}) => {
  const { tasks, columns, columnOrder, selectTask, selectedTaskId } = useTask();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // 選択されたプロジェクトのタスクのみをフィルタリング
  const filteredTasks = selectedProjectId
    ? Object.fromEntries(
        Object.entries(tasks).filter(
          ([, task]) => task.projectId === selectedProjectId
        )
      )
    : {};

  const handleDragEnd = (event: DragEndEvent) => {
    const { over } = event;
    
    if (!over) return;

    const overId = over.id as string;

    // カラムへのドロップを処理
    const overColumn = columnOrder.find((columnId) => columnId === overId);
    if (overColumn) {
      onTaskMove(event);
      return;
    }

    // タスク上へのドロップを処理
    const overTask = Object.values(filteredTasks).find(task => task.id === overId);
    if (overTask) {
      onTaskMove(event);
    }
  };

  return (
    <div className="flex-1 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">タスクボード</h2>
        {selectedProjectId && (
          <div className="flex items-center gap-2">
            {projectStatus !== '完了' && onCompleteProject && (
              <Button
                variant="outline"
                onClick={onCompleteProject}
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                完了にする
              </Button>
            )}
            <Button onClick={onAddTask} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              新規タスク
            </Button>
          </div>
        )}
      </div>
      {selectedProjectId ? (
        <DndContext
          sensors={sensors}
          onDragEnd={handleDragEnd}
          collisionDetection={closestCorners}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {columnOrder.map((columnId) => {
              const column = columns[columnId];
              const columnTasks = column.taskIds
                .map((taskId) => filteredTasks[taskId])
                .filter(Boolean);

              return (
                <TaskColumn key={column.id} title={column.title} id={column.id}>
                  <SortableContext
                    items={columnTasks.map((task) => task.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {columnTasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        id={task.id}
                        title={task.title}
                        description={task.description}
                        assignee={task.assignee}
                        dueDate={task.dueDate}
                        priority={task.priority}
                        onClick={() => onEditTask(task.id)}
                      />
                    ))}
                  </SortableContext>
                </TaskColumn>
              );
            })}
          </div>
        </DndContext>
      ) : (
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground">
            プロジェクトを選択してタスクを表示
          </p>
        </div>
      )}
      {selectedTaskId && (
        <TaskModal
          taskId={selectedTaskId}
          onClose={() => selectTask(null)}
        />
      )}
    </div>
  );
};

export default TaskBoard; 