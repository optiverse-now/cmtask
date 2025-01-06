'use client';

import React, { useState } from 'react';
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
import { cn } from '@/app/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/Atomic/select';

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
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignee, setAssignee] = useState('');
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [priority, setPriority] = useState<'低' | '中' | '高'>('中');
  const [status, setStatus] = useState<'未着手' | '進行中' | '完了'>('未着手');

  const handleSubmit = () => {
    addTask(projectId, title, description, assignee, dueDate, priority);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setAssignee('');
    setDueDate(new Date());
    setPriority('中');
    setStatus('未着手');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>新規タスク作成</DialogTitle>
          <DialogDescription>
            新しいタスクを作成します
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label>タイトル</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="タスクのタイトル"
            />
          </div>
          <div className="grid gap-2">
            <label>説明</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="タスクの説明"
            />
          </div>
          <div className="grid gap-2">
            <label>担当者</label>
            <Input
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              placeholder="担当者名"
            />
          </div>
          <div className="grid gap-2">
            <label>期限</label>
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
          </div>
          <div className="grid gap-2">
            <label>優先度</label>
            <Select value={priority} onValueChange={(value) => setPriority(value as '低' | '中' | '高')}>
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
            <label>ステータス</label>
            <Select value={status} onValueChange={(value) => setStatus(value as '未着手' | '進行中' | '完了')}>
              <SelectTrigger>
                <SelectValue placeholder="ステータスを選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="未着手">未着手</SelectItem>
                <SelectItem value="進行中">進行中</SelectItem>
                <SelectItem value="完了">完了</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              キャンセル
            </Button>
            <Button onClick={handleSubmit}>
              作成
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskModal; 