import z from 'zod'

export const createUserBoulderSchema = z.object({
  boulderId: z.string().cuid({ message: 'Invalid boulder ID' }),
  status: z.enum(['project', 'flash', 'top'], { message: 'Status must be project, flash, or top' }),
  attempts: z.number().int().min(1, { message: 'Attempts must be at least 1' })
}).strict()

export const updateUserBoulderSchema = z.object({
  status: z.enum(['project', 'flash', 'top']).optional(),
  attempts: z.number().int().min(1).optional()
}).strict()
