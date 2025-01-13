import { render, screen } from "@testing-library/react";
import { Avatar, AvatarImage, AvatarFallback } from "../avatar";

describe("Avatar Components", () => {
  it("Avatarが正しくレンダリングされること", () => {
    render(
      <Avatar>
        <AvatarImage src="test.jpg" alt="test avatar" />
        <AvatarFallback>TB</AvatarFallback>
      </Avatar>,
    );

    const image = screen.getByAltText("test avatar");
    expect(image).toBeInTheDocument();
  });

  it("AvatarImageが適切なサイズとアスペクト比を持つこと", () => {
    render(
      <Avatar>
        <AvatarImage src="test.jpg" alt="test avatar" />
      </Avatar>,
    );

    const image = screen.getByAltText("test avatar");
    expect(image).toHaveClass("aspect-square", "h-full", "w-full");
  });

  it("AvatarFallbackが正しく表示されること", () => {
    render(
      <Avatar>
        <AvatarFallback>TB</AvatarFallback>
      </Avatar>,
    );

    const fallback = screen.getByText("TB");
    expect(fallback).toBeInTheDocument();
    expect(fallback.parentElement).toHaveClass(
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
      <Avatar className="custom-avatar">
        <AvatarImage
          className="custom-image"
          src="test.jpg"
          alt="test avatar"
        />
        <AvatarFallback className="custom-fallback">TB</AvatarFallback>
      </Avatar>,
    );

    const avatar = screen.getByAltText("test avatar").parentElement;
    const image = screen.getByAltText("test avatar");

    expect(avatar).toHaveClass("custom-avatar");
    expect(image).toHaveClass("custom-image");
  });

  it("Avatarのデフォルトスタイルが適用されること", () => {
    render(<Avatar />);

    const avatar = screen.getByRole("img");
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
