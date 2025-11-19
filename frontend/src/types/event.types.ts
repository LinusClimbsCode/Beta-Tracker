// Event type (as returned by API)
export interface Event {
  id: string
  gymId: string
  name: string
  description: string
  date: string
  createdById: string
  createdAt: string
  updatedAt: string
}

// Event with relations
export interface EventWithRelations extends Event {
  gym: {
    id: string
    name: string
    city: string
  }
  createdBy: {
    id: string
    username: string
  }
}

// Request types
export interface CreateEventRequest {
  gymId: string
  name: string
  description: string
  date: string
}

export interface UpdateEventRequest {
  name?: string
  description?: string
  date?: string
}
