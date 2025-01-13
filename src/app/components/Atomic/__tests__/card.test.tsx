import { render, screen } from "@testing-library/react";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "../card";

describe("Card Components", () => {
  it("Cardが正しくレンダリングされること", () => {
    render(
      <Card>
        <div>Card Content</div>
      </Card>,
    );

    const card = screen.getByText("Card Content").parentElement;
    expect(card).toHaveClass(
      "rounded-lg",
      "border",
      "bg-card",
      "text-card-foreground",
      "shadow-sm",
    );
  });

  it("CardHeaderが正しくレンダリングされること", () => {
    render(
      <CardHeader>
        <div>Header Content</div>
      </CardHeader>,
    );

    const header = screen.getByText("Header Content").parentElement;
    expect(header).toHaveClass("flex", "flex-col", "space-y-1.5", "p-6");
  });

  it("CardTitleが正しくレンダリングされること", () => {
    render(<CardTitle>Test Title</CardTitle>);

    const title = screen.getByText("Test Title");
    expect(title).toHaveClass(
      "text-2xl",
      "font-semibold",
      "leading-none",
      "tracking-tight",
    );
    expect(title.tagName).toBe("H3");
  });

  it("CardDescriptionが正しくレンダリングされること", () => {
    render(<CardDescription>Test Description</CardDescription>);

    const description = screen.getByText("Test Description");
    expect(description).toHaveClass("text-sm", "text-muted-foreground");
    expect(description.tagName).toBe("P");
  });

  it("CardContentが正しくレンダリングされること", () => {
    render(
      <CardContent>
        <div>Content</div>
      </CardContent>,
    );

    const content = screen.getByText("Content").parentElement;
    expect(content).toHaveClass("p-6", "pt-0");
  });

  it("CardFooterが正しくレンダリングされること", () => {
    render(
      <CardFooter>
        <div>Footer Content</div>
      </CardFooter>,
    );

    const footer = screen.getByText("Footer Content").parentElement;
    expect(footer).toHaveClass("flex", "items-center", "p-6", "pt-0");
  });

  it("カスタムクラス名が各コンポーネントに適用されること", () => {
    render(
      <>
        <Card className="custom-card">Card</Card>
        <CardHeader className="custom-header">Header</CardHeader>
        <CardTitle className="custom-title">Title</CardTitle>
        <CardDescription className="custom-desc">Description</CardDescription>
        <CardContent className="custom-content">Content</CardContent>
        <CardFooter className="custom-footer">Footer</CardFooter>
      </>,
    );

    expect(screen.getByText("Card").parentElement).toHaveClass("custom-card");
    expect(screen.getByText("Header").parentElement).toHaveClass(
      "custom-header",
    );
    expect(screen.getByText("Title")).toHaveClass("custom-title");
    expect(screen.getByText("Description")).toHaveClass("custom-desc");
    expect(screen.getByText("Content").parentElement).toHaveClass(
      "custom-content",
    );
    expect(screen.getByText("Footer").parentElement).toHaveClass(
      "custom-footer",
    );
  });

  it("完全なカード構造が正しくレンダリングされること", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Complete Card</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Main Content</p>
        </CardContent>
        <CardFooter>
          <button>Action</button>
        </CardFooter>
      </Card>,
    );

    expect(screen.getByText("Complete Card")).toBeInTheDocument();
    expect(screen.getByText("Card Description")).toBeInTheDocument();
    expect(screen.getByText("Main Content")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
  });
});
