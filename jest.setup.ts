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