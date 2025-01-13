import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskProvider, useTask } from "../TaskContext";

// ProjectContextのモック
const mockUpdateProjectStatus = jest.fn();
jest.mock("../ProjectContext", () => ({
  ...jest.requireActual("../ProjectContext"),
  useProject: () => ({
    projects: [],
    currentProject: null,
    selectedProjectId: null,
    addProject: jest.fn(),
    updateProject: jest.fn(),
    deleteProject: jest.fn(),
    selectProject: jest.fn(),
    completeProject: jest.fn(),
    getSelectedProject: jest.fn(),
    updateProjectStatus: mockUpdateProjectStatus,
  }),
}));

// テスト用のコンポーネント
const TestComponent = () => {
  const {
    tasks,
    selectedTaskId,
    addTask,
    updateTask,
    deleteTask,
    selectTask,
    getIncompleteTasksCount,
  } = useTask();

  return (
    <div>
      <button
        onClick={() =>
          addTask(
            "project-1",
            "テストタスク",
            "説明",
            "担当者",
            new Date("2024-01-20"),
            "中",
          )
        }
      >
        タスク追加
      </button>
      <button
        onClick={() =>
          updateTask(
            "task-1",
            "更新タスク",
            "更新説明",
            "新担当者",
            new Date("2024-01-21"),
            "高",
          )
        }
      >
        タスク更新
      </button>
      <button onClick={() => deleteTask("task-1")}>タスク削除</button>
      <button onClick={() => selectTask("task-1")}>タスク選択</button>
      <div data-testid="tasks-count">{Object.keys(tasks).length}</div>
      <div data-testid="selected-task">{selectedTaskId}</div>
      <div data-testid="incomplete-tasks">
        {getIncompleteTasksCount("project-1")}
      </div>
      {Object.values(tasks).map((task) => (
        <div key={task.id} data-testid={`task-${task.id}`}>
          {task.title} - {task.status} - {task.priority}
        </div>
      ))}
    </div>
  );
};

describe("TaskContext", () => {
  const renderWithProvider = () => {
    return render(
      <TaskProvider>
        <TestComponent />
      </TaskProvider>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("初期状態が正しいこと", () => {
    renderWithProvider();
    expect(screen.getByTestId("tasks-count").textContent).toBe("0");
    expect(screen.getByTestId("selected-task").textContent).toBe("");
    expect(screen.getByTestId("incomplete-tasks").textContent).toBe("0");
  });

  it("タスクを追加できること", async () => {
    renderWithProvider();
    const addButton = screen.getByText("タスク追加");
    await userEvent.click(addButton);

    expect(screen.getByTestId("tasks-count").textContent).toBe("1");
    expect(screen.getByText(/テストタスク/)).toBeInTheDocument();
  });

  it("タスクを選択できること", async () => {
    renderWithProvider();

    // タスクを追加
    await userEvent.click(screen.getByText("タスク追加"));

    // タスクを選択
    await userEvent.click(screen.getByText("タスク選択"));

    const selectedTask = screen.getByTestId("selected-task");
    expect(selectedTask.textContent).toBe("task-1");
  });

  it("タスクを更新できること", async () => {
    renderWithProvider();

    // タスクを追加
    await userEvent.click(screen.getByText("タスク追加"));

    // タスクを更新
    await userEvent.click(screen.getByText("タスク更新"));

    expect(screen.getByText(/更新タスク/)).toBeInTheDocument();
    expect(screen.getByText(/高/)).toBeInTheDocument();
  });

  it("タスクを削除できること", async () => {
    renderWithProvider();

    // タスクを追加
    await userEvent.click(screen.getByText("タスク追加"));
    expect(screen.getByTestId("tasks-count").textContent).toBe("1");

    // タスクを削除
    await userEvent.click(screen.getByText("タスク削除"));
    expect(screen.getByTestId("tasks-count").textContent).toBe("0");
  });

  it("未完了タスクの数を正しくカウントできること", async () => {
    renderWithProvider();

    // タスクを追加
    await userEvent.click(screen.getByText("タスク追加"));

    expect(screen.getByTestId("incomplete-tasks").textContent).toBe("1");
  });

  it("タスクの状態が正しく更新されること", async () => {
    renderWithProvider();

    // タスクを追加
    await act(async () => {
      await userEvent.click(screen.getByText("タスク追加"));
    });

    // タスクの状態を確認
    const task = screen.getByTestId("task-task-1");
    expect(task).toHaveTextContent("テストタスク");
    expect(task).toHaveTextContent("未着手");
    expect(task).toHaveTextContent("中");

    // タスクを更新
    await act(async () => {
      await userEvent.click(screen.getByText("タスク更新"));
    });

    // 更新後の状態を確認
    expect(task).toHaveTextContent("更新タスク");
    expect(task).toHaveTextContent("高");
  });
});
