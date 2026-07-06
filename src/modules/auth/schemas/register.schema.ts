import { z } from "zod"

export const registerSchema = z
  .object({
    role: z.enum(["ENTREPRENEUR", "INVESTOR"], {
      error: "Please select your role",
    }),
    displayName: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be at most 100 characters"),
    email: z
      .string()
      .email("Invalid email format")
      .or(z.literal(""))
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === "ENTREPRENEUR" && !data.email) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Email is required for Entrepreneurs",
        path: ["email"],
      })
    }
  })

export type RegisterFormValues = z.infer<typeof registerSchema>
