import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProjectProvider, useProject } from "../ProjectContext";

// テスト用のコンポーネント
const TestComponent = () => {
  const {
    projects,
    selectedProjectId,
    addProject,
    updateProject,
    deleteProject,
    selectProject,
    completeProject,
  } = useProject();

  return (
    <div>
      <button onClick={() => addProject("テストプロジェクト", "説明")}>
        プロジェクト追加
      </button>
      <button onClick={() => updateProject("project-1", "更新プロジェクト")}>
        プロジェクト更新
      </button>
      <button onClick={() => deleteProject("project-1")}>
        プロジェクト削除
      </button>
      <button onClick={() => selectProject("project-1")}>
        プロジェクト選択
      </button>
      <button onClick={() => completeProject("project-1")}>
        プロジェクト完了
      </button>
      <div data-testid="projects-length">{projects.length}</div>
      <div data-testid="selected-project">{selectedProjectId}</div>
      {projects.map((project) => (
        <div key={project.id} data-testid={`project-${project.id}`}>
          {project.name} - {project.status}
        </div>
      ))}
    </div>
  );
};

describe("ProjectContext", () => {
  const renderWithProvider = () => {
    return render(
      <ProjectProvider>
        <TestComponent />
      </ProjectProvider>,
    );
  };

  it("初期状態が正しいこと", () => {
    renderWithProvider();
    expect(screen.getByTestId("projects-length").textContent).toBe("0");
    expect(screen.getByTestId("selected-project").textContent).toBe("");
  });

  it("プロジェクトを追加できること", async () => {
    renderWithProvider();
    const addButton = screen.getByText("プロジェクト追加");
    await userEvent.click(addButton);

    expect(screen.getByTestId("projects-length").textContent).toBe("1");
    expect(screen.getByText(/テストプロジェクト/)).toBeInTheDocument();
  });

  it("プロジェクトを選択できること", async () => {
    renderWithProvider();

    // プロジェクトを追加
    await userEvent.click(screen.getByText("プロジェクト追加"));

    // プロジェクトを選択
    await userEvent.click(screen.getByText("プロジェクト選択"));

    const selectedProject = screen.getByTestId("selected-project");
    expect(selectedProject.textContent).toBe("project-1");
  });

  it("プロジェクトを更新できること", async () => {
    renderWithProvider();

    // プロジェクトを追加
    await userEvent.click(screen.getByText("プロジェクト追加"));

    // プロジェクトを更新
    await userEvent.click(screen.getByText("プロジェクト更新"));

    expect(screen.getByText(/更新プロジェクト/)).toBeInTheDocument();
  });

  it("プロジェクトを削除できること", async () => {
    renderWithProvider();

    // プロジェクトを追加
    await userEvent.click(screen.getByText("プロジェクト追加"));
    expect(screen.getByTestId("projects-length").textContent).toBe("1");

    // プロジェクトを削除
    await userEvent.click(screen.getByText("プロジェクト削除"));
    expect(screen.getByTestId("projects-length").textContent).toBe("0");
  });

  it("プロジェクトを完了状態に変更できること", async () => {
    renderWithProvider();

    // プロジェクトを追加
    await userEvent.click(screen.getByText("プロジェクト追加"));

    // プロジェクトを完了状態に変更
    await userEvent.click(screen.getByText("プロジェクト完了"));

    const projectElement = screen.getByTestId("project-project-1");
    expect(projectElement).toHaveTextContent("完了");
  });

  it("プロジェクトの状態が正しく更新されること", async () => {
    renderWithProvider();

    // プロジェクトを追加
    await act(async () => {
      await userEvent.click(screen.getByText("プロジェクト追加"));
    });

    // プロジェクトの状態を確認
    const project = screen.getByTestId("project-project-1");
    expect(project).toHaveTextContent("テストプロジェクト");
    expect(project).toHaveTextContent("未着手");

    // プロジェクトを完了状態に変更
    await act(async () => {
      await userEvent.click(screen.getByText("プロジェクト完了"));
    });

    // 更新後の状態を確認
    expect(project).toHaveTextContent("完了");
  });
});
