import { BoulderStatus, GradeRating, QualityRating } from './common.types'
import type { Color } from './color.types'
import type { Grade } from './grade.types'

// Boulder type (as returned by API)
export interface Boulder {
  id: string
  wallId: string
  gradeId: string
  name: string
  imageUrl: string
  uploadedById: string
  verifiedSetterId: string | null
  unverifiedSetterName: string | null
  status: BoulderStatus
  currentValidationPoints: number
  requiredValidationPoints: number
  communityGrade: GradeRating
  communityFeedback: QualityRating
  createdAt: string
  updatedAt: string
}

// Boulder with relations (for detail view)
export interface BoulderWithRelations extends Boulder {
  wall: {
    id: string
    name: string
    gym: {
      id: string
      name: string
      city: string
    }
  }
  grade: Grade
  colors: Color[]
  uploadedBy: {
    id: string
    username: string
  }
  verifiedSetter?: {
    id: string
    username: string
  } | null
}

// Request types
export interface CreateBoulderRequest {
  wallId: string
  gradeId: string
  name: string
  imageUrl: string
  colorIds: string[]
  verifiedSetterId?: string
  unverifiedSetterName?: string
}

export interface UpdateBoulderRequest {
  name?: string
  imageUrl?: string
  gradeId?: string
  colorIds?: string[]
  status?: BoulderStatus
}
