'use client';

import React, { createContext, useContext, useState } from 'react';
import { DragEndEvent } from '@dnd-kit/core';

interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: '未着手' | '進行中' | '完了';
  assignee: string;
  dueDate: string;
  priority: '低' | '中' | '高';
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
    priority: '低' | '中' | '高',
    status: '未着手' | '進行中' | '完了' = '未着手'
  ) => {
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
    priority: '低' | '中' | '高'
  ) => {
    const task = tasks[id];
    if (!task) return;

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

  const moveTask = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // カラムへのドロップを処理
    const overColumn = columnOrder.find((columnId) => columnId === overId);
    if (overColumn) {
      const activeColumn = Object.values(columns).find((column) =>
        column.taskIds.includes(activeId)
      );
      if (!activeColumn) return;

      // タスクを移動
      const updatedColumns = {
        ...columns,
        [activeColumn.id]: {
          ...activeColumn,
          taskIds: activeColumn.taskIds.filter((id) => id !== activeId),
        },
        [overColumn]: {
          ...columns[overColumn],
          taskIds: [...columns[overColumn].taskIds, activeId],
        },
      };

      setColumns(updatedColumns);

      // タスクのステータスを更新
      const updatedTask = {
        ...tasks[activeId],
        status: overColumn as '未着手' | '進行中' | '完了',
        updatedAt: new Date().toISOString(),
      };

      setTasks({
        ...tasks,
        [activeId]: updatedTask,
      });
      return;
    }

    // タスク上へのドロップを処理
    const overTask = tasks[overId];
    if (overTask) {
      const targetColumn = Object.values(columns).find((column) =>
        column.taskIds.includes(overId)
      );
      const activeColumn = Object.values(columns).find((column) =>
        column.taskIds.includes(activeId)
      );
      if (!targetColumn || !activeColumn) return;

      // 同じカラム内での移動の場合
      if (targetColumn.id === activeColumn.id) {
        const currentTasks = [...targetColumn.taskIds];
        const oldIndex = currentTasks.indexOf(activeId);
        const newIndex = currentTasks.indexOf(overId);

        // タスクの順序を入れ替え
        currentTasks.splice(oldIndex, 1);
        currentTasks.splice(newIndex, 0, activeId);

        setColumns({
          ...columns,
          [targetColumn.id]: {
            ...targetColumn,
            taskIds: currentTasks,
          },
        });
        return;
      }

      // 異なるカラム間での移動の場合
      const updatedColumns = {
        ...columns,
        [activeColumn.id]: {
          ...activeColumn,
          taskIds: activeColumn.taskIds.filter((id) => id !== activeId),
        },
        [targetColumn.id]: {
          ...targetColumn,
          taskIds: [...targetColumn.taskIds, activeId],
        },
      };

      setColumns(updatedColumns);

      // タスクのステータスを更新
      const updatedTask = {
        ...tasks[activeId],
        status: targetColumn.id as '未着手' | '進行中' | '完了',
        updatedAt: new Date().toISOString(),
      };

      setTasks({
        ...tasks,
        [activeId]: updatedTask,
      });
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