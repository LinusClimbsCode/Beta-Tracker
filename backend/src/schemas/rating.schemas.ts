import z from 'zod'

export const createRatingSchema = z.object({
  boulderId: z.string().cuid({ message: 'Invalid boulder ID' }),
  gradeRating: z.enum(['easy', 'appropriate', 'hard'], { message: 'Grade rating must be easy, appropriate, or hard' }),
  qualityRating: z.enum(['liked', 'neutral', 'disliked'], { message: 'Quality rating must be liked, neutral, or disliked' }),
  comment: z.string().optional().default('')
}).strict()

export const updateRatingSchema = z.object({
  gradeRating: z.enum(['easy', 'appropriate', 'hard']).optional(),
  qualityRating: z.enum(['liked', 'neutral', 'disliked']).optional(),
  comment: z.string().optional()
}).strict()
