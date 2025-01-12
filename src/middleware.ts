import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware設定
export const config = {
  matcher: ['/:path*']
};

// 定数
const PRODUCTION_DOMAIN = 'optiverse-now.com';
const STAGING_DOMAIN = 'dev.optiverse-now.com';
const DEVELOPMENT_DOMAIN = 'localhost:3000';

// 環境判定用の関数
const getEnvironment = (hostname: string | null): 'production' | 'staging' | 'development' | 'unknown' => {
  if (!hostname) return 'unknown';
  
  if (hostname.includes(PRODUCTION_DOMAIN)) return 'production';
  if (hostname.includes(STAGING_DOMAIN)) return 'staging';
  if (hostname.includes(DEVELOPMENT_DOMAIN)) return 'development';
  
  return 'unknown';
};

// Basic認証の有効/無効判定
const isBasicAuthEnabled = (): boolean => {
  const appEnv = process.env.APP_ENV || 'development';
  console.log('Current APP_ENV:', appEnv);
  return process.env.BASIC_AUTH_ENABLED === 'true';
};

// Basic認証の認証情報取得
const getBasicAuthCredentials = () => {
  const user = process.env.BASIC_AUTH_USER;
  const password = process.env.BASIC_AUTH_PASSWORD;

  if (!user || !password) {
    throw new Error('Basic認証の環境変数が設定されていません');
  }

  return { user, password };
};

export function middleware(request: NextRequest) {
  
  const hostname = request.headers.get('host');
  const environment = getEnvironment(hostname);

  // Basic認証が有効な場合のみ認証を適用
  if (isBasicAuthEnabled()) {
    try {
      const { user: validUser, password: validPassword } = getBasicAuthCredentials();
      const basicAuth = request.headers.get('authorization');

      if (basicAuth) {
        const authValue = basicAuth.split(' ')[1];
        const [user, pwd] = atob(authValue).split(':');

        if (user === validUser && pwd === validPassword) {
          return NextResponse.next();
        }
      }

      // 認証失敗時のレスポンス
      return new NextResponse('Authentication required', {
        status: 401,
        headers: {
          'WWW-Authenticate': `Basic realm="Secure Area - ${environment}"`,
        },
      });
    } catch (error) {
      console.error(`Basic認証の設定エラー (${environment}):`, error);
      return new NextResponse('Server Configuration Error', { status: 500 });
    }
  }

  return NextResponse.next();
}
