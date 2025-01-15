import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../button";

describe("Button", () => {
  it("デフォルトのボタンがレンダリングされること", () => {
    render(<Button>テストボタン</Button>);
    const button = screen.getByRole("button", { name: "テストボタン" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-primary");
  });

  it("異なるバリアントのスタイルが適用されること", () => {
    render(<Button variant="destructive">デストラクティブボタン</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-destructive");
  });

  it("異なるサイズのスタイルが適用されること", () => {
    render(<Button size="lg">大きいボタン</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("h-10");
  });

  it("カスタムクラス名が適用されること", () => {
    render(<Button className="custom-class">カスタムボタン</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-class");
  });

  it("クリックイベントが発火すること", async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>クリックボタン</Button>);
    const button = screen.getByRole("button");

    await userEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("disabled状態が正しく機能すること", () => {
    render(<Button disabled>無効ボタン</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveClass("disabled:pointer-events-none");
  });
});
