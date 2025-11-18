import z from 'zod'

export const createGradeSchema = z.object({
  gymId: z.string().cuid({ message: 'Invalid gym ID' }),
  value: z.string({ message: 'Value must be a string' }).min(1).max(20),
  displayOrder: z.number({ message: 'Display order must be a number' }).int().min(0)
}).strict()

export const updateGradeSchema = z.object({
  gymId: z.string().cuid({ message: 'Invalid gym ID' }).optional(),
  value: z.string().min(1).max(20).optional(),
  displayOrder: z.number().int().min(0).optional()
}).strict()

export const gradeQuerySchema = z.object({
  gymId: z.string().cuid({ message: 'Invalid gym ID' }).optional()
})
