import type { WallType } from './common.types'

// Wall type (as returned by API)
export interface Wall {
  id: string
  gymId: string
  name: string
  description: string
  imageUrl: string
  wallType: WallType[]
  isActive: boolean
  lastReset: string | null
  createdAt: string
  updatedAt: string
}

// Wall with relations
export interface WallWithRelations extends Wall {
  gym: {
    id: string
    name: string
    city: string
  }
  boulders?: Boulder[]
}

// Request types
export interface CreateWallRequest {
  gymId: string
  name: string
  description: string
  imageUrl: string
  wallType: WallType[]
  isActive: boolean
  lastReset?: string
}

export interface UpdateWallRequest {
  name?: string
  description?: string
  imageUrl?: string
  wallType?: WallType[]
  isActive?: boolean
  lastReset?: string
}

// Import type to avoid circular dependency
import type { Boulder } from './boulder.types'
