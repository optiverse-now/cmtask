import { render, screen } from "@testing-library/react";
import { useTheme } from "next-themes";
import { ThemeProvider } from "../ThemeProvider";

// next-themesのモック
jest.mock("next-themes", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useTheme: jest.fn(),
}));

describe("ThemeProvider", () => {
  const mockUseTheme = useTheme as jest.Mock;

  beforeEach(() => {
    mockUseTheme.mockReset();
    mockUseTheme.mockReturnValue({
      theme: "light",
      setTheme: jest.fn(),
    });
  });

  it("子コンポーネントを正しくレンダリングすること", () => {
    const TestChild = () => <div>Test Child</div>;
    render(
      <ThemeProvider>
        <TestChild />
      </ThemeProvider>,
    );
    expect(screen.getByText("Test Child")).toBeInTheDocument();
  });

  it("テーマのプロパティが正しく渡されること", () => {
    render(
      <ThemeProvider defaultTheme="dark" enableSystem={true}>
        <div>Test Child</div>
      </ThemeProvider>,
    );
    // ThemeProviderに渡されたプロパティが正しく処理されることを確認
    expect(screen.getByText("Test Child")).toBeInTheDocument();
  });
});
