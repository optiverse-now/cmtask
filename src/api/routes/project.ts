import { Hono } from 'hono'
import { prisma } from '../lib/prisma'

const app = new Hono()

// プロジェクト一覧の取得
app.get('/', async (c) => {
  try {
    const authUserId = c.get('userId');
    const requestUserId = c.req.query('userId');

    if (!requestUserId || authUserId !== requestUserId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const projects = await prisma.project.findMany({
      where: {
        userId: authUserId
      },
      orderBy: { createdAt: 'desc' }
    })
    return c.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return c.json({ error: 'Failed to fetch projects' }, 500)
  }
})

// プロジェクトの作成
app.post('/', async (c) => {
  try {
    const authUserId = c.get('userId');
    const { name, description, userId } = await c.req.json();

    if (!userId || authUserId !== userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        status: '未着手',
        userId: authUserId
      }
    })
    return c.json(project, 201)
  } catch (error) {
    console.error('Error creating project:', error)
    return c.json({ error: 'Failed to create project' }, 500)
  }
})

// プロジェクトの更新
app.put('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const authUserId = c.get('userId')
    const { name, description, status, userId } = await c.req.json()

    if (!userId || authUserId !== userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    // プロジェクトの所有者確認
    const existingProject = await prisma.project.findFirst({
      where: { id, userId: authUserId }
    })
    
    if (!existingProject) {
      return c.json({ error: 'Project not found or unauthorized' }, 404)
    }
    
    const project = await prisma.project.update({
      where: { id },
      data: { name, description, status }
    })
    return c.json(project)
  } catch (error) {
    console.error('Error updating project:', error)
    return c.json({ error: 'Failed to update project' }, 500)
  }
})

// プロジェクトの削除
app.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const authUserId = c.get('userId')
    const requestUserId = c.req.query('userId')

    if (!requestUserId || authUserId !== requestUserId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    // プロジェクトの所有者確認
    const existingProject = await prisma.project.findFirst({
      where: { id, userId: authUserId }
    })
    
    if (!existingProject) {
      return c.json({ error: 'Project not found or unauthorized' }, 404)
    }
    
    await prisma.project.delete({
      where: { id }
    })
    return c.json({ success: true })
  } catch (error) {
    console.error('Error deleting project:', error)
    return c.json({ error: 'Failed to delete project' }, 500)
  }
})

export default app
