'use client';

import React from 'react';
import LeftSidebar from '@/app/components/Organisms/Sidebar/LeftSidebar';
// import RightSidebar from '@/app/components/Organisms/Sidebar/RightSidebar';
import { ProjectProvider, useProject } from '@/app/contexts/ProjectContext';
import { TaskProvider } from '@/app/contexts/TaskContext';
import { SidebarProvider } from '@/app/components/Atomic/sidebar';

function ApplicationContent({ children }: { children: React.ReactNode }) {
  const { projects, selectedProjectId, selectProject, addProject } = useProject();
  // const { tasks, selectedTaskId, selectTask } = useTask();

  return (
    <div className="flex h-screen">
      <SidebarProvider>
        <LeftSidebar
          projects={projects}
          selectedProjectId={selectedProjectId}
          onProjectSelect={selectProject}
          onAddProject={addProject}
        />
      </SidebarProvider>
      <main className="flex-1 overflow-auto">{children}</main>
      {/* <RightSidebar
        selectedTask={selectedTaskId ? tasks[selectedTaskId] : null}
        onEditTask={selectTask}
      /> */}
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
