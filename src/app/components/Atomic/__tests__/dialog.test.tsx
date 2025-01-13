import { render, screen, fireEvent } from "@testing-library/react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "../dialog";

describe("Dialog Components", () => {
  it("ダイアログが正しく開閉できること", () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <div>Dialog Content</div>
        </DialogContent>
      </Dialog>,
    );

    // トリガーをクリック
    fireEvent.click(screen.getByText("Open Dialog"));
    expect(screen.getByText("Dialog Content")).toBeInTheDocument();
  });

  it("ダイアログヘッダーが正しくレンダリングされること", () => {
    render(
      <DialogHeader>
        <DialogTitle>Test Title</DialogTitle>
        <DialogDescription>Test Description</DialogDescription>
      </DialogHeader>,
    );

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  it("ダイアログフッターが正しくレンダリングされること", () => {
    render(
      <DialogFooter>
        <button>Cancel</button>
        <button>Submit</button>
      </DialogFooter>,
    );

    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  it("ダイアログタイトルに適切なスタイルが適用されること", () => {
    render(<DialogTitle>Test Title</DialogTitle>);
    const title = screen.getByText("Test Title");
    expect(title).toHaveClass("text-lg", "font-semibold");
  });

  it("ダイアログの説明文に適切なスタイルが適用されること", () => {
    render(<DialogDescription>Test Description</DialogDescription>);
    const description = screen.getByText("Test Description");
    expect(description).toHaveClass("text-sm", "text-muted-foreground");
  });

  it("カスタムクラス名が各コンポーネントに適用されること", () => {
    render(
      <>
        <DialogHeader className="custom-header">Header</DialogHeader>
        <DialogFooter className="custom-footer">Footer</DialogFooter>
        <DialogTitle className="custom-title">Title</DialogTitle>
        <DialogDescription className="custom-desc">
          Description
        </DialogDescription>
      </>,
    );

    expect(screen.getByText("Header").parentElement).toHaveClass(
      "custom-header",
    );
    expect(screen.getByText("Footer").parentElement).toHaveClass(
      "custom-footer",
    );
    expect(screen.getByText("Title")).toHaveClass("custom-title");
    expect(screen.getByText("Description")).toHaveClass("custom-desc");
  });
});
