import { render, screen } from "@testing-library/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../card";

describe("Card Components", () => {
  it("カードが正しくレンダリングされること", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Test Title</CardTitle>
          <CardDescription>Test Description</CardDescription>
        </CardHeader>
        <CardContent>Test Content</CardContent>
        <CardFooter>Test Footer</CardFooter>
      </Card>,
    );

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
    expect(screen.getByText("Test Footer")).toBeInTheDocument();
  });

  it("カスタムクラス名が各コンポーネントに適用されること", () => {
    render(
      <Card className="custom-card" data-testid="card">
        <CardHeader className="custom-header" data-testid="card-header">
          <CardTitle className="custom-title">Test Title</CardTitle>
          <CardDescription className="custom-description">
            Test Description
          </CardDescription>
        </CardHeader>
        <CardContent className="custom-content" data-testid="card-content">
          Test Content
        </CardContent>
        <CardFooter className="custom-footer" data-testid="card-footer">
          Test Footer
        </CardFooter>
      </Card>,
    );

    expect(screen.getByTestId("card")).toHaveClass("custom-card");
    expect(screen.getByTestId("card-header")).toHaveClass("custom-header");
    expect(screen.getByText("Test Title")).toHaveClass("custom-title");
    expect(screen.getByText("Test Description")).toHaveClass(
      "custom-description",
    );
    expect(screen.getByTestId("card-content")).toHaveClass("custom-content");
    expect(screen.getByTestId("card-footer")).toHaveClass("custom-footer");
  });

  it("デフォルトのスタイルが適用されること", () => {
    render(
      <Card data-testid="card">
        <CardHeader data-testid="card-header">
          <CardTitle>Test Title</CardTitle>
          <CardDescription>Test Description</CardDescription>
        </CardHeader>
      </Card>,
    );

    expect(screen.getByTestId("card")).toHaveClass(
      "rounded-lg",
      "border",
      "bg-card",
      "text-card-foreground",
      "shadow-sm",
    );
    expect(screen.getByTestId("card-header")).toHaveClass(
      "flex",
      "flex-col",
      "space-y-1.5",
      "p-6",
    );
  });
});
