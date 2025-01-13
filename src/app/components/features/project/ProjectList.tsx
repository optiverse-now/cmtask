import React from "react";
import { Button } from "@/app/components/Atomic/button";
import { Badge } from "@/app/components/Atomic/badge";
import { Plus } from "lucide-react";
import { useTask } from "@/app/contexts/TaskContext";
import { ProjectListProps, ProjectListItemProps } from "@/types/project";
import { getStatusColor } from "@/utils/project";

const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  selectedProjectId,
  onProjectSelect,
  onAddProjectClick,
}) => {
  const { getIncompleteTasksCount } = useTask();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-lg font-semibold">プロジェクト</h2>
        <Button
          variant="outline"
          size="icon"
          onClick={onAddProjectClick}
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
          projects.map((project) => (
            <ProjectListItem
              key={project.id}
              project={project}
              isSelected={project.id === selectedProjectId}
              incompleteTasks={getIncompleteTasksCount(project.id)}
              onSelect={() => onProjectSelect(project.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

const ProjectListItem: React.FC<ProjectListItemProps> = ({
  project,
  isSelected,
  incompleteTasks,
  onSelect,
}) => (
  <button
    onClick={onSelect}
    className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
      isSelected ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
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

export default ProjectList;
