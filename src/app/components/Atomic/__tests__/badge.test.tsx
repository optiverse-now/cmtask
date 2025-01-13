import { render, screen } from "@testing-library/react";
import { Badge } from "../badge";

describe("Badge", () => {
  it("デフォルトのバリアントで正しくレンダリングされること", () => {
    render(<Badge>Test Badge</Badge>);
    const badge = screen.getByText("Test Badge");

    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass(
      "border-transparent",
      "bg-primary",
      "text-primary-foreground",
    );
  });

  it("secondaryバリアントが正しく適用されること", () => {
    render(<Badge variant="secondary">Secondary Badge</Badge>);
    const badge = screen.getByText("Secondary Badge");

    expect(badge).toHaveClass(
      "border-transparent",
      "bg-secondary",
      "text-secondary-foreground",
    );
  });

  it("destructiveバリアントが正しく適用されること", () => {
    render(<Badge variant="destructive">Destructive Badge</Badge>);
    const badge = screen.getByText("Destructive Badge");

    expect(badge).toHaveClass(
      "border-transparent",
      "bg-destructive",
      "text-destructive-foreground",
    );
  });

  it("outlineバリアントが正しく適用されること", () => {
    render(<Badge variant="outline">Outline Badge</Badge>);
    const badge = screen.getByText("Outline Badge");

    expect(badge).toHaveClass("text-foreground");
  });

  it("カスタムクラス名が適用されること", () => {
    render(<Badge className="custom-class">Custom Badge</Badge>);
    const badge = screen.getByText("Custom Badge");

    expect(badge).toHaveClass("custom-class");
  });

  it("基本的なスタイルが全てのバリアントに適用されること", () => {
    render(<Badge>Test Badge</Badge>);
    const badge = screen.getByText("Test Badge");

    expect(badge).toHaveClass(
      "inline-flex",
      "items-center",
      "rounded-full",
      "border",
      "px-2.5",
      "py-0.5",
      "text-xs",
      "font-semibold",
    );
  });

  it("フォーカス時のスタイルが適用されること", () => {
    render(<Badge>Focus Badge</Badge>);
    const badge = screen.getByText("Focus Badge");

    expect(badge).toHaveClass(
      "focus:outline-none",
      "focus:ring-2",
      "focus:ring-ring",
      "focus:ring-offset-2",
    );
  });
});
