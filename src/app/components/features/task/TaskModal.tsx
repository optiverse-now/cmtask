'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/app/components/Atomic/dialog';
import { Button } from '@/app/components/Atomic/button';
import { Input } from '@/app/components/Atomic/input';
import { Textarea } from '@/app/components/Atomic/textarea';
import { useTask } from '@/app/contexts/TaskContext';
import { Calendar } from '@/app/components/Atomic/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/Atomic/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/Atomic/select';

interface TaskModalProps {
  taskId: string;
  onClose: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ taskId, onClose }) => {
  const { tasks, updateTask } = useTask();
  const task = tasks[taskId];

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignee, setAssignee] = useState('');
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [priority, setPriority] = useState<'低' | '中' | '高'>('中');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setAssignee(task.assignee?.name || '');
      setDueDate(new Date(task.dueDate));
      setPriority(task.priority);
    }
  }, [task]);

  if (!task) return null;

  const handleSave = () => {
    updateTask(taskId, title, description, assignee, dueDate, priority);
    setIsEditing(false);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>タスクの詳細</DialogTitle>
          <DialogDescription>
            タスクの詳細情報を表示・編集できます
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex justify-end">
            <Button
              variant={isEditing ? "outline" : "default"}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "キャンセル" : "編集"}
            </Button>
            {isEditing && (
              <Button className="ml-2" onClick={handleSave}>
                保存
              </Button>
            )}
          </div>
          <div className="grid gap-2">
            <label>タイトル</label>
            {isEditing ? (
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            ) : (
              <p>{task.title}</p>
            )}
          </div>
          <div className="grid gap-2">
            <label>説明</label>
            {isEditing ? (
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            ) : (
              <p>{task.description}</p>
            )}
          </div>
          <div className="grid gap-2">
            <label>担当者</label>
            {isEditing ? (
              <Input
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
              />
            ) : (
              <p>{task.assignee?.name}</p>
            )}
          </div>
          <div className="grid gap-2">
            <label>期限</label>
            {isEditing ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dueDate && "text-muted-foreground"
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
            ) : (
              <p>{format(new Date(task.dueDate), "PPP")}</p>
            )}
          </div>
          <div className="grid gap-2">
            <label>優先度</label>
            {isEditing ? (
              <Select
                value={priority}
                onValueChange={(value) => setPriority(value as '低' | '中' | '高')}
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
            ) : (
              <p>{task.priority}</p>
            )}
          </div>
          <div className="grid gap-2">
            <label>ステータス</label>
            <p>{task.status}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskModal; 