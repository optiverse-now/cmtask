import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isBasicAuthEnabled, getBasicAuthCredentials, getEnvironment, config } from './config';

export { config };

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
