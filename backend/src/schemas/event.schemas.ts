import z from 'zod'

export const createEventSchema = z.object({
  gymId: z.string().cuid({ message: 'Invalid gym ID' }),
  title: z.string({ message: 'Title must be a string' }).min(2).max(200),
  eventType: z.array(z.enum(['competition', 'communityEvent', 'communityNight', 'party'])).min(1, { message: 'At least one event type is required' }),
  description: z.string({ message: 'Description must be a string' }).min(10),
  imageUrl: z.string().url({ message: 'Invalid image URL' }).optional(),
  startTime: z.string({ message: 'Start time must be a string' }),
  endTime: z.string({ message: 'End time must be a string' }),
  price: z.string({ message: 'Price must be a string' }),
  registrationLink: z.string().url({ message: 'Invalid registration link' }),
  isActive: z.boolean({ message: 'isActive must be a boolean' })
}).strict()

export const updateEventSchema = z.object({
  gymId: z.string().cuid({ message: 'Invalid gym ID' }).optional(),
  title: z.string().min(2).max(200).optional(),
  eventType: z.array(z.enum(['competition', 'communityEvent', 'communityNight', 'party'])).min(1).optional(),
  description: z.string().min(10).optional(),
  imageUrl: z.string().url({ message: 'Invalid image URL' }).optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  price: z.string().optional(),
  registrationLink: z.string().url({ message: 'Invalid registration link' }).optional(),
  isActive: z.boolean().optional()
}).strict()

export const eventQuerySchema = z.object({
  gymId: z.string().cuid({ message: 'Invalid gym ID' }).optional(),
  city: z.string().min(2).optional(),
  isActive: z.string().optional() // Will be converted to boolean
})
