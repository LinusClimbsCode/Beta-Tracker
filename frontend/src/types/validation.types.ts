import { ValidationVote } from './common.types'

// BoulderValidation type (as returned by API)
export interface BoulderValidation {
  id: string
  boulderId: string
  userId: string
  validation: ValidationVote
  createdAt: string
}

// Validation with relations
export interface ValidationWithRelations extends BoulderValidation {
  user: {
    id: string
    username: string
    validationPower: number
  }
  boulder: {
    id: string
    name: string
    status: string
  }
}

// Request types
export interface ValidateBoulderRequest {
  boulderId: string
  validation: ValidationVote
}

// Validation stats (returned by GET /validation/boulder/:id)
export interface ValidationStats {
  approvals: number
  rejections: number
  flags: number
  totalPoints: number
  requiredPoints: number
}
