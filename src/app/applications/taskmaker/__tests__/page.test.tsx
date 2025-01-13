import { render, screen, fireEvent } from "@testing-library/react";
import TaskMakerPage from "../page";
import { useProject } from "@/app/contexts/ProjectContext";
import { useTask } from "@/app/contexts/TaskContext";

// モックの設定
jest.mock("@/app/contexts/ProjectContext");
jest.mock("@/app/contexts/TaskContext");
jest.mock("@/app/components/features/task/TaskBoard", () => ({
  __esModule: true,
  default: ({
    onAddTask,
    onEditTask,
    onCompleteProject,
  }: {
    onAddTask: () => void;
    onEditTask: (taskId: string) => void;
    onCompleteProject?: () => void;
  }) => (
    <div>
      <button onClick={onAddTask}>Add Task</button>
      <button onClick={() => onEditTask("test-task-id")}>Edit Task</button>
      {onCompleteProject && (
        <button onClick={onCompleteProject}>Complete Project</button>
      )}
    </div>
  ),
}));
jest.mock("@/app/components/features/task/CreateTaskModal", () => ({
  __esModule: true,
  default: ({ onClose }: { onClose: () => void }) => (
    <div>
      Create Task Modal
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));
jest.mock("@/app/components/features/task/TaskModal", () => ({
  __esModule: true,
  default: ({ onClose }: { onClose: () => void }) => (
    <div>
      Task Modal
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

describe("TaskMakerPage", () => {
  const mockUseProject = useProject as jest.Mock;
  const mockUseTask = useTask as jest.Mock;

  beforeEach(() => {
    mockUseProject.mockReset();
    mockUseTask.mockReset();
  });

  it("プロジェクトが選択されていない場合、メッセージを表示すること", () => {
    mockUseProject.mockReturnValue({
      selectedProjectId: null,
      getSelectedProject: () => null,
    });
    mockUseTask.mockReturnValue({
      selectedTaskId: null,
      moveTask: jest.fn(),
      selectTask: jest.fn(),
    });

    render(<TaskMakerPage />);
    expect(
      screen.getByText("プロジェクトを選択してください"),
    ).toBeInTheDocument();
  });

  it("プロジェクトが選択されている場合、TaskBoardを表示すること", () => {
    mockUseProject.mockReturnValue({
      selectedProjectId: "test-project-id",
      completeProject: jest.fn(),
      getSelectedProject: () => ({ id: "test-project-id", status: "進行中" }),
    });
    mockUseTask.mockReturnValue({
      selectedTaskId: null,
      moveTask: jest.fn(),
      selectTask: jest.fn(),
    });

    render(<TaskMakerPage />);
    expect(screen.getByText("Add Task")).toBeInTheDocument();
  });

  it("タスク追加ボタンをクリックすると、CreateTaskModalが表示されること", () => {
    const mockSelectTask = jest.fn();
    mockUseProject.mockReturnValue({
      selectedProjectId: "test-project-id",
      getSelectedProject: () => ({ id: "test-project-id", status: "進行中" }),
    });
    mockUseTask.mockReturnValue({
      selectedTaskId: null,
      moveTask: jest.fn(),
      selectTask: mockSelectTask,
    });

    render(<TaskMakerPage />);
    fireEvent.click(screen.getByText("Add Task"));
    expect(screen.getByText("Create Task Modal")).toBeInTheDocument();
    expect(mockSelectTask).toHaveBeenCalledWith(null);
  });

  it("タスク編集ボタンをクリックすると、TaskModalが表示されること", () => {
    const mockSelectTask = jest.fn();
    mockUseProject.mockReturnValue({
      selectedProjectId: "test-project-id",
      getSelectedProject: () => ({ id: "test-project-id", status: "進行中" }),
    });
    mockUseTask.mockReturnValue({
      selectedTaskId: "test-task-id",
      moveTask: jest.fn(),
      selectTask: mockSelectTask,
    });

    render(<TaskMakerPage />);
    fireEvent.click(screen.getByText("Edit Task"));
    expect(mockSelectTask).toHaveBeenCalledWith("test-task-id");
  });

  it("プロジェクトが進行中の場合、完了ボタンが表示されること", () => {
    const mockCompleteProject = jest.fn();
    mockUseProject.mockReturnValue({
      selectedProjectId: "test-project-id",
      completeProject: mockCompleteProject,
      getSelectedProject: () => ({ id: "test-project-id", status: "進行中" }),
    });
    mockUseTask.mockReturnValue({
      selectedTaskId: null,
      moveTask: jest.fn(),
      selectTask: jest.fn(),
    });

    render(<TaskMakerPage />);
    const completeButton = screen.getByText("Complete Project");
    expect(completeButton).toBeInTheDocument();
    fireEvent.click(completeButton);
    expect(mockCompleteProject).toHaveBeenCalledWith("test-project-id");
  });
});
