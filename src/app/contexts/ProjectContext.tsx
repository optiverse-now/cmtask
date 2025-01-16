'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, ProjectStatus } from '@/app/types/props';
import { APIClient } from '@/app/lib/api';

interface ProjectContextType {
  projects: Project[];
  selectedProjectId: string | null;
  addProject: (name: string, description: string) => Promise<void>;
  updateProject: (id: string, name: string, description: string, status: ProjectStatus) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  selectProject: (id: string) => void;
  completeProject: (id: string) => Promise<void>;
  getSelectedProject: () => Project | null;
  updateProjectStatus: (id: string, status: ProjectStatus) => Promise<void>;
  clearProjects: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const fetchedProjects = await APIClient.getProjects();
      setProjects(fetchedProjects);
    } catch (error) {
      console.error('プロジェクトの取得に失敗しました:', error);
    }
  };

  const addProject = async (name: string, description: string) => {
    try {
      const newProject = await APIClient.createProject(name, description);
      setProjects([...projects, newProject]);
      setSelectedProjectId(newProject.id);
    } catch (error) {
      console.error('プロジェクトの作成に失敗しました:', error);
      throw error;
    }
  };

  const updateProject = async (id: string, name: string, description: string, status: ProjectStatus) => {
    try {
      const updatedProject = await APIClient.updateProject(id, { name, description, status });
      setProjects(projects.map(p => p.id === id ? updatedProject : p));
    } catch (error) {
      console.error('プロジェクトの更新に失敗しました:', error);
      throw error;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await APIClient.deleteProject(id);
      setProjects(projects.filter(p => p.id !== id));
      if (selectedProjectId === id) {
        setSelectedProjectId(null);
      }
    } catch (error) {
      console.error('プロジェクトの削除に失敗しました:', error);
      throw error;
    }
  };

  const selectProject = (id: string) => {
    console.log('Selecting project:', id);
    setSelectedProjectId(id);
  };

  const completeProject = async (id: string) => {
    await updateProjectStatus(id, '完了');
  };

  const getSelectedProject = () => {
    const selected = projects.find(p => p.id === selectedProjectId) || null;
    console.log('Selected project:', selected);
    return selected;
  };

  const updateProjectStatus = async (id: string, status: ProjectStatus) => {
    try {
      const updatedProject = await APIClient.updateProject(id, { status });
      setProjects(projects.map(p => p.id === id ? updatedProject : p));
    } catch (error) {
      console.error('プロジェクトのステータス更新に失敗しました:', error);
      throw error;
    }
  };

  const clearProjects = () => {
    setProjects([]);
    setSelectedProjectId(null);
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
        clearProjects,
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