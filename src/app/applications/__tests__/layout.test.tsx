import { render, screen } from "@testing-library/react";
import ApplicationLayout from "../layout";
import { useProject } from "@/app/contexts/ProjectContext";

// matchMediaのモック
Object.defineProperty(window, 'matchMedia', {
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Project型の定義
interface Project {
  id: string;
  name: string;
}

// モックの設定
jest.mock("@/app/contexts/ProjectContext", () => ({
  ProjectProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="project-provider">{children}</div>
  ),
  useProject: jest.fn(),
}));

jest.mock("@/app/contexts/TaskContext", () => ({
  TaskProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="task-provider">{children}</div>
  ),
}));

jest.mock("@/app/components/Organisms/Sidebar/LeftSidebar", () => ({
  __esModule: true,
  default: ({
    projects,
    selectedProjectId,
  }: {
    projects: Project[];
    selectedProjectId: string | null;
    onProjectSelect: (id: string) => void;
    onAddProject: () => void;
  }) => (
    <div data-testid="left-sidebar">
      <div>Projects: {projects.length}</div>
      <div>Selected: {selectedProjectId}</div>
    </div>
  ),
}));

describe("ApplicationLayout", () => {
  const mockUseProject = useProject as jest.Mock;

  beforeEach(() => {
    mockUseProject.mockReset();
    mockUseProject.mockReturnValue({
      projects: [],
      selectedProjectId: null,
      selectProject: jest.fn(),
      addProject: jest.fn(),
    });
  });

  it("プロバイダーが正しい順序で配置されていること", () => {
    render(
      <ApplicationLayout>
        <div>Test Content</div>
      </ApplicationLayout>,
    );

    const projectProvider = screen.getByTestId("project-provider");
    const taskProvider = screen.getByTestId("task-provider");

    expect(projectProvider).toBeInTheDocument();
    expect(taskProvider).toBeInTheDocument();
    // ProjectProviderがTaskProviderを包含していることを確認
    expect(projectProvider.contains(taskProvider)).toBe(true);
  });

  it("左サイドバーが表示されること", () => {
    mockUseProject.mockReturnValue({
      projects: [{ id: "1", name: "Test Project" }],
      selectedProjectId: "1",
      selectProject: jest.fn(),
      addProject: jest.fn(),
    });

    render(
      <ApplicationLayout>
        <div>Test Content</div>
      </ApplicationLayout>,
    );

    const leftSidebar = screen.getByTestId("left-sidebar");
    expect(leftSidebar).toBeInTheDocument();
  });

  it("子コンポーネントが正しく表示されること", () => {
    render(
      <ApplicationLayout>
        <div>Test Content</div>
      </ApplicationLayout>,
    );

    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("メインコンテンツエリアが適切なクラスを持つこと", () => {
    render(
      <ApplicationLayout>
        <div>Test Content</div>
      </ApplicationLayout>,
    );

    const mainContent = screen.getByText("Test Content").parentElement;
    expect(mainContent).toHaveClass("flex-1", "overflow-auto");
  });
});
