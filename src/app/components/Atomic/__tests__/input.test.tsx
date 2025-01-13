import { render, screen } from "@testing-library/react";
import { Input } from "../input";

describe("Input", () => {
  it("デフォルトのプロパティで正しくレンダリングされること", () => {
    render(<Input placeholder="テスト入力" type="text" />);
    const input = screen.getByPlaceholderText("テスト入力");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "text");
  });

  it("カスタムクラス名が適用されること", () => {
    render(<Input className="custom-input" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("custom-input");
  });

  it("異なるタイプの入力が正しく動作すること", () => {
    render(<Input type="password" />);
    const input = screen.getByRole("textbox", { hidden: true });
    expect(input).toHaveAttribute("type", "password");
  });
});
