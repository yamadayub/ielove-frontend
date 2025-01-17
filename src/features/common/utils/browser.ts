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

  return linePatterns.some(pattern => userAgent.includes(pattern));
}; 