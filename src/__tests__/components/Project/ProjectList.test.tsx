import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProjectList from "@/app/components/features/project/ProjectList";
import { useTask } from "@/app/contexts/TaskContext";
import { PROJECT_MESSAGES } from "@/constants/messages";

// TaskContextのモック
jest.mock("@/app/contexts/TaskContext", () => ({
  useTask: jest.fn(),
}));

describe("ProjectList", () => {
  const mockProjects = [
    {
      id: "1",
      name: "プロジェクト1",
      description: "説明1",
      status: "進行中" as const,
    },
    {
      id: "2",
      name: "プロジェクト2",
      description: "説明2",
      status: "未着手" as const,
    },
  ];

  const mockProps = {
    projects: mockProjects,
    selectedProjectId: "1",
    onProjectSelect: jest.fn(),
    onAddProjectClick: jest.fn(),
  };

  beforeEach(() => {
    (useTask as jest.Mock).mockReturnValue({
      getIncompleteTasksCount: jest.fn().mockReturnValue(2),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("プロジェクトリストが正しくレンダリングされる", () => {
    render(<ProjectList {...mockProps} />);

    expect(screen.getByText(PROJECT_MESSAGES.TITLE)).toBeInTheDocument();
    expect(screen.getByText("プロジェクト1")).toBeInTheDocument();
    expect(screen.getByText("プロジェクト2")).toBeInTheDocument();
  });

  it("プロジェクトが選択されたときにコールバックが呼ばれる", () => {
    render(<ProjectList {...mockProps} />);

    fireEvent.click(screen.getByText("プロジェクト2"));
    expect(mockProps.onProjectSelect).toHaveBeenCalledWith("2");
  });

  it("新規プロジェクトボタンをクリックするとコールバックが呼ばれる", () => {
    render(<ProjectList {...mockProps} />);

    fireEvent.click(screen.getByLabelText("新規プロジェクト"));
    expect(mockProps.onAddProjectClick).toHaveBeenCalled();
  });

  it("プロジェクトが空の場合にメッセージが表示される", () => {
    render(<ProjectList {...mockProps} projects={[]} />);

    expect(screen.getByText(PROJECT_MESSAGES.NO_PROJECTS)).toBeInTheDocument();
  });

  it("未完了タスクのバッジが表示される", () => {
    render(<ProjectList {...mockProps} />);

    const badges = screen.getAllByText("2");
    expect(badges[0]).toBeInTheDocument();
  });

  it("選択されたプロジェクトが強調表示される", () => {
    render(<ProjectList {...mockProps} />);

    const selectedProject = screen.getByText("プロジェクト1").closest("button");
    const unselectedProject = screen
      .getByText("プロジェクト2")
      .closest("button");

    expect(selectedProject).toHaveClass("bg-accent");
    expect(unselectedProject).not.toHaveClass("bg-accent");
  });
});
