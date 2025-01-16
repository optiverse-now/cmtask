'use client';

import React from 'react';
import { ProjectProvider } from '@/app/contexts/ProjectContext';
import { TaskProvider } from '@/app/contexts/TaskContext';
import { SidebarProvider } from '@/app/components/Atomic/sidebar';

export default function ApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProjectProvider>
      <TaskProvider>
        <SidebarProvider>
          <div className="h-screen w-screen overflow-hidden bg-background">
            {children}
          </div>
        </SidebarProvider>
      </TaskProvider>
    </ProjectProvider>
  );
}
