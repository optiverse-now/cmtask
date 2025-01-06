'use client';

import React, { createContext, useContext, useState } from 'react';
import { DragEndEvent } from '@dnd-kit/core';

export type TaskStatus = '未着手' | '進行中' | '完了';
export type TaskPriority = '低' | '中' | '高';

export const TASK_STATUSES: TaskStatus[] = ['未着手', '進行中', '完了'];
export const TASK_PRIORITIES: TaskPriority[] = ['低', '中', '高'];

interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignee: string;
  dueDate: string;
  priority: TaskPriority;
  createdAt: string;
  updatedAt: string;
}

interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

interface TaskContextType {
  tasks: { [key: string]: Task };
  columns: { [key: string]: Column };
  columnOrder: string[];
  selectedTaskId: string | null;
  addTask: (
    projectId: string,
    title: string,
    description: string,
    assignee: string,
    dueDate: Date,
    priority: '低' | '中' | '高'
  ) => void;
  updateTask: (
    id: string,
    title: string,
    description: string,
    assignee: string,
    dueDate: Date,
    priority: '低' | '中' | '高'
  ) => void;
  deleteTask: (id: string) => void;
  selectTask: (id: string | null) => void;
  moveTask: (result: DragEndEvent) => void;
  getIncompleteTasksCount: (projectId: string) => number;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<{ [key: string]: Task }>({});
  const [columns, setColumns] = useState<{ [key: string]: Column }>({
    未着手: {
      id: '未着手',
      title: '未着手',
      taskIds: [],
    },
    進行中: {
      id: '進行中',
      title: '進行中',
      taskIds: [],
    },
    完了: {
      id: '完了',
      title: '完了',
      taskIds: [],
    },
  });
  const [columnOrder] = useState(['未着手', '進行中', '完了']);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const addTask = (
    projectId: string,
    title: string,
    description: string,
    assignee: string,
    dueDate: Date,
    priority: TaskPriority,
    status: TaskStatus = '未着手'
  ) => {
    if (!projectId || !title) {
      throw new Error('プロジェクトIDとタイトルは必須です');
    }

    if (!TASK_STATUSES.includes(status)) {
      throw new Error('無効なステータスです');
    }

    if (!TASK_PRIORITIES.includes(priority)) {
      throw new Error('無効な優先度です');
    }

    const now = new Date().toISOString();
    const newTaskId = `task-${Object.keys(tasks).length + 1}`;
    const newTask: Task = {
      id: newTaskId,
      projectId,
      title,
      description,
      status,
      assignee,
      dueDate: dueDate.toISOString(),
      priority,
      createdAt: now,
      updatedAt: now,
    };

    setTasks({
      ...tasks,
      [newTaskId]: newTask,
    });

    setColumns({
      ...columns,
      [status]: {
        ...columns[status],
        taskIds: [...columns[status].taskIds, newTaskId],
      },
    });
  };

  const updateTask = (
    id: string,
    title: string,
    description: string,
    assignee: string,
    dueDate: Date,
    priority: TaskPriority
  ) => {
    const task = tasks[id];
    if (!task) {
      throw new Error('指定されたタスクが見つかりません');
    }

    if (!title) {
      throw new Error('タイトルは必須です');
    }

    if (!TASK_PRIORITIES.includes(priority)) {
      throw new Error('無効な優先度です');
    }

    const updatedTask = {
      ...task,
      title,
      description,
      assignee,
      dueDate: dueDate.toISOString(),
      priority,
      updatedAt: new Date().toISOString(),
    };

    setTasks({
      ...tasks,
      [id]: updatedTask,
    });
  };

  const deleteTask = (id: string) => {
    const { [id]: deletedTask, ...remainingTasks } = tasks;
    if (!deletedTask) return;

    setTasks(remainingTasks);

    const updatedColumns = Object.entries(columns).reduce(
      (acc, [columnId, column]) => ({
        ...acc,
        [columnId]: {
          ...column,
          taskIds: column.taskIds.filter((taskId) => taskId !== id),
        },
      }),
      {}
    );

    setColumns(updatedColumns);

    if (selectedTaskId === id) {
      setSelectedTaskId(null);
    }
  };

  const selectTask = (id: string | null) => {
    setSelectedTaskId(id);
  };

  const moveTaskBetweenColumns = (
    activeId: string,
    targetColumnId: string,
    sourceColumnId: string
  ) => {
    setColumns({
      ...columns,
      [sourceColumnId]: {
        ...columns[sourceColumnId],
        taskIds: columns[sourceColumnId].taskIds.filter((id) => id !== activeId),
      },
      [targetColumnId]: {
        ...columns[targetColumnId],
        taskIds: [...columns[targetColumnId].taskIds, activeId],
      },
    });

    setTasks({
      ...tasks,
      [activeId]: {
        ...tasks[activeId],
        status: targetColumnId as '未着手' | '進行中' | '完了',
        updatedAt: new Date().toISOString(),
      },
    });
  };

  const reorderTasksInColumn = (
    columnId: string,
    taskId: string,
    oldIndex: number,
    newIndex: number
  ) => {
    const currentTasks = [...columns[columnId].taskIds];
    currentTasks.splice(oldIndex, 1);
    currentTasks.splice(newIndex, 0, taskId);

    setColumns({
      ...columns,
      [columnId]: {
        ...columns[columnId],
        taskIds: currentTasks,
      },
    });
  };

  const moveTask = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const targetColumn = columnOrder.find((columnId) => columnId === overId);
    if (targetColumn) {
      const sourceColumn = Object.values(columns).find((column) =>
        column.taskIds.includes(activeId)
      );
      if (!sourceColumn) return;
      
      moveTaskBetweenColumns(activeId, targetColumn, sourceColumn.id);
      return;
    }

    const overTask = tasks[overId];
    if (overTask) {
      const targetColumn = Object.values(columns).find((column) =>
        column.taskIds.includes(overId)
      );
      const sourceColumn = Object.values(columns).find((column) =>
        column.taskIds.includes(activeId)
      );
      if (!targetColumn || !sourceColumn) return;

      if (targetColumn.id === sourceColumn.id) {
        const oldIndex = targetColumn.taskIds.indexOf(activeId);
        const newIndex = targetColumn.taskIds.indexOf(overId);
        reorderTasksInColumn(targetColumn.id, activeId, oldIndex, newIndex);
      } else {
        moveTaskBetweenColumns(activeId, targetColumn.id, sourceColumn.id);
      }
    }
  };

  const getIncompleteTasksCount = (projectId: string): number => {
    return Object.values(tasks).filter(
      task => task.projectId === projectId && task.status !== '完了'
    ).length;
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        columns,
        columnOrder,
        selectedTaskId,
        addTask,
        updateTask,
        deleteTask,
        selectTask,
        moveTask,
        getIncompleteTasksCount,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTask() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
} 