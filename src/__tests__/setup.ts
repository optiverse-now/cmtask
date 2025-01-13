import '@testing-library/jest-dom';

// テストのタイムアウト時間を設定
jest.setTimeout(10000);

// コンソールエラーをテスト失敗として扱う
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
}); 