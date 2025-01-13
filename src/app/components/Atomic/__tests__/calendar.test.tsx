import { render, screen } from "@testing-library/react";
import { Calendar } from "../calendar";

describe("Calendar", () => {
  it("デフォルトのプロパティで正しくレンダリングされること", () => {
    render(<Calendar />);

    // カレンダーのコンテナが存在することを確認
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("カスタムクラス名が適用されること", () => {
    render(<Calendar className="custom-calendar" />);

    const calendar = screen.getByRole("grid").parentElement;
    expect(calendar).toHaveClass("custom-calendar");
  });

  it("月の表示が正しく行われること", () => {
    render(<Calendar />);

    // 月のコンテナが正しいスタイルを持つことを確認
    const monthContainer =
      screen.getByRole("grid").parentElement?.parentElement;
    expect(monthContainer).toHaveClass("space-y-4");
  });

  it("ナビゲーションボタンが正しく表示されること", () => {
    render(<Calendar />);

    const prevButton = screen.getByLabelText("Go to previous month");
    const nextButton = screen.getByLabelText("Go to next month");

    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
    expect(prevButton).toHaveClass("absolute", "left-1");
    expect(nextButton).toHaveClass("absolute", "right-1");
  });

  it("曜日のヘッダーが正しく表示されること", () => {
    render(<Calendar />);

    const headers = screen.getAllByRole("columnheader");
    expect(headers).toHaveLength(7); // 7日分のヘッダー
    headers.forEach((header) => {
      expect(header).toHaveClass(
        "text-muted-foreground",
        "rounded-md",
        "w-9",
        "font-normal",
      );
    });
  });

  it("日付のセルが正しく表示されること", () => {
    render(<Calendar />);

    const days = screen.getAllByRole("gridcell");
    days.forEach((day) => {
      expect(day).toHaveClass(
        "h-9",
        "w-9",
        "text-center",
        "text-sm",
        "p-0",
        "relative",
      );
    });
  });

  it("外側の日付が表示されること", () => {
    render(<Calendar showOutsideDays={true} />);

    // 外側の日付が表示されていることを確認
    const outsideDays = screen
      .getAllByRole("gridcell")
      .filter((cell) =>
        cell.querySelector(".text-muted-foreground.opacity-50"),
      );
    expect(outsideDays.length).toBeGreaterThan(0);
  });

  it("今日の日付が表示されること", () => {
    const today = new Date();
    render(<Calendar defaultMonth={today} />);

    // 今日の日付を含むセルが存在することを確認
    const cells = screen.getAllByRole("gridcell");
    const todayCell = cells.find((cell) => {
      const button = cell.querySelector("button");
      return button && button.getAttribute("aria-label")?.includes("Today");
    });

    expect(todayCell).toBeTruthy();
  });
});
