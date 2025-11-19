// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    VERIFY_EMAIL: '/auth/verify-email',
    RESEND_VERIFICATION: '/auth/resend-verification',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  // Gym
  GYM: {
    GET_ALL: '/gym',
    GET_BY_ID: (id: string) => `/gym/${id}`,
    CREATE: '/gym',
    UPDATE: (id: string) => `/gym/${id}`,
    DELETE: (id: string) => `/gym/${id}`,
  },
  // Wall
  WALL: {
    GET_ALL: '/wall',
    GET_BY_ID: (id: string) => `/wall/${id}`,
    CREATE: '/wall',
    UPDATE: (id: string) => `/wall/${id}`,
    DELETE: (id: string) => `/wall/${id}`,
  },
  // Boulder
  BOULDER: {
    GET_ALL: '/boulder',
    GET_BY_ID: (id: string) => `/boulder/${id}`,
    CREATE: '/boulder',
    UPDATE: (id: string) => `/boulder/${id}`,
    DELETE: (id: string) => `/boulder/${id}`,
  },
  // Validation
  VALIDATION: {
    CREATE: '/validation',
    GET_PENDING: '/validation/pending',
    GET_BY_BOULDER: (boulderId: string) => `/validation/boulder/${boulderId}`,
  },
  // User Boulder
  USER_BOULDER: {
    GET_MY_BOULDERS: '/user-boulder/me',
    CREATE: '/user-boulder',
    UPDATE: (id: string) => `/user-boulder/${id}`,
    DELETE: (id: string) => `/user-boulder/${id}`,
  },
  // Rating
  RATING: {
    CREATE: '/rating',
    GET_BY_ID: (id: string) => `/rating/${id}`,
    GET_BY_BOULDER: (boulderId: string) => `/rating/boulder/${boulderId}`,
    GET_MY_RATINGS: '/rating/user/me',
    UPDATE: (id: string) => `/rating/${id}`,
    DELETE: (id: string) => `/rating/${id}`,
  },
  // Color
  COLOR: {
    GET_ALL: '/color',
    GET_BY_ID: (id: string) => `/color/${id}`,
    CREATE: '/color',
    UPDATE: (id: string) => `/color/${id}`,
    DELETE: (id: string) => `/color/${id}`,
  },
  // Grade
  GRADE: {
    GET_ALL: '/grade',
    GET_BY_ID: (id: string) => `/grade/${id}`,
    CREATE: '/grade',
    UPDATE: (id: string) => `/grade/${id}`,
    DELETE: (id: string) => `/grade/${id}`,
  },
  // Event
  EVENT: {
    GET_ALL: '/event',
    GET_BY_ID: (id: string) => `/event/${id}`,
    CREATE: '/event',
    UPDATE: (id: string) => `/event/${id}`,
    DELETE: (id: string) => `/event/${id}`,
  },
} as const
