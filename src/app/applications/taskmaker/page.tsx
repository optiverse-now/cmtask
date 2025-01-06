"use client";

import React, { useState } from 'react';
import TaskBoard from '@/app/components/TaskBoard';
import CreateTaskModal from '@/app/components/CreateTaskModal';
import { useProject } from '@/app/contexts/ProjectContext';
import { useTask } from '@/app/contexts/TaskContext';
import TaskModal from '@/app/components/TaskModal';

export default function TaskMakerPage() {
  const { selectedProjectId, completeProject, getSelectedProject } = useProject();
  const { selectedTaskId, moveTask, selectTask } = useTask();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const selectedProject = getSelectedProject();

  const handleAddTask = () => {
    if (!selectedProjectId) return;
    setIsTaskModalOpen(true);
    selectTask(null);
  };

  const handleEditTask = (taskId: string) => {
    selectTask(taskId);
  };

  if (!selectedProjectId) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-lg text-muted-foreground">
          プロジェクトを選択してください
        </p>
      </div>
    );
  }

  return (
    <>
      <TaskBoard
        selectedProjectId={selectedProjectId}
        onTaskMove={moveTask}
        onAddTask={handleAddTask}
        onEditTask={handleEditTask}
        onCompleteProject={selectedProject && selectedProject.status !== '完了' ? () => completeProject(selectedProject.id) : undefined}
        projectStatus={selectedProject?.status}
      />
      {!selectedTaskId && isTaskModalOpen && (
        <CreateTaskModal
          projectId={selectedProjectId}
          isOpen={isTaskModalOpen}
          onClose={() => {
            setIsTaskModalOpen(false);
            selectTask(null);
          }}
        />
      )}
      {selectedTaskId && (
        <TaskModal
          taskId={selectedTaskId}
          onClose={() => selectTask(null)}
        />
      )}
    </>
  );
}
