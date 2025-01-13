import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateTaskModal from "../CreateTaskModal";
import { TaskProvider } from "@/app/contexts/TaskContext";
import { ProjectProvider } from "@/app/contexts/ProjectContext";

// TaskContextのモック
const mockAddTask = jest.fn();
jest.mock("@/app/contexts/TaskContext", () => ({
  ...jest.requireActual("@/app/contexts/TaskContext"),
  useTask: () => ({
    addTask: mockAddTask,
  }),
}));

describe("CreateTaskModal", () => {
  const mockOnClose = jest.fn();
  const mockProjectId = "project-1";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("モーダルが正しくレンダリングされること", () => {
    render(
      <ProjectProvider>
        <TaskProvider>
          <CreateTaskModal
            projectId={mockProjectId}
            isOpen={true}
            onClose={mockOnClose}
          />
        </TaskProvider>
      </ProjectProvider>,
    );

    expect(screen.getByText("新規タスク作成")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("タスク名を入力")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("タスクの説明を入力"),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("担当者を入力")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "作成" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "キャンセル" }),
    ).toBeInTheDocument();
  });

  it("フォームの入力と送信が正しく機能すること", async () => {
    render(
      <ProjectProvider>
        <TaskProvider>
          <CreateTaskModal
            projectId={mockProjectId}
            isOpen={true}
            onClose={mockOnClose}
          />
        </TaskProvider>
      </ProjectProvider>,
    );

    const titleInput = screen.getByPlaceholderText("タスク名を入力");
    const descriptionInput = screen.getByPlaceholderText("タスクの説明を入力");
    const assigneeInput = screen.getByPlaceholderText("担当者を入力");
    const submitButton = screen.getByRole("button", { name: "作成" });

    await userEvent.type(titleInput, "新しいタスク");
    await userEvent.type(descriptionInput, "タスクの説明");
    await userEvent.type(assigneeInput, "担当者名");

    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAddTask).toHaveBeenCalledWith(
        mockProjectId,
        "新しいタスク",
        "タスクの説明",
        "担当者名",
        expect.any(Date),
        "中",
      );
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("キャンセルボタンをクリックするとonCloseが呼ばれること", async () => {
    render(
      <ProjectProvider>
        <TaskProvider>
          <CreateTaskModal
            projectId={mockProjectId}
            isOpen={true}
            onClose={mockOnClose}
          />
        </TaskProvider>
      </ProjectProvider>,
    );

    const cancelButton = screen.getByRole("button", { name: "キャンセル" });
    await userEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("バリデーションエラーが正しく表示されること", async () => {
    render(
      <ProjectProvider>
        <TaskProvider>
          <CreateTaskModal
            projectId={mockProjectId}
            isOpen={true}
            onClose={mockOnClose}
          />
        </TaskProvider>
      </ProjectProvider>,
    );

    const submitButton = screen.getByRole("button", { name: "作成" });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getAllByText("必須項目です")).toHaveLength(3);
    });
    expect(mockAddTask).not.toHaveBeenCalled();
  });
});
