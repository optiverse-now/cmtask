export type ProjectStatus = "未着手" | "進行中" | "完了";

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
}

export interface ProjectListProps {
  projects: Project[];
  selectedProjectId: string | null;
  onProjectSelect: (projectId: string) => void;
  onAddProjectClick: () => void;
}

export interface ProjectListItemProps {
  project: Project;
  isSelected: boolean;
  incompleteTasks: number;
  onSelect: () => void;
}
