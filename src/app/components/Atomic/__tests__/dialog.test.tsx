import { render, screen } from "@testing-library/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../dialog";

describe("Dialog Components", () => {
  it("ダイアログヘッダーが正しくレンダリングされること", () => {
    render(
      <Dialog>
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
      <Dialog>
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
      <Dialog>
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
      <Dialog>
        <DialogContent className="custom-content">
          <DialogHeader className="custom-header">
            <DialogTitle>Header Title</DialogTitle>
          </DialogHeader>
          <div>Content</div>
          <DialogFooter className="custom-footer">
            <button>OK</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByText("Content").parentElement).toHaveClass(
      "custom-content",
    );
    expect(
      screen.getByText("Header Title").closest(".custom-header"),
    ).toHaveClass("custom-header");
    expect(screen.getByText("OK").parentElement).toHaveClass("custom-footer");
  });
});
