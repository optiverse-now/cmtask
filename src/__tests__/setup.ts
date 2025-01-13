import "@testing-library/jest-dom";

// テストのタイムアウト時間を設定
jest.setTimeout(10000);

// Radix UIのテストに必要なDOMメソッドのモック
Object.defineProperty(window, "hasPointerCapture", {
  value: jest.fn(),
});

Object.defineProperty(window, "releasePointerCapture", {
  value: jest.fn(),
});

Object.defineProperty(window, "setPointerCapture", {
  value: jest.fn(),
});

// コンソールエラーをテスト失敗として扱う
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === "string" &&
      (args[0].includes("Warning: ReactDOM.render is no longer supported") ||
        args[0].includes(
          "Error: Uncaught [TypeError: target.hasPointerCapture is not a function]",
        ) ||
        args[0].includes(
          "Error: Uncaught [TypeError: target.setPointerCapture is not a function]",
        ) ||
        args[0].includes(
          "Error: Uncaught [TypeError: target.releasePointerCapture is not a function]",
        ))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
