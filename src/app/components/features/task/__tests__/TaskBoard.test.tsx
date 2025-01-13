import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskBoard from "../TaskBoard";
import { TaskProvider } from "@/app/contexts/TaskContext";
import { ProjectProvider } from "@/app/contexts/ProjectContext";

// TaskContextのモック
const mockTasks = {
  "task-1": {
    id: "task-1",
    projectId: "project-1",
    title: "テストタスク1",
    description: "説明1",
    status: "未着手" as const,
    assignee: { name: "担当者1" },
    dueDate: new Date().toISOString(),
    priority: "中" as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

const mockColumns = {
  "column-1": {
    id: "column-1",
    title: "未着手",
    taskIds: ["task-1"],
  },
};

jest.mock("@/app/contexts/TaskContext", () => ({
  ...jest.requireActual("@/app/contexts/TaskContext"),
  useTask: () => ({
    tasks: mockTasks,
    columns: mockColumns,
    columnOrder: ["column-1"],
    selectedTaskId: null,
    moveTask: jest.fn(),
    selectTask: jest.fn(),
  }),
}));

// DndContextのモック
jest.mock("@dnd-kit/core", () => ({
  ...jest.requireActual("@dnd-kit/core"),
  DndContext: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useSensor: jest.fn(),
  useSensors: jest.fn(),
  PointerSensor: jest.fn(),
  closestCorners: jest.fn(),
}));

describe("TaskBoard", () => {
  const mockOnAddTask = jest.fn();
  const mockOnTaskMove = jest.fn();
  const mockOnEditTask = jest.fn();
  const mockOnCompleteProject = jest.fn();

  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <ProjectProvider>
        <TaskProvider>{ui}</TaskProvider>
      </ProjectProvider>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("プロジェクトが選択されていない場合、適切なメッセージが表示されること", () => {
    renderWithProviders(
      <TaskBoard
        selectedProjectId={null}
        onAddTask={mockOnAddTask}
        onTaskMove={mockOnTaskMove}
        onEditTask={mockOnEditTask}
      />,
    );

    expect(
      screen.getByText("プロジェクトを選択してタスクを表示"),
    ).toBeInTheDocument();
  });

  it("プロジェクトが選択されている場合、タスクボードが表示されること", () => {
    renderWithProviders(
      <TaskBoard
        selectedProjectId="project-1"
        onAddTask={mockOnAddTask}
        onTaskMove={mockOnTaskMove}
        onEditTask={mockOnEditTask}
      />,
    );

    expect(screen.getByText("タスクボード")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /新規タスク/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("テストタスク1")).toBeInTheDocument();
  });

  it("新規タスクボタンをクリックするとonAddTaskが呼ばれること", async () => {
    renderWithProviders(
      <TaskBoard
        selectedProjectId="project-1"
        onAddTask={mockOnAddTask}
        onTaskMove={mockOnTaskMove}
        onEditTask={mockOnEditTask}
      />,
    );

    const addButton = screen.getByRole("button", { name: /新規タスク/i });
    await userEvent.click(addButton);

    expect(mockOnAddTask).toHaveBeenCalled();
  });

  it("プロジェクトが完了状態でない場合、完了ボタンが表示されること", () => {
    renderWithProviders(
      <TaskBoard
        selectedProjectId="project-1"
        onAddTask={mockOnAddTask}
        onTaskMove={mockOnTaskMove}
        onEditTask={mockOnEditTask}
        onCompleteProject={mockOnCompleteProject}
        projectStatus="進行中"
      />,
    );

    expect(
      screen.getByRole("button", { name: /完了にする/i }),
    ).toBeInTheDocument();
  });

  it("プロジェクトが完了状態の場合、完了ボタンが表示されないこと", () => {
    renderWithProviders(
      <TaskBoard
        selectedProjectId="project-1"
        onAddTask={mockOnAddTask}
        onTaskMove={mockOnTaskMove}
        onEditTask={mockOnEditTask}
        projectStatus="完了"
      />,
    );

    expect(
      screen.queryByRole("button", { name: /完了にする/i }),
    ).not.toBeInTheDocument();
  });

  it("完了ボタンをクリックするとonCompleteProjectが呼ばれること", async () => {
    renderWithProviders(
      <TaskBoard
        selectedProjectId="project-1"
        onAddTask={mockOnAddTask}
        onTaskMove={mockOnTaskMove}
        onEditTask={mockOnEditTask}
        onCompleteProject={mockOnCompleteProject}
        projectStatus="進行中"
      />,
    );

    const completeButton = screen.getByRole("button", { name: /完了にする/i });
    await userEvent.click(completeButton);

    expect(mockOnCompleteProject).toHaveBeenCalled();
  });
});
