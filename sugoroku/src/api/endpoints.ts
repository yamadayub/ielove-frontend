export const ENDPOINTS = {
  // Steps関連
  STEPS: {
    GET_ALL: '/sugoroku/steps/',
    GET_ONE: (stepId: number) => `/sugoroku/steps/${stepId}/`,
    SEARCH: '/sugoroku/steps/search/',
    GET_GROUPS: '/sugoroku/steps/groups/',
    GET_BY_GROUP: (groupId: number) => `/sugoroku/steps/groups/${groupId}/steps/`,
    GET_BY_PHASE: (phase: string) => `/sugoroku/steps/phase/${phase}/`,
    GET_DETAILS: (stepId: number) => `/sugoroku/steps/${stepId}/`,
  },

  // User Steps関連
  USER_STEPS: {
    GET_ALL: '/sugoroku/steps/user/steps/',
    GET_COMPLETED: '/sugoroku/steps/user/completed/',
    GET_WITH_NOTES: '/sugoroku/steps/user/notes/',
    GET_PROGRESS: '/sugoroku/steps/user/progress/',
    GET_PHASE_PROGRESS: (phase: string) => `/sugoroku/steps/user/progress/${phase}/`,
    TOGGLE_COMPLETE: (stepId: number) => `/sugoroku/steps/user/steps/${stepId}/complete/`,
    UPDATE_NOTES: (stepId: number) => `/sugoroku/steps/user/steps/${stepId}/notes/`,
  },

  // Likes関連
  LIKES: {
    GET_LIKED_STEPS: '/sugoroku/steps/user/liked/',
    LIKE_STEP: (stepId: number) => `/sugoroku/steps/${stepId}/like/`,
    UNLIKE_STEP: (stepId: number) => `/sugoroku/steps/${stepId}/unlike/`,
  },

  // Chats関連
  CHATS: {
    GET_ALL: '/sugoroku/chats/',
    CREATE: '/sugoroku/chats/',
    GET_ONE: (chatId: number) => `/sugoroku/chats/${chatId}/`,
    UPDATE: (chatId: number) => `/sugoroku/chats/${chatId}/`,
    SEND_MESSAGE: (chatId: number) => `/sugoroku/chats/${chatId}/messages/`,
    MARK_READ: (chatId: number) => `/sugoroku/chats/${chatId}/messages/read/`,
  }
}; 