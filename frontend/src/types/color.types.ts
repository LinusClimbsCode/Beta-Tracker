// Color type (as returned by API)
export interface Color {
  id: string
  name: string
  hexCode: string
  createdAt: string
  updatedAt: string
}

// Request types
export interface CreateColorRequest {
  name: string
  hexCode: string
}

export interface UpdateColorRequest {
  name?: string
  hexCode?: string
}
