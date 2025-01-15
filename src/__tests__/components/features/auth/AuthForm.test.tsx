import { render, screen, fireEvent } from '@testing-library/react';
import { AuthForm } from '@/app/components/features/auth/AuthForm';
import { useAuth } from '@/app/hooks/useAuth';

// useAuthフックのモック
jest.mock('@/app/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

// Next.jsのルーターをモック
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('AuthForm', () => {
  const mockSignIn = jest.fn();
  const mockSignUp = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      signIn: mockSignIn,
      signUp: mockSignUp,
      error: null,
      isLoading: false,
    });
  });

  describe('ログインフォーム', () => {
    it('正しくレンダリングされること', () => {
      render(<AuthForm mode="login" />);

      expect(screen.getByLabelText('メールアドレス')).toBeInTheDocument();
      expect(screen.getByLabelText('パスワード')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'ログイン' })).toBeInTheDocument();
    });

    it('フォーム送信時にsignInが呼ばれること', async () => {
      render(<AuthForm mode="login" />);

      const emailInput = screen.getByLabelText('メールアドレス');
      const passwordInput = screen.getByLabelText('パスワード');
      const submitButton = screen.getByRole('button', { name: 'ログイン' });

      fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
      fireEvent.change(passwordInput, { target: { value: 'Testtest' } });
      fireEvent.click(submitButton);

      expect(mockSignIn).toHaveBeenCalledWith('test@test.com', 'Testtest');
    });

    it('ローディング中はボタンが無効化されること', () => {
      (useAuth as jest.Mock).mockReturnValue({
        signIn: mockSignIn,
        signUp: mockSignUp,
        error: null,
        isLoading: true,
      });

      render(<AuthForm mode="login" />);

      expect(screen.getByRole('button', { name: 'Loading...' })).toBeDisabled();
    });

    it('エラーメッセージが表示されること', () => {
      (useAuth as jest.Mock).mockReturnValue({
        signIn: mockSignIn,
        signUp: mockSignUp,
        error: 'Invalid credentials',
        isLoading: false,
      });

      render(<AuthForm mode="login" />);

      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  describe('サインアップフォーム', () => {
    it('正しくレンダリングされること', () => {
      render(<AuthForm mode="signup" />);

      expect(screen.getByLabelText('メールアドレス')).toBeInTheDocument();
      expect(screen.getByLabelText('パスワード')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'サインアップ' })).toBeInTheDocument();
    });

    it('フォーム送信時にsignUpが呼ばれること', async () => {
      render(<AuthForm mode="signup" />);

      const emailInput = screen.getByLabelText('メールアドレス');
      const passwordInput = screen.getByLabelText('パスワード');
      const submitButton = screen.getByRole('button', { name: 'サインアップ' });

      fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
      fireEvent.change(passwordInput, { target: { value: 'Testtest' } });
      fireEvent.click(submitButton);

      expect(mockSignUp).toHaveBeenCalledWith('test@test.com', 'Testtest');
    });

    it('ローディング中はボタンが無効化されること', () => {
      (useAuth as jest.Mock).mockReturnValue({
        signIn: mockSignIn,
        signUp: mockSignUp,
        error: null,
        isLoading: true,
      });

      render(<AuthForm mode="signup" />);

      expect(screen.getByRole('button', { name: 'Loading...' })).toBeDisabled();
    });

    it('エラーメッセージが表示されること', () => {
      (useAuth as jest.Mock).mockReturnValue({
        signIn: mockSignIn,
        signUp: mockSignUp,
        error: 'Email already exists',
        isLoading: false,
      });

      render(<AuthForm mode="signup" />);

      expect(screen.getByText('Email already exists')).toBeInTheDocument();
    });
  });
}); 