import { Hono } from 'hono'
import { prisma } from '../lib/prisma'
import type { Prisma } from '@prisma/client'

const app = new Hono()
// プロジェクトに紐づくタスク一覧の取得
app.get('/project/:projectId', async (c) => {
  try {
    const projectId = c.req.param('projectId')
    console.log('Fetching tasks for project:', projectId)
    const tasks = await prisma.task.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' }
    })
    console.log('Found tasks:', tasks)
    return c.json(tasks)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return c.json({ error: 'Failed to fetch tasks' }, 500)
  }
})

// タスクの作成
app.post('/', async (c) => {
  try {
    const { projectId, title, description, assignee, dueDate, priority } = await c.req.json()
    const taskData: Prisma.TaskUncheckedCreateInput = {
      projectId,
      title,
      description,
      status: '未着手',
      assigneeName: assignee,
      dueDate: new Date(dueDate),
      priority,
      userId: c.get('userId')
    }
    const task = await prisma.task.create({ data: taskData })
    return c.json(task, 201)
  } catch (error) {
    console.error('Error creating task:', error)
    return c.json({ error: 'Failed to create task' }, 500)
  }
})

// タスクの更新
app.put('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const updates = await c.req.json()
    
    // 既存のタスクを取得
    const existingTask = await prisma.task.findUnique({
      where: { id }
    })
    
    if (!existingTask) {
      return c.json({ error: 'Task not found' }, 404)
    }

    // 更新データを準備（既存の値を保持しつつ、新しい値で上書き）
    const taskData: Prisma.TaskUncheckedUpdateInput = {
      ...existingTask,
      ...updates,
      // dueDateが提供された場合のみ更新
      ...(updates.dueDate && { dueDate: new Date(updates.dueDate) })
    }

    const task = await prisma.task.update({
      where: { id },
      data: taskData
    })
    return c.json(task)
  } catch (error) {
    console.error('Error updating task:', error)
    return c.json({ error: 'Failed to update task' }, 500)
  }
})

// タスクの削除
app.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    await prisma.task.delete({
      where: { id }
    })
    return c.json({ success: true })
  } catch (error) {
    console.error('Error deleting task:', error)
    return c.json({ error: 'Failed to delete task' }, 500)
  }
})

export default app
