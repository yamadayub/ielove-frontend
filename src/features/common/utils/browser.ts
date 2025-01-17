/**
 * LINEのアプリ内ブラウザかどうかを判定する
 */
export const isLineInAppBrowser = (): boolean => {
  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.includes('line') && !userAgent.includes('line/');
}; 