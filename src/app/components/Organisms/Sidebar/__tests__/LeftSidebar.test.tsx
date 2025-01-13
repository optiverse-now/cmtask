import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LeftSidebar from "../LeftSidebar";
import * as TaskContext from "@/app/contexts/TaskContext";
import * as ProjectContext from "@/app/contexts/ProjectContext";

// モックデータ
const mockProjects = [
  {
    id: "project-1",
    name: "プロジェクト1",
    description: "プロジェクト1の説明",
    status: "進行中" as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "project-2",
    name: "プロジェクト2",
    description: "プロジェクト2の説明",
    status: "完了" as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// TaskContextのモック
const mockTasks = {
  "task-1": {
    id: "task-1",
    projectId: "project-1",
    title: "タスク1",
    description: "タスク1の説明",
    status: "未着手" as const,
    priority: "中" as const,
    dueDate: new Date().toISOString(),
    assignee: { name: "テストユーザー" },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

// コンテキストのモック
jest.spyOn(TaskContext, "useTask").mockImplementation(() => ({
  tasks: mockTasks,
  getTasksByProjectId: () => Object.values(mockTasks),
  addTask: jest.fn(),
  updateTask: jest.fn(),
  deleteTask: jest.fn(),
  columns: {
    "column-1": { id: "column-1", title: "未着手", taskIds: ["task-1"] },
  },
  columnOrder: ["column-1"],
  selectedTaskId: null,
  selectTask: jest.fn(),
  moveTask: jest.fn(),
  getIncompleteTasksCount: jest.fn().mockReturnValue(1),
}));

jest.spyOn(ProjectContext, "useProject").mockImplementation(() => ({
  projects: mockProjects,
  currentProject: mockProjects[0],
  addProject: jest.fn(),
  updateProject: jest.fn(),
  deleteProject: jest.fn(),
  selectProject: jest.fn(),
  selectedProjectId: null,
  completeProject: jest.fn(),
  getSelectedProject: jest.fn().mockReturnValue(mockProjects[0]),
  updateProjectStatus: jest.fn(),
}));

describe("LeftSidebar", () => {
  const mockOnProjectSelect = jest.fn();
  const mockOnAddProject = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("プロジェクトリストが正しく表示されること", () => {
    render(
      <LeftSidebar
        projects={mockProjects}
        selectedProjectId={null}
        onProjectSelect={mockOnProjectSelect}
        onAddProject={mockOnAddProject}
      />,
    );

    expect(screen.getByText("プロジェクト1")).toBeInTheDocument();
    expect(screen.getByText("プロジェクト2")).toBeInTheDocument();
  });

  it("プロジェクトを選択するとonProjectSelectが呼ばれること", async () => {
    render(
      <LeftSidebar
        projects={mockProjects}
        selectedProjectId={null}
        onProjectSelect={mockOnProjectSelect}
        onAddProject={mockOnAddProject}
      />,
    );

    const projectButton = screen.getByText("プロジェクト1");
    await userEvent.click(projectButton);

    expect(mockOnProjectSelect).toHaveBeenCalledWith("project-1");
  });

  it("選択中のプロジェクトが強調表示されること", () => {
    render(
      <LeftSidebar
        projects={mockProjects}
        selectedProjectId="project-1"
        onProjectSelect={mockOnProjectSelect}
        onAddProject={mockOnAddProject}
      />,
    );

    const selectedProject = screen.getByText("プロジェクト1").closest("button");
    expect(selectedProject).toHaveClass("bg-accent");
  });

  it("新規プロジェクトボタンをクリックするとonAddProjectが呼ばれること", async () => {
    render(
      <LeftSidebar
        projects={mockProjects}
        selectedProjectId={null}
        onProjectSelect={mockOnProjectSelect}
        onAddProject={mockOnAddProject}
      />,
    );

    const addButton = screen.getByRole("button", { name: /新規プロジェクト/i });
    await userEvent.click(addButton);

    expect(mockOnAddProject).toHaveBeenCalled();
  });

  it("プロジェクトのステータスに応じて適切なアイコンが表示されること", () => {
    render(
      <LeftSidebar
        projects={mockProjects}
        selectedProjectId={null}
        onProjectSelect={mockOnProjectSelect}
        onAddProject={mockOnAddProject}
      />,
    );

    const inProgressProject = screen
      .getByText("プロジェクト1")
      .closest("button");
    const completedProject = screen
      .getByText("プロジェクト2")
      .closest("button");

    expect(inProgressProject).toBeInTheDocument();
    expect(completedProject).toBeInTheDocument();
  });

  it("プロジェクトが空の場合、適切なメッセージが表示されること", () => {
    render(
      <LeftSidebar
        projects={[]}
        selectedProjectId={null}
        onProjectSelect={mockOnProjectSelect}
        onAddProject={mockOnAddProject}
      />,
    );

    expect(screen.getByText("プロジェクトがありません")).toBeInTheDocument();
  });
});
