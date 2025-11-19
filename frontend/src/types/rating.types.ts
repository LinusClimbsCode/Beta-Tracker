import type { GradeRating, QualityRating } from './common.types'

// Rating type (as returned by API)
export interface Rating {
  id: string
  boulderId: string
  userId: string
  gradeRating: GradeRating
  qualityRating: QualityRating
  comment: string
  createdAt: string
  updatedAt: string
}

// Rating with relations
export interface RatingWithRelations extends Rating {
  user: {
    id: string
    username: string
  }
  boulder: {
    id: string
    name: string
    wall: {
      name: string
      gym: {
        name: string
      }
    }
  }
}

// Request types
export interface CreateRatingRequest {
  boulderId: string
  gradeRating: GradeRating
  qualityRating: QualityRating
  comment?: string
}

export interface UpdateRatingRequest {
  gradeRating?: GradeRating
  qualityRating?: QualityRating
  comment?: string
}

// Rating statistics (returned by GET /rating/boulder/:boulderId)
export interface RatingStats {
  gradeStats: {
    easy: number
    appropriate: number
    hard: number
    total: number
  }
  qualityStats: {
    liked: number
    neutral: number
    disliked: number
    total: number
  }
}

export interface BoulderRatingsResponse {
  ratings: RatingWithRelations[]
  stats: RatingStats
}
