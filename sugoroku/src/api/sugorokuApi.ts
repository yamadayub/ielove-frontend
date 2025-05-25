import axiosInstance, { useAuthenticatedAxios } from './apiClient';
import { ENDPOINTS } from './endpoints';
import {
  Step,
  UserStep,
  StepGroup,
  PhaseProgress,
  ChatListItem,
  ChatWithMessages,
  ChatMessage,
  ChatCreateRequest,
  MessageCreateRequest,
  StepLike
} from '../types/sugoroku';
import { useCallback } from 'react';

// フック形式でSugoroku APIを提供
export const useSugorokuApi = () => {
  // 認証付きaxiosインスタンスを取得
  const authAxios = useAuthenticatedAxios();
  
  // 公開ステップ関連API（認証不要）
  const getSteps = useCallback((offset = 0, limit = 100) => 
    axiosInstance.get<Step[]>(ENDPOINTS.STEPS.GET_ALL, { params: { offset, limit } }),
  []);
  
  const searchSteps = useCallback((query: string) => 
    axiosInstance.get<Step[]>(ENDPOINTS.STEPS.SEARCH, { params: { query } }),
  []);
  
  const getStepGroups = useCallback(() => 
    axiosInstance.get<StepGroup[]>(ENDPOINTS.STEPS.GET_GROUPS),
  []);
  
  const getStepsByGroup = useCallback((groupId: number) => 
    axiosInstance.get<Step[]>(ENDPOINTS.STEPS.GET_BY_GROUP(groupId)),
  []);
  
  const getStepsByPhase = useCallback((phase: string) => 
    axiosInstance.get<Step[]>(ENDPOINTS.STEPS.GET_BY_PHASE(phase)),
  []);
  
  const getStepDetails = useCallback((stepId: number) => 
    axiosInstance.get<Step>(ENDPOINTS.STEPS.GET_DETAILS(stepId)),
  []);
  
  // ユーザーステップ関連API（認証必要）
  const getUserSteps = useCallback(() => 
    authAxios.get<UserStep[]>(ENDPOINTS.USER_STEPS.GET_ALL),
  [authAxios]);
  
  const getCompletedSteps = useCallback(() => 
    authAxios.get<UserStep[]>(ENDPOINTS.USER_STEPS.GET_COMPLETED),
  [authAxios]);
  
  const getStepsWithNotes = useCallback(() => 
    authAxios.get<UserStep[]>(ENDPOINTS.USER_STEPS.GET_WITH_NOTES),
  [authAxios]);
  
  const getTotalProgress = useCallback(() => 
    authAxios.get<{ progress: number }>(ENDPOINTS.USER_STEPS.GET_PROGRESS),
  [authAxios]);
  
  const getPhaseProgress = useCallback((phase: string) => 
    authAxios.get<PhaseProgress>(ENDPOINTS.USER_STEPS.GET_PHASE_PROGRESS(phase)),
  [authAxios]);
  
  const toggleStepComplete = useCallback((stepId: number) => 
    authAxios.post<UserStep>(ENDPOINTS.USER_STEPS.TOGGLE_COMPLETE(stepId)),
  [authAxios]);
  
  const updateStepNotes = useCallback((stepId: number, notes: string) => 
    authAxios.post<UserStep>(ENDPOINTS.USER_STEPS.UPDATE_NOTES(stepId), { notes }),
  [authAxios]);
  
  // いいね関連API（認証必要）
  const getLikedSteps = useCallback(() => 
    authAxios.get<UserStep[]>(ENDPOINTS.LIKES.GET_LIKED_STEPS),
  [authAxios]);
  
  const likeStep = useCallback((stepId: number) => 
    authAxios.post<StepLike>(ENDPOINTS.LIKES.LIKE_STEP(stepId)),
  [authAxios]);
  
  const unlikeStep = useCallback((stepId: number) => 
    authAxios.delete(ENDPOINTS.LIKES.UNLIKE_STEP(stepId)),
  [authAxios]);
  
  // チャット関連API（認証必要）
  const getChats = useCallback((skip = 0, limit = 50) => 
    authAxios.get<ChatListItem[]>(ENDPOINTS.CHATS.GET_ALL, { params: { skip, limit } }),
  [authAxios]);
  
  const createChat = useCallback((data: ChatCreateRequest) => 
    authAxios.post<ChatListItem>(ENDPOINTS.CHATS.CREATE, data),
  [authAxios]);
  
  const getChat = useCallback((chatId: number, skip = 0, limit = 50) => 
    authAxios.get<ChatWithMessages>(ENDPOINTS.CHATS.GET_ONE(chatId), { params: { skip, limit } }),
  [authAxios]);
  
  const updateChat = useCallback((chatId: number, data: { title?: string, builder_id?: number, status?: string }) => 
    authAxios.put<ChatListItem>(ENDPOINTS.CHATS.UPDATE(chatId), data),
  [authAxios]);
  
  const sendMessage = useCallback((chatId: number, data: MessageCreateRequest) => 
    authAxios.post<ChatMessage>(ENDPOINTS.CHATS.SEND_MESSAGE(chatId), data),
  [authAxios]);
  
  const markMessagesAsRead = useCallback((chatId: number) => 
    authAxios.put<{ marked_as_read: number }>(ENDPOINTS.CHATS.MARK_READ(chatId)),
  [authAxios]);

  return {
    // 公開API
    getSteps,
    searchSteps,
    getStepGroups,
    getStepsByGroup,
    getStepsByPhase,
    getStepDetails,
    // 認証API
    getUserSteps,
    getCompletedSteps,
    getStepsWithNotes,
    getTotalProgress,
    getPhaseProgress,
    toggleStepComplete,
    updateStepNotes,
    getLikedSteps,
    likeStep,
    unlikeStep,
    getChats,
    createChat,
    getChat,
    updateChat,
    sendMessage,
    markMessagesAsRead
  };
};

// 後方互換性のためのオブジェクト形式（非推奨）
export const sugorokuApi = {
  // ステップ関連API（認証不要）
  getSteps: (offset = 0, limit = 100) => 
    axiosInstance.get<Step[]>(ENDPOINTS.STEPS.GET_ALL, { params: { offset, limit } }),
  
  searchSteps: (query: string) => 
    axiosInstance.get<Step[]>(ENDPOINTS.STEPS.SEARCH, { params: { query } }),
  
  getStepGroups: () => 
    axiosInstance.get<StepGroup[]>(ENDPOINTS.STEPS.GET_GROUPS),
  
  getStepsByGroup: (groupId: number) => 
    axiosInstance.get<Step[]>(ENDPOINTS.STEPS.GET_BY_GROUP(groupId)),
  
  getStepsByPhase: (phase: string) => 
    axiosInstance.get<Step[]>(ENDPOINTS.STEPS.GET_BY_PHASE(phase)),
  
  getStepDetails: (stepId: number) => 
    axiosInstance.get<Step>(ENDPOINTS.STEPS.GET_DETAILS(stepId)),
  
  // 下記の関数はHooks内でのみ使用すべき
  // 認証コンテキスト外で使用すると正しく動作しない可能性があります
  getUserSteps: () => 
    axiosInstance.get<UserStep[]>(ENDPOINTS.USER_STEPS.GET_ALL),
  
  getCompletedSteps: () => 
    axiosInstance.get<UserStep[]>(ENDPOINTS.USER_STEPS.GET_COMPLETED),
  
  getStepsWithNotes: () => 
    axiosInstance.get<UserStep[]>(ENDPOINTS.USER_STEPS.GET_WITH_NOTES),
  
  getTotalProgress: () => 
    axiosInstance.get<{ progress: number }>(ENDPOINTS.USER_STEPS.GET_PROGRESS),
  
  getPhaseProgress: (phase: string) => 
    axiosInstance.get<PhaseProgress>(ENDPOINTS.USER_STEPS.GET_PHASE_PROGRESS(phase)),
  
  toggleStepComplete: (stepId: number) => 
    axiosInstance.post<UserStep>(ENDPOINTS.USER_STEPS.TOGGLE_COMPLETE(stepId)),
  
  updateStepNotes: (stepId: number, notes: string) => 
    axiosInstance.post<UserStep>(ENDPOINTS.USER_STEPS.UPDATE_NOTES(stepId), { notes }),
  
  getLikedSteps: () => 
    axiosInstance.get<UserStep[]>(ENDPOINTS.LIKES.GET_LIKED_STEPS),
  
  likeStep: (stepId: number) => 
    axiosInstance.post<StepLike>(ENDPOINTS.LIKES.LIKE_STEP(stepId)),
  
  unlikeStep: (stepId: number) => 
    axiosInstance.delete(ENDPOINTS.LIKES.UNLIKE_STEP(stepId)),
  
  getChats: (skip = 0, limit = 50) => 
    axiosInstance.get<ChatListItem[]>(ENDPOINTS.CHATS.GET_ALL, { params: { skip, limit } }),
  
  createChat: (data: ChatCreateRequest) => 
    axiosInstance.post<ChatListItem>(ENDPOINTS.CHATS.CREATE, data),
  
  getChat: (chatId: number, skip = 0, limit = 50) => 
    axiosInstance.get<ChatWithMessages>(ENDPOINTS.CHATS.GET_ONE(chatId), { params: { skip, limit } }),
  
  updateChat: (chatId: number, data: { title?: string, builder_id?: number, status?: string }) => 
    axiosInstance.put<ChatListItem>(ENDPOINTS.CHATS.UPDATE(chatId), data),
  
  sendMessage: (chatId: number, data: MessageCreateRequest) => 
    axiosInstance.post<ChatMessage>(ENDPOINTS.CHATS.SEND_MESSAGE(chatId), data),
  
  markMessagesAsRead: (chatId: number) => 
    axiosInstance.put<{ marked_as_read: number }>(ENDPOINTS.CHATS.MARK_READ(chatId))
}; 