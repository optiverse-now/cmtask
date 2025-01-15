"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/app/components/Atomic/dialog";
import { Button } from "@/app/components/Atomic/button";
import { Input } from "@/app/components/Atomic/input";
import { Textarea } from "@/app/components/Atomic/textarea";
import { useTask } from "@/app/contexts/TaskContext";
import { Calendar } from "@/app/components/Atomic/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/Atomic/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/Atomic/select";
import { useTaskForm } from "@/app/hooks/useTaskForm";

interface TaskCreateModalProps {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
}

const TaskCreateModal: React.FC<TaskCreateModalProps> = ({
  projectId,
  isOpen,
  onClose,
}) => {
  const { addTask } = useTask();
  const { formState, errors, updateField, handleSubmit } = useTaskForm(addTask);

  const handleFormSubmit = () => {
    handleSubmit(projectId);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>新規タスク作成</DialogTitle>
          <DialogDescription>新しいタスクを作成します</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label>タイトル</label>
            <Input
              value={formState.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="タスク名を入力"
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>
          <div className="grid gap-2">
            <label>説明</label>
            <Textarea
              value={formState.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="タスクの説明を入力"
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>
          <div className="grid gap-2">
            <label>優先度</label>
            <Select
              value={formState.priority}
              onValueChange={(value) => updateField("priority", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="優先度を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="低">低</SelectItem>
                <SelectItem value="中">中</SelectItem>
                <SelectItem value="高">高</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <label>担当者</label>
            <Input
              value={formState.assignee}
              onChange={(e) => updateField("assignee", e.target.value)}
              placeholder="担当者を入力"
            />
            {errors.assignee && (
              <p className="text-sm text-red-500">{errors.assignee}</p>
            )}
          </div>
          <div className="grid gap-2">
            <label>期限</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formState.dueDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formState.dueDate ? (
                    format(formState.dueDate, "PPP")
                  ) : (
                    <span>日付を選択</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formState.dueDate}
                  onSelect={(date) => date && updateField("dueDate", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              キャンセル
            </Button>
            <Button onClick={handleFormSubmit}>作成</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskCreateModal;
