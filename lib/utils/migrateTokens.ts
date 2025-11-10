/**
 * Утилита для миграции старых токенов на новые ключи
 * Вызывается один раз при загрузке приложения
 */

export function migrateClientTokens() {
  if (typeof window === 'undefined') return;

  // Проверяем, есть ли старые токены
  const oldAccessToken = localStorage.getItem('access_token');
  const oldRefreshToken = localStorage.getItem('refresh_token');

  // Если старые токены существуют, мигрируем их
  if (oldAccessToken || oldRefreshToken) {
    console.log('[Client] Migrating old tokens to new keys...');
    
    if (oldAccessToken) {
      localStorage.setItem('client_access_token', oldAccessToken);
      document.cookie = `client_access_token=${oldAccessToken}; path=/; max-age=${60 * 1}`;
    }
    
    if (oldRefreshToken) {
      localStorage.setItem('client_refresh_token', oldRefreshToken);
      document.cookie = `client_refresh_token=${oldRefreshToken}; path=/; max-age=${60 * 60 * 24 * 7}`;
    }
    
    // Удаляем старые токены
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    document.cookie = 'access_token=; path=/; max-age=0';
    document.cookie = 'refresh_token=; path=/; max-age=0';
    
    console.log('[Client] Token migration completed');
  }
}
