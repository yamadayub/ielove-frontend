/**
 * LINEのアプリ内ブラウザかどうかを判定する
 */
export const isLineInAppBrowser = (): boolean => {
  const userAgent = navigator.userAgent.toLowerCase();
  
  // LINEアプリ内ブラウザの特徴的なユーザーエージェントパターン
  const linePatterns = [
    'line/',
    'line ',
    'linemobile/',
    'line-iphone',
    'line-android',
    'line-pad'
  ];

  // デバッグ用にユーザーエージェントを画面に表示
  alert(`User Agent: ${userAgent}`);

  return linePatterns.some(pattern => userAgent.includes(pattern));
}; 