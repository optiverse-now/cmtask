import { render, screen } from "@testing-library/react";
import { Avatar, AvatarImage, AvatarFallback } from "../avatar";

describe("Avatar Components", () => {
  it("Avatarが正しくレンダリングされること", () => {
    render(
      <Avatar data-testid="avatar">
        <AvatarImage src="/test-image.jpg" alt="test avatar" />
        <AvatarFallback>TB</AvatarFallback>
      </Avatar>,
    );

    const fallback = screen.getByText("TB");
    expect(fallback).toBeInTheDocument();
  });

  it("AvatarImageが適切なサイズとアスペクト比を持つこと", () => {
    render(
      <Avatar data-testid="avatar">
        <AvatarImage
          src="/test-image.jpg"
          alt="test avatar"
          className="test-image"
        />
        <AvatarFallback>TB</AvatarFallback>
      </Avatar>,
    );

    const avatar = screen.getByTestId("avatar");
    expect(avatar).toHaveClass(
      "relative",
      "flex",
      "h-10",
      "w-10",
      "shrink-0",
      "overflow-hidden",
      "rounded-full",
    );
  });

  it("AvatarFallbackが正しく表示されること", () => {
    render(
      <Avatar data-testid="avatar">
        <AvatarFallback data-testid="avatar-fallback">TB</AvatarFallback>
      </Avatar>,
    );

    const fallback = screen.getByTestId("avatar-fallback");
    expect(fallback).toBeInTheDocument();
    expect(fallback).toHaveClass(
      "flex",
      "h-full",
      "w-full",
      "items-center",
      "justify-center",
      "rounded-full",
      "bg-muted",
    );
  });

  it("カスタムクラス名が各コンポーネントに適用されること", () => {
    render(
      <Avatar className="custom-avatar" data-testid="avatar">
        <AvatarImage
          src="/test-image.jpg"
          alt="test avatar"
          className="custom-image"
        />
        <AvatarFallback
          className="custom-fallback"
          data-testid="avatar-fallback"
        >
          TB
        </AvatarFallback>
      </Avatar>,
    );

    const avatar = screen.getByTestId("avatar");
    const fallback = screen.getByTestId("avatar-fallback");

    expect(avatar).toHaveClass("custom-avatar");
    expect(fallback).toHaveClass("custom-fallback");
  });

  it("Avatarのデフォルトスタイルが適用されること", () => {
    render(
      <Avatar data-testid="avatar">
        <AvatarImage src="/test-image.jpg" alt="test avatar" />
        <AvatarFallback>TB</AvatarFallback>
      </Avatar>,
    );

    const avatar = screen.getByTestId("avatar");
    expect(avatar).toHaveClass(
      "relative",
      "flex",
      "h-10",
      "w-10",
      "shrink-0",
      "overflow-hidden",
      "rounded-full",
    );
  });
});
