import React, { useState, useEffect } from "react";
import { Button } from "@/app/components/Atomic/button";
import { Plus } from "lucide-react";
import { Badge } from "@/app/components/Atomic/badge";
import ProjectModal from "@/app/components/features/project/ProjectModal";
import { useTask } from "@/app/contexts/TaskContext";
import { SidebarFooter } from "@/app/components/Atomic/sidebar";
import { UserAccount } from "@/app/components/Molecules/UserAccount/UserAccount";
import { createClient } from '@/utils/supabase/client';
import { useProject } from "@/app/contexts/ProjectContext";
import { Task } from "@/app/types/props";

export type ProjectStatus = "未着手" | "進行中" | "完了";

interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
}

interface CurrentUser {
  name: string;
  email: string;
  image?: string;
}

interface LeftSidebarProps {
  projects: Project[];
  selectedProjectId: string | null;
  onProjectSelect: (projectId: string) => void;
  onAddProject: (name: string, description: string) => void;
}

const getStatusColor = (status: ProjectStatus) => {
  switch (status) {
    case "未着手":
      return "bg-gray-500";
    case "進行中":
      return "bg-blue-500";
    case "完了":
      return "bg-green-500";
  }
};

const calculateProjectStatus = (tasks: Task[]): ProjectStatus => {
  // タスクが存在しない場合は未着手
  if (tasks.length === 0) {
    return "未着手";
  }

  // すべてのタスクが完了の場合
  const allTasksCompleted = tasks.every(task => task.status === "完了");
  if (allTasksCompleted) {
    return "完了";
  }

  // 進行中のタスクが1つでもある場合は進行中
  const hasInProgress = tasks.some(task => task.status === "進行中");
  if (hasInProgress) {
    return "進行中";
  }

  // 未着手と完了が混在している場合は進行中
  const hasNotStarted = tasks.some(task => task.status === "未着手");
  const hasCompleted = tasks.some(task => task.status === "完了");
  if (hasNotStarted && hasCompleted) {
    return "進行中";
  }

  // すべてのタスクが未着手の場合
  if (tasks.every(task => task.status === "未着手")) {
    return "未着手";
  }

  // デフォルトは進行中
  return "進行中";
};

const LeftSidebar: React.FC<LeftSidebarProps> = ({
  projects,
  selectedProjectId,
  onProjectSelect,
  onAddProject,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { tasks, getIncompleteTasksCount } = useTask();
  const { updateProjectStatus } = useProject();
  const [currentUser, setCurrentUser] = useState<CurrentUser>({
    name: '',
    email: '',
    image: ''
  });

  // プロジェクトのステータスを更新する
  useEffect(() => {
    const updateStatus = async () => {
      if (selectedProjectId) {
        const currentProject = projects.find(p => p.id === selectedProjectId);
        if (!currentProject) return;

        // プロジェクトに属するタスクを配列として取得
        const projectTasks = Object.values(tasks).filter(
          task => task.projectId === selectedProjectId
        );

        // 新しいステータスを計算
        const newStatus = calculateProjectStatus(projectTasks);
        
        // ステータスが変更された場合のみ更新を行う
        if (currentProject.status !== newStatus) {
          console.log('Updating project status:', {
            projectId: selectedProjectId,
            oldStatus: currentProject.status,
            newStatus,
            tasks: projectTasks.map(t => ({ id: t.id, status: t.status }))
          });
          await updateProjectStatus(selectedProjectId, newStatus);
        }
      }
    };
    updateStatus();
  }, [selectedProjectId, tasks, projects, updateProjectStatus]);

  // 現在ログインしているユーザーを取得する処理
  const getCurrentUser = async () => {
    const { data } = await createClient().auth.getSession()
    if (data.session !== null) {
      const { data: { user } } = await createClient().auth.getUser()
      setCurrentUser({
        name: user?.email?.split('@')[0] ?? 'ユーザー',
        email: user?.email ?? '',
        image: user?.user_metadata?.avatar_url
      })
    }
  }

  const handleAddProject = (data: { name: string; description: string }) => {
    onAddProject(data.name, data.description);
    setIsModalOpen(false);
  };

  useEffect(() => {
    getCurrentUser()
  }, [])

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-lg font-semibold">プロジェクト</h2>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsModalOpen(true)}
          className="h-8 w-8"
          aria-label="新規プロジェクト"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-auto p-2">
        {projects.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            プロジェクトがありません
          </p>
        ) : (
          projects.map((project) => {
            const incompleteTasks = getIncompleteTasksCount(project.id);
            return (
              <button
                key={project.id}
                onClick={() => onProjectSelect(project.id)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  project.id === selectedProjectId
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{project.name}</span>
                    {incompleteTasks > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {incompleteTasks}
                      </Badge>
                    )}
                  </div>
                  <Badge
                    variant="secondary"
                    className={`${getStatusColor(project.status)} text-white shrink-0`}
                  >
                    {project.status}
                  </Badge>
                </div>
              </button>
            );
          })
        )}
      </div>
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddProject}
        mode="create"
      />
      <SidebarFooter>
        <UserAccount user={currentUser} />
      </SidebarFooter>
    </div>
  );
};

export default LeftSidebar;
