'use client';

import React from 'react';
import LeftSidebar from '@/app/components/LeftSidebar';
import RightSidebar from '@/app/components/RightSidebar';
import { ProjectProvider, useProject } from '@/app/contexts/ProjectContext';
import { TaskProvider, useTask } from '@/app/contexts/TaskContext';

function ApplicationContent({ children }: { children: React.ReactNode }) {
  const { projects, selectedProjectId, selectProject, addProject } = useProject();
  const { tasks, selectedTaskId, selectTask } = useTask();

  return (
    <div className="flex h-screen">
      <LeftSidebar
        projects={projects}
        selectedProjectId={selectedProjectId}
        onProjectSelect={selectProject}
        onAddProject={addProject}
      />
      <main className="flex-1 overflow-auto">{children}</main>
      <RightSidebar
        selectedTask={selectedTaskId ? tasks[selectedTaskId] : null}
        onEditTask={selectTask}
      />
    </div>
  );
}

export default function ApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProjectProvider>
      <TaskProvider>
        <ApplicationContent>{children}</ApplicationContent>
      </TaskProvider>
    </ProjectProvider>
  );
}
