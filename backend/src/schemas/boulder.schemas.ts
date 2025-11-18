import z from 'zod'

export const createBoulderSchema = z.object({
  wallId: z.string().cuid({ message: 'Invalid wall ID' }),
  name: z.string().min(2).max(100).optional(),
  setGradeId: z.string().cuid({ message: 'Invalid grade ID' }),
  verifiedSetterId: z.string().cuid({ message: 'Invalid setter ID' }).optional(),
  unverifiedSetterName: z.string().min(2).max(100).optional(),
  colorIds: z.array(z.string().cuid({ message: 'Invalid color ID' })).min(1, { message: 'At least one color is required' })
}).strict().refine(
  (data) => {
    // Must have EITHER verifiedSetterId OR unverifiedSetterName (not both, not neither)
    const hasVerified = !!data.verifiedSetterId
    const hasUnverified = !!data.unverifiedSetterName
    return (hasVerified && !hasUnverified) || (!hasVerified && hasUnverified)
  },
  {
    message: 'Must provide either verifiedSetterId or unverifiedSetterName (not both)'
  }
)

export const updateBoulderSchema = z.object({
  wallId: z.string().cuid({ message: 'Invalid wall ID' }).optional(),
  name: z.string().min(2).max(100).optional(),
  setGradeId: z.string().cuid({ message: 'Invalid grade ID' }).optional(),
  verifiedSetterId: z.string().cuid({ message: 'Invalid setter ID' }).optional(),
  unverifiedSetterName: z.string().min(2).max(100).optional(),
  colorIds: z.array(z.string().cuid({ message: 'Invalid color ID' })).min(1).optional(),
  status: z.enum(['pending', 'approved', 'rejected']).optional()
}).strict()

export const boulderQuerySchema = z.object({
  wallId: z.string().cuid({ message: 'Invalid wall ID' }).optional(),
  gymId: z.string().cuid({ message: 'Invalid gym ID' }).optional(),
  setterId: z.string().cuid({ message: 'Invalid setter ID' }).optional(),
  uploadedById: z.string().cuid({ message: 'Invalid uploader ID' }).optional(),
  status: z.enum(['pending', 'approved', 'rejected']).optional()
})
