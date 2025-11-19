// Frontend Route Paths
export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_EMAIL: '/verify-email',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  // Gym & Wall routes
  GYMS: '/gyms',
  GYM_DETAIL: (id: string) => `/gyms/${id}`,
  WALL_DETAIL: (id: string) => `/walls/${id}`,

  // Boulder routes
  BOULDERS: '/boulders',
  BOULDER_DETAIL: (id: string) => `/boulders/${id}`,
  BOULDER_UPLOAD: '/boulders/upload',
  BOULDER_VALIDATE: '/boulders/validate',

  // User routes
  PROFILE: '/profile',
  MY_BOULDERS: '/my-boulders',
  MY_PROJECTS: '/my-projects',

  // Event routes
  EVENTS: '/events',
  EVENT_DETAIL: (id: string) => `/events/${id}`,

  // Admin routes
  ADMIN_DASHBOARD: '/admin',
  ADMIN_GYMS: '/admin/gyms',
  ADMIN_COLORS: '/admin/colors',
  ADMIN_GRADES: '/admin/grades',
} as const
