"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import TaskBoard from '@/app/components/features/task/TaskBoard';
import CreateTaskModal from '@/app/components/features/task/CreateTaskModal';
import { useProject } from '@/app/contexts/ProjectContext';
import { useTask } from '@/app/contexts/TaskContext';
import TaskModal from '@/app/components/features/task/TaskModal';
import { DragEndEvent } from '@dnd-kit/core';
import LeftSidebar from '@/app/components/Organisms/Sidebar/LeftSidebar';

export default function TaskMakerPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { selectedProjectId, completeProject, getSelectedProject, projects, selectProject, addProject } = useProject();
  const { selectedTaskId, moveTask, selectTask } = useTask();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const selectedProject = getSelectedProject();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('セッション取得エラー:', error);
          router.replace('/auth/login');
          return;
        }

        if (!session) {
          console.warn('認証セッションが見つかりません');
          router.replace('/auth/login');
          return;
        }

        // アクセストークンの有効期限をチェック
        const tokenExpirationTime = new Date(session.expires_at || 0).getTime();
        const currentTime = new Date().getTime();
        
        if (tokenExpirationTime <= currentTime) {
          console.warn('セッションの有効期限が切れています');
          router.replace('/auth/login');
          return;
        }

        // セッションの有効性を確認
        const { data: { user }, error: userError } = await supabase.auth.getUser(session.access_token);
        
        if (userError || !user) {
          console.warn('無効なセッション:', userError);
          router.replace('/auth/login');
          return;
        }

        setIsLoading(false);
      } catch (error) {
        console.error('認証チェックエラー:', error);
        router.replace('/auth/login');
      }
    };

    // 初回認証チェック
    checkAuth();

    // セッションの変更を監視
    const {
      data: { subscription: authListener }
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        router.replace('/auth/login');
      } else if (event === 'TOKEN_REFRESHED') {
        // トークンが更新された場合は認証状態を再確認
        await checkAuth();
      }
    });

    // 定期的な認証状態の確認（5分ごと）
    const authCheckInterval = setInterval(checkAuth, 5 * 60 * 1000);

    return () => {
      authListener?.unsubscribe();
      clearInterval(authCheckInterval);
    };
  }, [router, supabase]);

  useEffect(() => {
    if (!selectedProjectId && projects.length > 0) {
      selectProject(projects[0].id);
    }
  }, [selectedProjectId, projects, selectProject]);

  const handleTaskMove = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    moveTask(
      active.id as string,
      active.data.current?.sortable?.containerId as string,
      over.id as string
    );
  };

  const handleAddTask = () => {
    if (!selectedProjectId) {
      alert('タスクを作成するプロジェクトを選択してください');
      return;
    }
    setIsTaskModalOpen(true);
    selectTask(null);
  };

  const handleEditTask = (taskId: string) => {
    selectTask(taskId);
  };

  if (isLoading) {
    return <div className="flex h-screen w-screen items-center justify-center">読み込み中...</div>;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <LeftSidebar
        projects={projects}
        selectedProjectId={selectedProjectId}
        onProjectSelect={selectProject}
        onAddProject={addProject}
      />
      <div className="flex-1 min-w-0 h-full overflow-hidden">
        <TaskBoard
          selectedProjectId={selectedProjectId}
          onTaskMove={handleTaskMove}
          onAddTask={handleAddTask}
          onEditTask={handleEditTask}
          onCompleteProject={selectedProject && selectedProject.status !== '完了' ? () => completeProject(selectedProject.id) : undefined}
          projectStatus={selectedProject?.status}
        />
        {!selectedTaskId && isTaskModalOpen && selectedProjectId && (
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
      </div>
    </div>
  );
}
