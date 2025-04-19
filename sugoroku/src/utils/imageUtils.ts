/**
 * 画像読み込みエラー時の処理を行うユーティリティ関数
 * フォールバック画像が見つからない場合に無限ループが発生するのを防ぐ
 */
export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, groupId: number): void => {
  const target = e.target as HTMLImageElement;
  
  // すでにフォールバック画像かデフォルト画像に置き換えられている場合は処理を分岐
  if (target.src.includes('/images/fallback/')) {
    // フォールバック画像でもエラーの場合はデフォルト画像を使用
    target.src = '/images/default.jpg';
    target.onerror = null; // これ以上エラーイベントを発生させない
    return;
  }
  
  if (target.src.includes('/images/default.jpg')) {
    // デフォルト画像でもエラーの場合はエラー処理を停止
    target.onerror = null;
    return;
  }
  
  // 元の画像でエラーが発生した場合はフォールバック画像を試す
  const fallbackCategory = groupId === 1 ? 'planning' :
                          groupId === 2 ? 'design' :
                          groupId === 3 ? 'construction' : 'completion';
  target.src = `/images/fallback/${fallbackCategory}_1.jpg`;
}; 