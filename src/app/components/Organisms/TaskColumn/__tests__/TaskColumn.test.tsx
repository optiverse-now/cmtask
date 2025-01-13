import { render, screen } from "@testing-library/react";
import { TaskColumn } from "../TaskColumn";
import { useDroppable } from "@dnd-kit/core";

// useDroppableのモック
jest.mock("@dnd-kit/core", () => ({
  useDroppable: jest.fn(),
}));

describe("TaskColumn", () => {
  beforeEach(() => {
    (useDroppable as jest.Mock).mockReturnValue({
      setNodeRef: jest.fn(),
      isOver: false,
    });
  });

  it("タイトルと子要素が正しくレンダリングされること", () => {
    render(
      <TaskColumn id="test-column" title="Test Column">
        <div>Test Task</div>
      </TaskColumn>,
    );

    expect(screen.getByText("Test Column")).toBeInTheDocument();
    expect(screen.getByText("Test Task")).toBeInTheDocument();
  });

  it("タイトルが適切なスタイルで表示されること", () => {
    render(
      <TaskColumn id="test-column" title="Test Column">
        <div>Test Task</div>
      </TaskColumn>,
    );

    const title = screen.getByText("Test Column");
    expect(title).toHaveClass("text-lg", "font-semibold", "mb-4");
  });

  it("子要素のコンテナが適切なスペーシングを持つこと", () => {
    render(
      <TaskColumn id="test-column" title="Test Column">
        <div>Test Task</div>
      </TaskColumn>,
    );

    const container = screen.getByText("Test Task").parentElement;
    expect(container).toHaveClass("space-y-2");
  });

  it("ドロップ可能な領域として正しく設定されること", () => {
    const mockSetNodeRef = jest.fn();
    (useDroppable as jest.Mock).mockReturnValue({
      setNodeRef: mockSetNodeRef,
      isOver: false,
    });

    render(
      <TaskColumn id="test-column" title="Test Column">
        <div>Test Task</div>
      </TaskColumn>,
    );

    expect(useDroppable).toHaveBeenCalledWith({
      id: "test-column",
      data: { type: "column" },
    });
  });

  it("ドロップ時のホバー状態が正しく表示されること", () => {
    (useDroppable as jest.Mock).mockReturnValue({
      setNodeRef: jest.fn(),
      isOver: true,
    });

    render(
      <TaskColumn id="test-column" title="Test Column">
        <div>Test Task</div>
      </TaskColumn>,
    );

    const column = screen.getByText("Test Column").closest(".p-4");
    expect(column).toHaveClass("bg-accent");
  });
});
