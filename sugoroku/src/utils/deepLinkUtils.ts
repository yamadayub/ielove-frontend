import { DeepLinkParams } from '../types';

/**
 * URLからディープリンクパラメータを解析する
 * 例: /step/5 -> { stepId: 5 }
 *     /group/2 -> { groupId: 2 }
 */
export const parseDeepLink = (url: string): DeepLinkParams => {
  const params: DeepLinkParams = {};
  
  // URLパスからパラメータを抽出
  const pathSegments = url.split('/').filter(segment => segment);
  
  for (let i = 0; i < pathSegments.length - 1; i++) {
    if (pathSegments[i] === 'step' && !isNaN(Number(pathSegments[i + 1]))) {
      params.stepId = Number(pathSegments[i + 1]);
    }
    
    if (pathSegments[i] === 'group' && !isNaN(Number(pathSegments[i + 1]))) {
      params.groupId = Number(pathSegments[i + 1]);
    }
  }
  
  // URLのクエリパラメータも確認
  const queryParams = new URLSearchParams(window.location.search);
  const stepIdParam = queryParams.get('stepId');
  const groupIdParam = queryParams.get('groupId');
  
  if (stepIdParam && !isNaN(Number(stepIdParam))) {
    params.stepId = Number(stepIdParam);
  }
  
  if (groupIdParam && !isNaN(Number(groupIdParam))) {
    params.groupId = Number(groupIdParam);
  }
  
  return params;
};

/**
 * ディープリンクパラメータからURLを生成する
 */
export const generateDeepLink = (params: DeepLinkParams): string => {
  if (params.stepId) {
    return `/step/${params.stepId}`;
  }
  
  if (params.groupId) {
    return `/group/${params.groupId}`;
  }
  
  return '/';
}; 