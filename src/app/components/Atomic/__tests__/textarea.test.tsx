import { render, screen, fireEvent } from "@testing-library/react";
import { Textarea } from "../textarea";

describe("Textarea", () => {
  it("デフォルトのプロパティで正しくレンダリングされること", () => {
    render(<Textarea placeholder="テストテキストエリア" />);
    const textarea = screen.getByPlaceholderText("テストテキストエリア");
    expect(textarea).toBeInTheDocument();
  });

  it("カスタムクラス名が適用されること", () => {
    render(<Textarea className="custom-class" />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveClass("custom-class");
  });

  it("最小の高さが設定されていること", () => {
    render(<Textarea />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveClass("min-h-[80px]");
  });

  it("入力値が正しく更新されること", () => {
    render(<Textarea />);
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "テストテキスト\n複数行" } });
    expect(textarea).toHaveValue("テストテキスト\n複数行");
  });

  it("disabled状態が正しく適用されること", () => {
    render(<Textarea disabled />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toBeDisabled();
  });

  it("フォーカス時のスタイルが適用されること", () => {
    render(<Textarea />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveClass("focus-visible:ring-2");
  });

  it("プレースホルダーのスタイルが適用されること", () => {
    render(<Textarea />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveClass("placeholder:text-muted-foreground");
  });
});
