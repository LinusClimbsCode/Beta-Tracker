import z from "zod";

export const createGymSchema = z
  .object({
    name: z.string({ message: "Name must be a string" }).min(2).max(100),
    type: z.enum(["bouldering", "climbing", "mixed"]),
    address: z.object({
      street: z.string(),
      zipCode: z.string(),
      city: z.string(),
    }),
    city: z.string({ message: "City must be a string" }).min(2).max(50),
    website: z.url(),
    phone: z.string(),
    email: z.email(),
    openingHours: z.object({
      monday: z.string().optional(),
      tuesday: z.string().optional(),
      wednesday: z.string().optional(),
      thursday: z.string().optional(),
      friday: z.string().optional(),
      saturday: z.string().optional(),
      sunday: z.string().optional(),
    }),
    description: z.string().min(10),
    priceInfo: z.object({
      dayPass: z.number().optional(),
      membership: z.number().optional(),
    }),
    imageUrl: z.url(),
    gradeSystemType: z.enum([
      "numeric",
      "french",
      "american",
      "colorBased",
      "uiaa",
    ]),
  })
  .strict();

export const updateGymSchema = z
  .object({
    name: z.string().min(2).max(100).optional(),
    type: z.enum(["bouldering", "climbing", "mixed"]),
    address: z
      .object({
        street: z.string(),
        zipCode: z.string(),
        city: z.string(),
      })
      .optional(),
    city: z.string().min(2).max(50).optional(),
    website: z.url().optional(),
    phone: z.string().optional(),
    email: z.email().optional(),
    openingHours: z
      .object({
        monday: z.string().optional(),
        tuesday: z.string().optional(),
        wednesday: z.string().optional(),
        thursday: z.string().optional(),
        friday: z.string().optional(),
        saturday: z.string().optional(),
        sunday: z.string().optional(),
      })
      .optional(),
    description: z.string().min(10).optional(),
    priceInfo: z
      .object({
        dayPass: z.number().optional(),
        membership: z.number().optional(),
      })
      .optional(),
    imageUrl: z.url().optional(),
    gradeSystemType: z
      .enum(["numeric", "french", "american", "colorBased", "uiaa"])
      .optional(),
    isActive: z.boolean().optional(),
  })
  .strict();
