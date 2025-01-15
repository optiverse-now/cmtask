import React, { useState, useEffect } from "react";
import { Button } from "@/app/components/Atomic/button";
import { Plus } from "lucide-react";
import { Badge } from "@/app/components/Atomic/badge";
import ProjectModal from "@/app/components/features/project/ProjectModal";
import { useTask } from "@/app/contexts/TaskContext";
import { SidebarFooter } from "@/app/components/Atomic/sidebar";
import { UserAccount } from "@/app/components/Molecules/UserAccount/UserAccount";
import { createClient } from '@/utils/supabase/client';

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

const LeftSidebar: React.FC<LeftSidebarProps> = ({
  projects,
  selectedProjectId,
  onProjectSelect,
  onAddProject,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getIncompleteTasksCount } = useTask();
  const [currentUser, setCurrentUser] = useState<CurrentUser>({
    name: '',
    email: '',
    image: ''
  });

  // 現在ログインしているユーザーを取得する処理
  const getCurrentUser = async () => {
    // ログインのセッションを取得する処理
    const { data } = await createClient().auth.getSession()
    // セッションがあるときだけ現在ログインしているユーザーを取得する
    if (data.session !== null) {
      // supabaseに用意されている現在ログインしているユーザーを取得する関数
      const { data: { user } } = await createClient().auth.getUser()
      // currentUserにユーザーのメールアドレスを格納
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

  // HeaderコンポーネントがレンダリングされたときにgetCurrentUser関数が実行される
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
