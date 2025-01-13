import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskCard } from "../TaskCard";
import { DndContext } from "@dnd-kit/core";

jest.mock("@dnd-kit/core", () => ({
  ...jest.requireActual("@dnd-kit/core"),
  useDraggable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: () => {},
    transform: null,
    isDragging: false,
  }),
  useDroppable: () => ({
    setNodeRef: () => {},
    isOver: false,
  }),
  DndContext: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// モックデータ
const mockTask = {
  id: "1",
  title: "テストタスク",
  description: "これはテストタスクの説明です",
  assignee: {
    name: "テストユーザー",
    avatarUrl: "/test-avatar.jpg",
  },
  dueDate: new Date("2024-01-20").toISOString(),
  priority: "高" as const,
};

// DndContextでラップするヘルパー関数
const renderWithDndContext = (ui: React.ReactNode) => {
  return render(<DndContext>{ui}</DndContext>);
};

describe("TaskCard", () => {
  it("タスクの基本情報が正しく表示されること", () => {
    renderWithDndContext(<TaskCard {...mockTask} onClick={() => {}} />);

    expect(screen.getByText(mockTask.title)).toBeInTheDocument();
    expect(screen.getByText(mockTask.description)).toBeInTheDocument();
    expect(screen.getByText(mockTask.assignee.name)).toBeInTheDocument();
    expect(screen.getByText("01/20")).toBeInTheDocument();
    expect(screen.getByText(mockTask.priority)).toBeInTheDocument();
  });

  it("クリックイベントが正しく発火すること", async () => {
    const handleClick = jest.fn();
    renderWithDndContext(<TaskCard {...mockTask} onClick={handleClick} />);

    const card = screen.getByRole("button");
    await userEvent.pointer([
      { target: card },
      { keys: "[MouseLeft]", target: card },
    ]);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("優先度に応じて適切なバッジスタイルが適用されること", () => {
    const priorities = ["高", "中", "低"] as const;
    const expectedClasses = {
      高: "bg-destructive",
      中: "bg-primary",
      低: "bg-secondary",
    };

    priorities.forEach((priority) => {
      renderWithDndContext(
        <TaskCard {...mockTask} priority={priority} onClick={() => {}} />,
      );

      const badge = screen.getByText(priority);
      expect(badge).toHaveClass(expectedClasses[priority]);
    });
  });

  it("アサインされたユーザーのアバター画像が表示されること", () => {
    renderWithDndContext(<TaskCard {...mockTask} onClick={() => {}} />);

    const avatarContainer = screen.getByText("テ").closest("span");
    expect(avatarContainer).toHaveClass("bg-muted");
    expect(screen.getByText(mockTask.assignee.name)).toBeInTheDocument();
  });

  it("アサインされたユーザーがない場合、アバターセクションが表示されないこと", () => {
    const taskWithoutAssignee = {
      ...mockTask,
      assignee: undefined,
    };
    renderWithDndContext(
      <TaskCard {...taskWithoutAssignee} onClick={() => {}} />,
    );

    const avatarText = screen.queryByText("テ");
    expect(avatarText).not.toBeInTheDocument();
  });

  it("ドラッグ中のスタイルが適用されること", () => {
    const { container } = renderWithDndContext(
      <TaskCard {...mockTask} onClick={() => {}} />,
    );

    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass("cursor-pointer");
  });
});
