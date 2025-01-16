import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

// グローバルなモックの設定
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    };
  },
  usePathname() {
    return '';
  },
}));

// テスト実行前の共通設定
beforeAll(() => {
  // コンソールエラーの抑制（必要な場合）
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

// テスト実行後のクリーンアップ
afterAll(() => {
  jest.restoreAllMocks();
});

// グローバルなモックの設定
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
}); 