import z from 'zod'

export const createBoulderValidationSchema = z.object({
  boulderId: z.string().cuid({ message: 'Invalid boulder ID' }),
  validation: z.enum(['approve', 'reject'], { message: 'Validation must be approve or reject' })
}).strict()
