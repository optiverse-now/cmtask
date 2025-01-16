import { useDraggable, useDroppable } from "@dnd-kit/core";
import { Card } from "@/app/components/Atomic/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/Atomic/avatar";
import { Badge } from "@/app/components/Atomic/badge";
import { CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { TaskCardProps } from "@/app/types/props";
import Droppable from "@/app/components/Atomic/droppable";
import { CSSProperties } from "react";

export const TaskCard: React.FC<TaskCardProps> = ({
  id,
  title,
  description,
  assignee,
  dueDate,
  priority,
  onClick,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
    transform,
    isDragging,
  } = useDraggable({
    id,
    data: {
      type: "task",
    },
  });

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `task-${id}`,
    data: {
      type: 'task',
      id: id,
      isDropArea: true
    },
  });

  const getBadgeVariant = (priority: "高" | "中" | "低") => {
    switch (priority) {
      case "高":
        return "destructive";
      case "中":
        return "default";
      case "低":
        return "secondary";
      default:
        return "default";
    }
  };

  const style: CSSProperties | undefined = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 999 : undefined,
    position: isDragging ? 'absolute' as const : undefined,
    width: isDragging ? '300px' : undefined,
    pointerEvents: isDragging ? 'none' : undefined,
  } : undefined;

  return (
    <Droppable id={`task-${id}`}>
      <Card
        ref={(node) => {
          setDraggableRef(node);
          setDroppableRef(node);
        }}
        style={style}
        {...listeners}
        {...attributes}
        onClick={onClick}
        role="button"
        className={`
          cursor-pointer hover:shadow-md transition-shadow w-full
          ${isOver ? "border-t-2 border-blue-500" : ""}
          ${isDragging ? "shadow-lg opacity-90 bg-background" : ""}
        `}
      >
        <div className="p-4 space-y-4">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg">{title}</h3>
            <Badge variant={getBadgeVariant(priority)}>{priority}</Badge>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>

          <div className="flex justify-between items-center pt-2">
            {assignee && (
              <div className="flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={assignee.avatarUrl}
                    alt={assignee.name}
                    role="img"
                  />
                  <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">
                  {assignee.name}
                </span>
              </div>
            )}

            {dueDate && (
              <div className="flex items-center space-x-1 text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
                <span className="text-sm">
                  {format(new Date(dueDate), "MM/dd")}
                </span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Droppable>
  );
};
