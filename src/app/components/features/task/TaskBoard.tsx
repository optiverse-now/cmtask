import React from 'react';
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { Button } from '@/app/components/Atomic/button';
import { Plus } from 'lucide-react';
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
  projectStatus,
}) => {
  console.log('TaskBoard component mounting');
  
  const { tasks, columns, columnOrder, selectTask, selectedTaskId } = useTask();

  console.log('TaskBoard render:', {
    selectedProjectId,
    projectStatus,
    tasks,
    columns,
    columnOrder,
    selectedTaskId,
    renderingColumns: true
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    
    // ドロップ先の種類を判定
    const isOverColumn = overId.startsWith('column-');
    const isOverTask = overId.startsWith('task-');

    if (!isOverColumn && !isOverTask) {
      console.error('Invalid drop target:', overId);
      return;
    }

    // タスクをドロップした場合の処理
    if (active.data.current?.type === 'task') {
      let targetColumnId: string;

      if (isOverColumn) {
        // カラムに直接ドロップした場合
        targetColumnId = overId;
      } else if (isOverTask) {
        // 他のタスクの上にドロップした場合
        // task-プレフィックスを除去してタスクIDを取得
        const targetTaskId = overId.replace('task-', '');
        // タスクが属するカラムを特定
        targetColumnId = Object.keys(columns).find(columnId => 
          columns[columnId].taskIds.includes(targetTaskId)
        ) || '';
      } else {
        return;
      }

      if (!targetColumnId) {
        console.error('Target column not found');
        return;
      }

      // DragEndEventの形式に合わせてイベントを作成
      const modifiedEvent: DragEndEvent = {
        ...event,
        active: {
          id: activeId,
          data: active.data,
          rect: active.rect
        },
        over: {
          id: targetColumnId,
          data: {
            current: {
              type: 'column'
            }
          },
          rect: over.rect,
          disabled: false
        }
      };

      onTaskMove(modifiedEvent);
    }
  };

  // 選択されたプロジェクトのタスクのみをフィルタリング
  const filteredTasks = selectedProjectId
    ? Object.fromEntries(
        Object.entries(tasks).filter(
          ([, task]) => task.projectId === selectedProjectId
        )
      )
    : {}; // プロジェクト未選択時は空のオブジェクト

  return (
    <div className="flex flex-col h-full w-full p-4 max-w-[100vw] overflow-hidden">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">タスクボード</h2>
        <div className="flex items-center gap-2">
          <Button 
            onClick={onAddTask} 
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            新規タスク
          </Button>
        </div>
      </div>
      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCorners}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 flex-1 overflow-hidden max-w-full">
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
      </DndContext>
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