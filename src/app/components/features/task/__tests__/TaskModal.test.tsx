import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskModal from "../TaskModal";
import { TaskProvider } from "@/app/contexts/TaskContext";
import { ProjectProvider } from "@/app/contexts/ProjectContext";

// モックデータ
const mockTask = {
  id: "task-1",
  projectId: "project-1",
  title: "テストタスク",
  description: "これはテストタスクの説明です",
  status: "未着手" as const,
  assignee: {
    name: "テストユーザー",
  },
  dueDate: new Date("2024-01-20").toISOString(),
  priority: "中" as const,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// ProjectContextのモック
const mockProject = {
  id: "project-1",
  name: "テストプロジェクト",
  description: "テストプロジェクトの説明",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

jest.mock("@/app/contexts/ProjectContext", () => ({
  ...jest.requireActual("@/app/contexts/ProjectContext"),
  useProject: () => ({
    projects: {
      "project-1": mockProject,
    },
    currentProject: mockProject,
  }),
}));

// TaskContextのモック
const mockUpdateTask = jest.fn();
jest.mock("@/app/contexts/TaskContext", () => ({
  ...jest.requireActual("@/app/contexts/TaskContext"),
  useTask: () => ({
    tasks: {
      "task-1": mockTask,
    },
    updateTask: mockUpdateTask,
  }),
}));

describe("TaskModal", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("タスクの詳細が正しく表示されること", () => {
    render(
      <ProjectProvider>
        <TaskProvider>
          <TaskModal taskId="task-1" onClose={mockOnClose} />
        </TaskProvider>
      </ProjectProvider>,
    );

    expect(screen.getByText("タスクの詳細")).toBeInTheDocument();
    expect(screen.getByText(mockTask.title)).toBeInTheDocument();
    expect(screen.getByText(mockTask.description)).toBeInTheDocument();
    expect(screen.getByText(mockTask.assignee.name)).toBeInTheDocument();
    expect(screen.getByText(mockTask.priority)).toBeInTheDocument();
    expect(screen.getByText(mockTask.status)).toBeInTheDocument();
  });

  it("編集モードに切り替わること", async () => {
    render(
      <ProjectProvider>
        <TaskProvider>
          <TaskModal taskId="task-1" onClose={mockOnClose} />
        </TaskProvider>
      </ProjectProvider>,
    );

    const editButton = screen.getByRole("button", { name: "編集" });
    await userEvent.click(editButton);

    expect(screen.getByDisplayValue(mockTask.title)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockTask.description)).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(mockTask.assignee.name),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "保存" })).toBeInTheDocument();
  });

  it("タスクの更新が正しく機能すること", async () => {
    render(
      <ProjectProvider>
        <TaskProvider>
          <TaskModal taskId="task-1" onClose={mockOnClose} />
        </TaskProvider>
      </ProjectProvider>,
    );

    // 編集モードに切り替え
    const editButton = screen.getByRole("button", { name: "編集" });
    await userEvent.click(editButton);

    // フィールドを更新
    const titleInput = screen.getByDisplayValue(mockTask.title);
    const descriptionInput = screen.getByDisplayValue(mockTask.description);
    const assigneeInput = screen.getByDisplayValue(mockTask.assignee.name);

    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, "更新されたタスク");
    await userEvent.clear(descriptionInput);
    await userEvent.type(descriptionInput, "更新された説明");
    await userEvent.clear(assigneeInput);
    await userEvent.type(assigneeInput, "新しい担当者");

    // 保存
    const saveButton = screen.getByRole("button", { name: "保存" });
    await userEvent.click(saveButton);

    await waitFor(() => {
      expect(mockUpdateTask).toHaveBeenCalledWith(
        "task-1",
        "更新されたタスク",
        "更新された説明",
        "新しい担当者",
        expect.any(Date),
        "中",
      );
    });
  });

  it("キャンセルボタンで編集モードが解除されること", async () => {
    render(
      <ProjectProvider>
        <TaskProvider>
          <TaskModal taskId="task-1" onClose={mockOnClose} />
        </TaskProvider>
      </ProjectProvider>,
    );

    // 編集モードに切り替え
    const editButton = screen.getByRole("button", { name: "編集" });
    await userEvent.click(editButton);

    // キャンセルボタンをクリック
    const cancelButton = screen.getByRole("button", { name: "キャンセル" });
    await userEvent.click(cancelButton);

    // 表示モードに戻っていることを確認
    expect(screen.getByRole("button", { name: "編集" })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "保存" }),
    ).not.toBeInTheDocument();
  });

  it("モーダルを閉じる際にonCloseが呼ばれること", async () => {
    render(
      <ProjectProvider>
        <TaskProvider>
          <TaskModal taskId="task-1" onClose={mockOnClose} />
        </TaskProvider>
      </ProjectProvider>,
    );

    const closeButton = screen.getByRole("button", { name: "Close" });
    await userEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });
});
