// Gym type (as returned by API)
export interface Gym {
  id: string
  name: string
  city: string
  address: string
  website: string | null
  imageUrl: string
  createdAt: string
  updatedAt: string
}

// Gym with relations (for detail view)
export interface GymWithRelations extends Gym {
  walls?: Wall[]
  events?: Event[]
  grades?: Grade[]
}

// Request types
export interface CreateGymRequest {
  name: string
  city: string
  address: string
  website?: string
  imageUrl: string
}

export interface UpdateGymRequest {
  name?: string
  city?: string
  address?: string
  website?: string
  imageUrl?: string
}

// Import types to avoid circular dependencies
import type { Wall } from './wall.types'
import type { Event } from './event.types'
import type { Grade } from './grade.types'
