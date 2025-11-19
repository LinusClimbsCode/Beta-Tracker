// Common API Response Types

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
  errors?: Array<{
    message: string
    path?: string[]
  }>
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ErrorResponse {
  success: false
  message: string
  errors?: Array<{
    message: string
    path?: string[]
  }>
}

// Prisma Enums
// Using string literal union types for erasableSyntaxOnly compatibility
export type UserRole = 'user' | 'moderator' | 'admin'

export type UserLevel = 'Newbie' | 'Regular' | 'HallenOG'

export type BoulderStatus = 'pending' | 'approved' | 'rejected' | 'flagged'

export type WallType = 'overhang' | 'slab' | 'vertical' | 'roof'

export type UserBoulderStatus = 'project' | 'flash' | 'top'

export type GradeRating = 'easy' | 'appropriate' | 'hard'

export type QualityRating = 'liked' | 'neutral' | 'disliked'

export type ValidationVote = 'approve' | 'reject' | 'flag'
