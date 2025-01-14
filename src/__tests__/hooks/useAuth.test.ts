import { renderHook, act } from '@testing-library/react';
import { useAuth } from '@/app/hooks/useAuth';
import { AuthError, Session, User } from '@supabase/supabase-js';

// モックの作成
const mockRouter = {
  push: jest.fn(),
};

jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
}));

const mockSupabaseAuth = {
  signInWithPassword: jest.fn(),
  signUp: jest.fn(),
  signOut: jest.fn(),
};

jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: () => ({
    auth: mockSupabaseAuth,
  }),
}));

describe('useAuth', () => {
  const validEmail = 'test@test.com';
  const validPassword = 'Testtest';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('サインイン', () => {
    it('正しい認証情報で成功する', async () => {
      const { result } = renderHook(() => useAuth());
      
      const mockUser: User = {
        id: '1',
        email: validEmail,
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: '',
      };

      const mockSession: Session = {
        access_token: 'mock-token',
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: 'mock-refresh',
        user: mockUser,
        expires_at: 123456789,
      };

      mockSupabaseAuth.signInWithPassword.mockResolvedValueOnce({
        data: {
          user: mockUser,
          session: mockSession,
        },
        error: null,
      });

      await act(async () => {
        await result.current.signIn(validEmail, validPassword);
      });

      expect(mockSupabaseAuth.signInWithPassword).toHaveBeenCalledWith({
        email: validEmail,
        password: validPassword,
      });
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
      expect(result.current.error).toBeNull();
    });

    it('不正なメールアドレスでエラーになる', async () => {
      const { result } = renderHook(() => useAuth());

      const mockError = new AuthError('Invalid email format');

      mockSupabaseAuth.signInWithPassword.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: mockError,
      });

      await act(async () => {
        await result.current.signIn('invalid-email', validPassword);
      });

      expect(result.current.error).toEqual(mockError.message);
      expect(mockRouter.push).not.toHaveBeenCalled();
    });

    it('不正なパスワードでエラーになる', async () => {
      const { result } = renderHook(() => useAuth());

      const mockError = new AuthError('Invalid login credentials');

      mockSupabaseAuth.signInWithPassword.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: mockError,
      });

      await act(async () => {
        await result.current.signIn(validEmail, 'wrongpassword');
      });

      expect(result.current.error).toEqual(mockError.message);
      expect(mockRouter.push).not.toHaveBeenCalled();
    });
  });

  describe('サインアップ', () => {
    it('有効な認証情報で成功する', async () => {
      const { result } = renderHook(() => useAuth());
      
      const mockUser: User = {
        id: '1',
        email: validEmail,
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: '',
      };

      const mockSession: Session = {
        access_token: 'mock-token',
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: 'mock-refresh',
        user: mockUser,
        expires_at: 123456789,
      };

      mockSupabaseAuth.signUp.mockResolvedValueOnce({
        data: {
          user: mockUser,
          session: mockSession,
        },
        error: null,
      });

      await act(async () => {
        await result.current.signUp(validEmail, validPassword);
      });

      expect(mockSupabaseAuth.signUp).toHaveBeenCalledWith({
        email: validEmail,
        password: validPassword,
      });
      expect(mockRouter.push).toHaveBeenCalledWith('/auth/verify');
      expect(result.current.error).toBeNull();
    });

    it('既存のメールアドレスでエラーになる', async () => {
      const { result } = renderHook(() => useAuth());

      const mockError = new AuthError('User already registered');

      mockSupabaseAuth.signUp.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: mockError,
      });

      await act(async () => {
        await result.current.signUp(validEmail, validPassword);
      });

      expect(result.current.error).toEqual(mockError.message);
      expect(mockRouter.push).not.toHaveBeenCalled();
    });

    it('パスワードが要件を満たさない場合エラーになる', async () => {
      const { result } = renderHook(() => useAuth());

      const mockError = new AuthError('Password should be at least 8 characters');

      mockSupabaseAuth.signUp.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: mockError,
      });

      await act(async () => {
        await result.current.signUp(validEmail, 'short');
      });

      expect(result.current.error).toEqual(mockError.message);
      expect(mockRouter.push).not.toHaveBeenCalled();
    });
  });

  it('サインアウトが成功する', async () => {
    const { result } = renderHook(() => useAuth());

    mockSupabaseAuth.signOut.mockResolvedValueOnce({
      error: null,
    });

    await act(async () => {
      await result.current.signOut();
    });

    expect(mockSupabaseAuth.signOut).toHaveBeenCalled();
    expect(mockRouter.push).toHaveBeenCalledWith('/auth/login');
    expect(result.current.error).toBeNull();
  });
}); 