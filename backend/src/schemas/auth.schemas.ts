import z from "zod";

export const registerInputSchema = z
  .object({
    username: z.string({ message: "Username must be a string" }).max(20),
    email: z.email({ message: "Email has to be a valid email" }),
    password: z
      .string({
        message:
          "Password must be a string, with 8 characters, one uppercase, one number and one spezialsign",
      })
      .min(8)
      .regex(/(?=.*[A-Z])/)
      .regex(/(?=.*[0-9])/)
      .regex(/(?=.*[!@#$%^&*])/),
    name: z.string({ message: "Username must be a string" }).max(20),
    city: z.string({ message: "city must be a string" }).max(20),
  })
  .strict();

export const loginInputSchema = z
  .object({
    email: z.email({ message: "Email has to be a valid email" }),
    password: z
      .string({
        message:
          "Password must be a string, with 8 characters, one uppercase, one number and one spezialsign",
      })
      .min(8),
  })
  .strict();
