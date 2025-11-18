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

// Prisma Enums (matching backend exactly)
export enum UserRole {
  user = 'user',
  moderator = 'moderator',
  admin = 'admin'
}

export enum UserLevel {
  Newbie = 'Newbie',
  Regular = 'Regular',
  HallenOG = 'HallenOG'
}

export enum BoulderStatus {
  pending = 'pending',
  approved = 'approved',
  rejected = 'rejected',
  flagged = 'flagged'
}

export enum WallType {
  overhang = 'overhang',
  slab = 'slab',
  vertical = 'vertical',
  roof = 'roof'
}

export enum UserBoulderStatus {
  project = 'project',
  flash = 'flash',
  top = 'top'
}

export enum GradeRating {
  easy = 'easy',
  appropriate = 'appropriate',
  hard = 'hard'
}

export enum QualityRating {
  liked = 'liked',
  neutral = 'neutral',
  disliked = 'disliked'
}

export enum ValidationVote {
  approve = 'approve',
  reject = 'reject',
  flag = 'flag'
}
