import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProjectModal from "../ProjectModal";

// モックデータ
const mockProject = {
  name: "テストプロジェクト",
  description: "これはテストプロジェクトの説明です",
};

describe("ProjectModal", () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("作成モードで正しくレンダリングされること", () => {
    render(
      <ProjectModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        mode="create"
      />,
    );

    expect(screen.getByText("プロジェクトを作成")).toBeInTheDocument();
    expect(screen.getByText("プロジェクトの新規作成")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("プロジェクト名を入力"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("プロジェクトの説明を入力"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "作成" })).toBeInTheDocument();
  });

  it("編集モードで正しくレンダリングされること", () => {
    render(
      <ProjectModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        mode="edit"
        initialData={mockProject}
      />,
    );

    expect(screen.getByText("プロジェクトを編集")).toBeInTheDocument();
    expect(screen.getByText("プロジェクトの情報を編集")).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockProject.name)).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(mockProject.description),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "更新" })).toBeInTheDocument();
  });

  it("フォームの入力と送信が正しく機能すること", async () => {
    render(
      <ProjectModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        mode="create"
      />,
    );

    const nameInput = screen.getByPlaceholderText("プロジェクト名を入力");
    const descriptionInput =
      screen.getByPlaceholderText("プロジェクトの説明を入力");
    const submitButton = screen.getByRole("button", { name: "作成" });

    await userEvent.type(nameInput, mockProject.name);
    await userEvent.type(descriptionInput, mockProject.description);
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: mockProject.name,
        description: mockProject.description,
      });
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("キャンセルボタンをクリックするとonCloseが呼ばれること", async () => {
    render(
      <ProjectModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        mode="create"
      />,
    );

    const cancelButton = screen.getByRole("button", { name: "キャンセル" });
    await userEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("バリデーションエラーが正しく表示されること", async () => {
    render(
      <ProjectModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        mode="create"
      />,
    );

    const submitButton = screen.getByRole("button", { name: "作成" });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getAllByText("必須項目です")).toHaveLength(2);
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});
