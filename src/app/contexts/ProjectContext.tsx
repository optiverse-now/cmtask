'use client';

import React, { createContext, useContext, useState } from 'react';
import { ProjectStatus } from '@/app/components/Organisms/Sidebar/LeftSidebar';
import { Task } from '@/app/types/task';

interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

interface ProjectContextType {
  projects: Project[];
  selectedProjectId: string | null;
  addProject: (name: string, description: string) => void;
  updateProject: (id: string, name: string) => void;
  deleteProject: (id: string) => void;
  selectProject: (id: string) => void;
  completeProject: (id: string) => void;
  getSelectedProject: () => Project | undefined;
  updateProjectStatus: (projectId: string, tasks: { [key: string]: Task }) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const addProject = (name: string, description: string) => {
    const now = new Date().toISOString();
    const newProject: Project = {
      id: `project-${projects.length + 1}`,
      name,
      description,
      status: '未着手',
      createdAt: now,
      updatedAt: now,
    };
    setProjects([...projects, newProject]);
  };

  const updateProject = (id: string, name: string) => {
    setProjects(
      projects.map((project) =>
        project.id === id
          ? { ...project, name, updatedAt: new Date().toISOString() }
          : project
      )
    );
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter((project) => project.id !== id));
    if (selectedProjectId === id) {
      setSelectedProjectId(null);
    }
  };

  const selectProject = (id: string) => {
    setSelectedProjectId(id);
  };

  const completeProject = (id: string) => {
    setProjects(
      projects.map((project) =>
        project.id === id
          ? { ...project, status: '完了', updatedAt: new Date().toISOString() }
          : project
      )
    );
  };

  const getSelectedProject = () => {
    return projects.find((project) => project.id === selectedProjectId);
  };

  const updateProjectStatus = (projectId: string, tasks: { [key: string]: Task }) => {
    const projectTasks = Object.values(tasks).filter(task => task.projectId === projectId);
    
    if (projectTasks.length === 0) {
      setProjects(projects.map(project =>
        project.id === projectId
          ? { ...project, status: '未着手', updatedAt: new Date().toISOString() }
          : project
      ));
      return;
    }

    const hasInProgressOrCompletedTasks = projectTasks.some(task => 
      task.status === '進行中' || task.status === '完了'
    );

    const allTasksNotStarted = projectTasks.every(task => task.status === '未着手');

    setProjects(projects.map(project =>
      project.id === projectId
        ? {
            ...project,
            status: hasInProgressOrCompletedTasks ? '進行中' : (allTasksNotStarted ? '未着手' : project.status),
            updatedAt: new Date().toISOString()
          }
        : project
    ));
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        selectedProjectId,
        addProject,
        updateProject,
        deleteProject,
        selectProject,
        completeProject,
        getSelectedProject,
        updateProjectStatus,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
} 