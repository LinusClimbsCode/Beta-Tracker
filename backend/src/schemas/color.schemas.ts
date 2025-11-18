import z from 'zod'

// Regex for hex color validation: #RGB or #RRGGBB
const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/

export const createColorSchema = z.object({
  name: z.string({ message: 'Name must be a string' }).min(2).max(50),
  hexCode: z.string().regex(hexColorRegex, { message: 'Invalid hex color format. Use #RGB or #RRGGBB' })
}).strict()

export const updateColorSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  hexCode: z.string().regex(hexColorRegex, { message: 'Invalid hex color format. Use #RGB or #RRGGBB' }).optional()
}).strict()
