// Grade type (as returned by API)
export interface Grade {
  id: string
  gymId: string
  value: string
  displayOrder: number
  createdAt: string
  updatedAt: string
}

// Grade with gym relation
export interface GradeWithGym extends Grade {
  gym: {
    id: string
    name: string
  }
}

// Request types
export interface CreateGradeRequest {
  gymId: string
  value: string
  displayOrder: number
}

export interface UpdateGradeRequest {
  value?: string
  displayOrder?: number
}
