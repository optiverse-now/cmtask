import React, { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { Button } from '@/app/components/Atomic/button';
import { Plus, CheckCircle } from 'lucide-react';
import { TaskCard } from '@/app/components/Molecules/TaskCard/TaskCard';
import { TaskColumn } from '@/app/components/Organisms/TaskColumn/TaskColumn';
import TaskModal from '@/app/components/features/task/TaskModal';
import { useTask } from '@/app/contexts/TaskContext';
import { TaskBoardProps } from '@/app/types/props';

/**
 * タスクボードコンポーネント
 * プロジェクト内のタスクをカンバン方式で表示・管理するコンポーネント
 */
const TaskBoard: React.FC<TaskBoardProps> = ({
  selectedProjectId,
  onAddTask,
  onTaskMove,
  onEditTask,
  onCompleteProject,
  projectStatus,
}) => {
  const { tasks, columns, columnOrder, selectTask, selectedTaskId } = useTask();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    
    if (!over) return;

    const overId = over.id;
    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    if (activeType === 'task') {
      if (overType === 'column') {
        onTaskMove(event);
      } else if (overType === 'task') {
        const modifiedEvent = {
          ...event,
          over: {
            ...over,
            id: overId.toString().replace('droppable-', '')
          }
        };
        onTaskMove(modifiedEvent);
      }
    }
  };

  // 選択されたプロジェクトのタスクのみをフィルタリング
  const filteredTasks = selectedProjectId
    ? Object.fromEntries(
        Object.entries(tasks).filter(
          ([, task]) => task.projectId === selectedProjectId
        )
      )
    : {};

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
          onDragStart={handleDragStart}
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
                <TaskColumn key={column.id} id={column.id} title={column.title}>
                  {columnTasks.map((task) => (
                    <TaskCard
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
                </TaskColumn>
              );
            })}
          </div>
          <DragOverlay>
            {activeId && tasks[activeId] ? (
              <TaskCard
                {...tasks[activeId]}
                onClick={() => {}}
              />
            ) : null}
          </DragOverlay>
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