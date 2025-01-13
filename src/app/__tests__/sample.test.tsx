import { render, screen } from '@testing-library/react';

describe('サンプルテスト', () => {
  it('テストが正しく実行されることを確認', () => {
    expect(true).toBe(true);
  });

  it('DOMのテストが正しく実行されることを確認', () => {
    render(<div>テスト</div>);
    expect(screen.getByText('テスト')).toBeInTheDocument();
  });
}); 