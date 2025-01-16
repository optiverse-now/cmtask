'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Task, TaskStatus, TaskPriority } from '@/app/types/props';
import { useProject } from './ProjectContext';
import { APIClient } from '@/app/lib/api';

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
    priority: TaskPriority
  ) => Promise<void>;
  updateTask: (
    id: string,
    title: string,
    description: string,
    assignee: string,
    dueDate: Date,
    priority: TaskPriority
  ) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  moveTask: (taskId: string, fromColumnId: string, toColumnId: string) => Promise<void>;
  selectTask: (id: string | null) => void;
  getIncompleteTasksCount: (projectId: string) => number;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const INITIAL_COLUMNS: { [key: string]: Column } = {
  'column-1': {
    id: 'column-1',
    title: '未着手',
    taskIds: [],
  },
  'column-2': {
    id: 'column-2',
    title: '進行中',
    taskIds: [],
  },
  'column-3': {
    id: 'column-3',
    title: '完了',
    taskIds: [],
  },
};

const COLUMN_ORDER = ['column-1', 'column-2', 'column-3'];

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<{ [key: string]: Task }>({});
  const [columns, setColumns] = useState<{ [key: string]: Column }>({
    'column-1': {
      id: 'column-1',
      title: '未着手',
      taskIds: [],
    },
    'column-2': {
      id: 'column-2',
      title: '進行中',
      taskIds: [],
    },
    'column-3': {
      id: 'column-3',
      title: '完了',
      taskIds: [],
    },
  });
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const { selectedProjectId, updateProjectStatus } = useProject();

  const loadProjectTasks = useCallback(async (projectId: string) => {
    try {
      console.log('Loading tasks for project:', projectId);
      const fetchedTasks = await APIClient.getProjectTasks(projectId);
      console.log('Fetched tasks:', fetchedTasks);
      
      const tasksMap = (fetchedTasks || []).reduce((acc, task) => {
        acc[task.id] = task;
        return acc;
      }, {} as { [key: string]: Task });

      const newColumns: { [key: string]: Column } = {
        'column-1': { id: 'column-1', title: '未着手', taskIds: [] },
        'column-2': { id: 'column-2', title: '進行中', taskIds: [] },
        'column-3': { id: 'column-3', title: '完了', taskIds: [] },
      };

      if (fetchedTasks && fetchedTasks.length > 0) {
        fetchedTasks.forEach(task => {
          const columnId = getColumnIdByStatus(task.status);
          if (columnId && columnId in newColumns) {
            newColumns[columnId].taskIds.push(task.id);
          }
        });
      }

      console.log('Setting tasks:', tasksMap);
      console.log('Setting columns:', newColumns);
      
      setTasks(tasksMap);
      setColumns(newColumns);
    } catch (error) {
      console.error('タスクの取得に失敗しました:', error);
      setTasks({});
      setColumns({
        'column-1': { id: 'column-1', title: '未着手', taskIds: [] },
        'column-2': { id: 'column-2', title: '進行中', taskIds: [] },
        'column-3': { id: 'column-3', title: '完了', taskIds: [] },
      } as { [key: string]: Column });
    }
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      console.log('Selected project changed:', selectedProjectId);
      loadProjectTasks(selectedProjectId);
    } else {
      setTasks({});
      setColumns({ ...INITIAL_COLUMNS });
    }
  }, [selectedProjectId, loadProjectTasks]);

  const getColumnIdByStatus = (status: TaskStatus): string => {
    switch (status) {
      case '未着手':
        return 'column-1';
      case '進行中':
        return 'column-2';
      case '完了':
        return 'column-3';
      default:
        return 'column-1';
    }
  };

  const getStatusByColumnId = (columnId: string): TaskStatus => {
    switch (columnId) {
      case 'column-1':
        return '未着手';
      case 'column-2':
        return '進行中';
      case 'column-3':
        return '完了';
      default:
        return '未着手';
    }
  };

  const addTask = async (
    projectId: string,
    title: string,
    description: string,
    assignee: string,
    dueDate: Date,
    priority: TaskPriority
  ) => {
    try {
      const newTask = await APIClient.createTask({
        projectId,
        title,
        description,
        assignee,
        dueDate,
        priority,
      });

      setTasks(prev => ({ ...prev, [newTask.id]: newTask }));
      setColumns(prev => ({
        ...prev,
        'column-1': {
          ...prev['column-1'],
          taskIds: [...prev['column-1'].taskIds, newTask.id],
        },
      }));

      if (projectId) {
        updateProjectStatus(projectId, '進行中');
      }
    } catch (error) {
      console.error('タスクの作成に失敗しました:', error);
      throw error;
    }
  };

  const updateTask = async (
    id: string,
    title: string,
    description: string,
    assignee: string,
    dueDate: Date,
    priority: TaskPriority
  ) => {
    try {
      const updatedTask = await APIClient.updateTask(id, {
        title,
        description,
        assignee: { name: assignee },
        dueDate: dueDate.toISOString(),
        priority,
      });

      setTasks(prev => ({ ...prev, [id]: updatedTask }));
    } catch (error) {
      console.error('タスクの更新に失敗しました:', error);
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await APIClient.deleteTask(id);
      const { [id]: deletedTask, ...remainingTasks } = tasks;
      setTasks(remainingTasks);

      setColumns(prev => {
        const newColumns = { ...prev };
        Object.keys(newColumns).forEach(columnId => {
          newColumns[columnId] = {
            ...newColumns[columnId],
            taskIds: newColumns[columnId].taskIds.filter(taskId => taskId !== id),
          };
        });
        return newColumns;
      });

      if (selectedTaskId === id) {
        setSelectedTaskId(null);
      }

      if (deletedTask && deletedTask.projectId) {
        updateProjectStatus(deletedTask.projectId, '未着手');
      }
    } catch (error) {
      console.error('タスクの削除に失敗しました:', error);
      throw error;
    }
  };

  const moveTask = async (taskId: string, fromColumnId: string | undefined, toColumnId: string) => {
    try {
      if (!taskId || !toColumnId) {
        console.error('Missing required parameters:', { taskId, toColumnId });
        return;
      }

      const task = tasks[taskId];
      if (!task) {
        console.error('Task not found:', taskId);
        return;
      }

      if (!toColumnId.startsWith('column-')) {
        console.error('Invalid column ID format:', toColumnId);
        return;
      }

      const actualFromColumnId = fromColumnId || getColumnIdByStatus(task.status);
      
      if (!columns[actualFromColumnId] || !columns[toColumnId]) {
        console.error('Invalid column ID:', { fromColumnId: actualFromColumnId, toColumnId });
        return;
      }

      if (actualFromColumnId === toColumnId) {
        console.log('Task is already in the target column');
        return;
      }

      const newStatus = getStatusByColumnId(toColumnId);
      const updatedTask = await APIClient.updateTask(taskId, { status: newStatus });

      setTasks(prev => ({ ...prev, [taskId]: updatedTask }));
      setColumns(prev => {
        const newColumns = { ...prev };
        if (newColumns[actualFromColumnId] && newColumns[toColumnId]) {
          newColumns[actualFromColumnId] = {
            ...newColumns[actualFromColumnId],
            taskIds: newColumns[actualFromColumnId].taskIds.filter(id => id !== taskId)
          };
          newColumns[toColumnId] = {
            ...newColumns[toColumnId],
            taskIds: [...newColumns[toColumnId].taskIds, taskId]
          };
        }
        return newColumns;
      });

      if (task.projectId) {
        const projectStatus = calculateProjectStatus(task.projectId);
        if (projectStatus) {
          updateProjectStatus(task.projectId, projectStatus);
        }
      }

      console.log('Task moved successfully:', {
        taskId,
        from: actualFromColumnId,
        to: toColumnId,
        newStatus
      });
    } catch (error) {
      console.error('タスクの移動に失敗しました:', error);
      throw error;
    }
  };

  const calculateProjectStatus = (projectId: string): TaskStatus => {
    const projectTasks = Object.values(tasks).filter(task => task.projectId === projectId);
    if (projectTasks.length === 0) return '未着手';

    const hasInProgress = projectTasks.some(task => task.status === '進行中');
    const allCompleted = projectTasks.every(task => task.status === '完了');
    const allNotStarted = projectTasks.every(task => task.status === '未着手');

    if (allCompleted) return '完了';
    if (hasInProgress || !allNotStarted) return '進行中';
    return '未着手';
  };

  const selectTask = (id: string | null) => {
    setSelectedTaskId(id);
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
        columnOrder: COLUMN_ORDER,
        selectedTaskId,
        addTask,
        updateTask,
        deleteTask,
        moveTask,
        selectTask,
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