import z from "zod";

export const createWallSchema = z
  .object({
    gymId: z.string().cuid({ message: "Invalid gym ID" }),
    name: z.string({ message: "Name must be a string" }).min(2).max(100),
    description: z.string({ message: "Description must be a string" }).min(10),
    imageUrl: z.string().url({ message: "Invalid image URL" }),
    wallType: z.array(z.enum(["overhang", "slab", "vertical", "roof"])),
    isActive: z.boolean({ message: "isActive must be a boolean" }),
    lastReset: z.coerce
      .date()
      .max(new Date(), { message: "Cannot set future date" })
      .optional(),
  })
  .strict();

export const updateWallSchema = z
  .object({
    gymId: z.string().cuid({ message: "Invalid gym ID" }).optional(),
    name: z.string().min(2).max(100).optional(),
    description: z.string().min(10).optional(),
    imageUrl: z.string().url({ message: "Invalid image URL" }).optional(),
    wallType: z
      .array(z.enum(["overhang", "slab", "vertical", "roof"]))
      .optional(),
    isActive: z.boolean().optional(),
    lastReset: z.coerce
      .date()
      .max(new Date(), { message: "Cannot set future date" })
      .optional(),
  })
  .strict();

export const wallQuerySchema = z.object({
  gymId: z.string().cuid({ message: "Invalid gym ID" }).optional(),
  city: z.string().min(2).optional(),
  setterId: z.string().cuid({ message: "Invalid setter ID" }).optional(),
});
// TODO fix check per request
