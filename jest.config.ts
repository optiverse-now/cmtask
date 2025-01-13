import type { Config } from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({
  // next.config.jsとテスト環境用の.envファイルが配置されたディレクトリをセット
  dir: './',
});

// Jest設定オブジェクト
const customJestConfig: Config = {
  // テストファイルのパターンを指定
  testMatch: [
    "**/__tests__/**/*.test.[jt]s?(x)",
  ],
  // テスト環境を指定
  testEnvironment: 'jest-environment-jsdom',
  // テストのセットアップファイルを指定
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  // モジュール名のエイリアスを設定
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // カバレッジの設定
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/*.test.{js,jsx,ts,tsx}',
  ],
  // カバレッジのしきい値
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

// createJestConfigを定義することによって、本ファイルで定義された設定がNext.jsの設定に反映されます
export default createJestConfig(customJestConfig); 