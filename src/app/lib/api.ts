import { Project, Task } from '@/app/types/props';
import { createClient } from '@/utils/supabase/client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export class APIClient {
  private static async fetchWithAuth(path: string, options: RequestInit = {}) {
    const supabase = createClient();
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      console.error('Session error:', sessionError);
      throw new Error('認証セッションの取得に失敗しました');
    }

    if (!session.access_token) {
      console.error('Access token is missing');
      throw new Error('アクセストークンが見つかりません');
    }

    try {
      const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
          ...options.headers,
        },
        credentials: 'include',
        mode: 'cors',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('API error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        throw new Error(`API error: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  }

  private static async getCurrentUserId(): Promise<string> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    return user.id;
  }

  // プロジェクト関連のAPI
  static async getProjects(): Promise<Project[]> {
    const userId = await this.getCurrentUserId();
    return this.fetchWithAuth(`/api/projects?userId=${userId}`);
  }

  static async createProject(name: string, description: string): Promise<Project> {
    const userId = await this.getCurrentUserId();
    return this.fetchWithAuth('/api/projects', {
      method: 'POST',
      body: JSON.stringify({ name, description, userId }),
    });
  }

  static async updateProject(id: string, data: Partial<Project>): Promise<Project> {
    const userId = await this.getCurrentUserId();
    return this.fetchWithAuth(`/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...data, userId }),
    });
  }

  static async deleteProject(id: string): Promise<void> {
    const userId = await this.getCurrentUserId();
    return this.fetchWithAuth(`/api/projects/${id}?userId=${userId}`, {
      method: 'DELETE',
    });
  }

  // タスク関連のAPI
  static async getProjectTasks(projectId: string): Promise<Task[]> {
    console.log('Fetching tasks for project:', projectId);
    return this.fetchWithAuth(`/api/tasks/project/${projectId}`);
  }

  static async createTask(data: {
    projectId: string;
    title: string;
    description: string;
    assignee: string;
    dueDate: Date;
    priority: string;
  }): Promise<Task> {
    return this.fetchWithAuth('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updateTask(id: string, data: Partial<Task>): Promise<Task> {
    return this.fetchWithAuth(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async deleteTask(id: string): Promise<void> {
    return this.fetchWithAuth(`/api/tasks/${id}`, {
      method: 'DELETE',
    });
  }
} 