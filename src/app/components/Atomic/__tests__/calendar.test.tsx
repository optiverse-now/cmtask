import { render, screen } from "@testing-library/react";
import { Calendar } from "../calendar";

// react-day-pickerのモック
jest.mock("react-day-picker", () => {
  const actual = jest.requireActual("react-day-picker");
  return {
    ...actual,
    DayPicker: jest
      .fn()
      .mockImplementation(({ className, classNames = {} }) => {
        return (
          <div className={className}>
            <div role="grid">
              <div role="rowgroup">
                <div role="row">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div
                      key={i}
                      role="columnheader"
                      className={classNames.head_cell || ""}
                    >
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][i]}
                    </div>
                  ))}
                </div>
              </div>
              <div role="rowgroup">
                <div role="row">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div
                      key={i}
                      role="gridcell"
                      className={classNames.cell || ""}
                    >
                      <button
                        type="button"
                        className={classNames.day || ""}
                        aria-label={i === 0 ? "Today" : `Day ${i + 1}`}
                      >
                        {i + 1}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      }),
  };
});

describe("Calendar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("デフォルトのプロパティで正しくレンダリングされること", () => {
    render(<Calendar />);
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("カスタムクラス名が適用されること", () => {
    render(<Calendar className="custom-calendar" />);
    expect(screen.getByRole("grid").parentElement).toHaveClass(
      "custom-calendar",
    );
  });

  it("曜日のヘッダーが正しく表示されること", () => {
    render(<Calendar />);
    const headers = screen.getAllByRole("columnheader");
    expect(headers).toHaveLength(7);
    expect(headers[0]).toHaveTextContent("Sun");
    expect(headers[6]).toHaveTextContent("Sat");
  });

  it("日付のセルが正しく表示されること", () => {
    render(<Calendar />);
    const cells = screen.getAllByRole("gridcell");
    expect(cells).toHaveLength(7); // 1週間分の日付セル

    // 最初のセルに1日が表示されていることを確認
    const firstDayButton = cells[0].querySelector("button");
    expect(firstDayButton).toHaveTextContent("1");
  });

  it("今日の日付が表示されること", () => {
    render(<Calendar />);
    const todayButton = screen.getByLabelText("Today");
    expect(todayButton).toBeInTheDocument();
    expect(todayButton).toHaveTextContent("1"); // モックでは1日を今日として設定
  });
});
