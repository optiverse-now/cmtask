export const config = {
  matcher: '/:path*',  // すべてのパスに対してMiddlewareを適用
};

export const PRODUCTION_DOMAIN = 'optiverse-now.com';
export const STAGING_DOMAIN = 'dev.optiverse-now.com';
export const LOCAL_DOMAIN = 'localhost:3000';

// 環境判定用の関数
export const getEnvironment = (hostname: string | null): 'production' | 'staging' | 'local' | 'unknown' => {
  if (!hostname) return 'unknown';
  
  if (hostname.includes(PRODUCTION_DOMAIN)) return 'production';
  if (hostname.includes(STAGING_DOMAIN)) return 'staging';
  if (hostname.includes(LOCAL_DOMAIN)) return 'local';
  
  return 'unknown';
};

export const isBasicAuthEnabled = (): boolean => {
  return process.env.BASIC_AUTH_ENABLED === 'true';
};

export const getBasicAuthCredentials = () => {
  const user = process.env.BASIC_AUTH_USER;
  const password = process.env.BASIC_AUTH_PASSWORD;

  if (!user || !password) {
    throw new Error('Basic認証の環境変数が設定されていません');
  }

  return { user, password };
};
