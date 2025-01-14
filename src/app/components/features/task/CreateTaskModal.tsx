"use client";

import React, { useState } from "react";
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

interface CreateTaskModalProps {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  projectId,
  isOpen,
  onClose,
}) => {
  const { addTask } = useTask();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState("");
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [priority, setPriority] = useState<"低" | "中" | "高">("中");
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    assignee?: string;
  }>({});

  const validateForm = () => {
    const newErrors: {
      title?: string;
      description?: string;
      assignee?: string;
    } = {};

    if (!title) newErrors.title = "必須項目です";
    if (!description) newErrors.description = "必須項目です";
    if (!assignee) newErrors.assignee = "必須項目です";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    addTask(projectId, title, description, assignee, dueDate, priority);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setAssignee("");
    setDueDate(new Date());
    setPriority("中");
    setErrors({});
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="タスク名を入力"
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>
          <div className="grid gap-2">
            <label>説明</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="タスクの説明を入力"
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>
          <div className="grid gap-2">
            <label>優先度</label>
            <Select
              value={priority}
              onValueChange={(value) =>
                setPriority(value as "低" | "中" | "高")
              }
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
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
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
                    !dueDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : <span>日付を選択</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={(date) => date && setDueDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              キャンセル
            </Button>
            <Button onClick={handleSubmit}>作成</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskModal;
