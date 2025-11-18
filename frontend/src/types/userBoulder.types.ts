import { UserBoulderStatus } from './common.types'

// UserBoulder type (as returned by API)
export interface UserBoulder {
  id: string
  boulderId: string
  userId: string
  status: UserBoulderStatus
  attempts: number
  firstAttemptAt: string
  completedAt: string | null
  xpAwarded: number
  createdAt: string
  updatedAt: string
}

// UserBoulder with relations
export interface UserBoulderWithRelations extends UserBoulder {
  boulder: {
    id: string
    name: string
    imageUrl: string
    wall: {
      id: string
      name: string
      gym: {
        id: string
        name: string
      }
    }
    grade: {
      id: string
      value: string
    }
  }
  user: {
    id: string
    username: string
  }
}

// Request types
export interface CreateUserBoulderRequest {
  boulderId: string
  status: UserBoulderStatus
  attempts: number
}

export interface UpdateUserBoulderRequest {
  status?: UserBoulderStatus
  attempts?: number
}
