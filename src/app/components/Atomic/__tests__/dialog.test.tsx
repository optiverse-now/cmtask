import { render, screen } from "@testing-library/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../dialog";

describe("Dialog Components", () => {
  it("ダイアログヘッダーが正しくレンダリングされること", () => {
    render(
      <Dialog defaultOpen>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Title</DialogTitle>
            <DialogDescription>Test Description</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  it("ダイアログタイトルに適切なスタイルが適用されること", () => {
    render(
      <Dialog defaultOpen>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Test Title</DialogTitle>
        </DialogContent>
      </Dialog>,
    );
    const title = screen.getByText("Test Title");
    expect(title).toHaveClass("text-lg", "font-semibold");
  });

  it("ダイアログの説明文に適切なスタイルが適用されること", () => {
    render(
      <Dialog defaultOpen>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogDescription>Test Description</DialogDescription>
        </DialogContent>
      </Dialog>,
    );
    const description = screen.getByText("Test Description");
    expect(description).toHaveClass("text-sm", "text-muted-foreground");
  });

  it("カスタムクラス名が各コンポーネントに適用されること", () => {
    render(
      <Dialog defaultOpen>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent className="custom-content" data-testid="dialog-content">
          <DialogHeader className="custom-header" data-testid="dialog-header">
            <DialogTitle>Header Title</DialogTitle>
          </DialogHeader>
          <div>Content</div>
          <DialogFooter className="custom-footer" data-testid="dialog-footer">
            <button>OK</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByTestId("dialog-content")).toHaveClass("custom-content");
    expect(screen.getByTestId("dialog-header")).toHaveClass("custom-header");
    expect(screen.getByTestId("dialog-footer")).toHaveClass("custom-footer");
  });
});
