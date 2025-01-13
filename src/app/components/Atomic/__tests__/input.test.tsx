import { render, screen, fireEvent } from "@testing-library/react";
import { Input } from "../input";

describe("Input", () => {
  it("デフォルトのプロパティで正しくレンダリングされること", () => {
    render(<Input placeholder="テスト入力" />);
    const input = screen.getByPlaceholderText("テスト入力");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "text");
  });

  it("カスタムクラス名が適用されること", () => {
    render(<Input className="custom-class" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("custom-class");
  });

  it("異なるタイプの入力が正しく動作すること", () => {
    render(<Input type="password" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("type", "password");
  });

  it("入力値が正しく更新されること", () => {
    render(<Input />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "テストテキスト" } });
    expect(input).toHaveValue("テストテキスト");
  });

  it("disabled状態が正しく適用されること", () => {
    render(<Input disabled />);
    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
  });

  it("フォーカス時のスタイルが適用されること", () => {
    render(<Input />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("focus-visible:ring-2");
  });
});
