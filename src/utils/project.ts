import { ProjectStatus } from "@/types/project";

export const getStatusColor = (status: ProjectStatus): string => {
  const colors: Record<ProjectStatus, string> = {
    未着手: "bg-gray-500",
    進行中: "bg-blue-500",
    完了: "bg-green-500",
  };
  return colors[status];
};
