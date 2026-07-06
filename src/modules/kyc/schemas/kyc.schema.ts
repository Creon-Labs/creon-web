import { z } from "zod"

export const kycSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .max(255, "Full name must be at most 255 characters"),
  nationalId: z
    .string()
    .regex(/^\d{16}$/, "National ID (NIK) must be exactly 16 digits"),
  dateOfBirth: z.string().optional(),
  idCard: z
    .string({
      error: "ID Card photo is required",
    })
    .nullable()
    .refine((val) => val !== null, { message: "ID Card photo is required" }),
  selfie: z
    .string({
      error: "Selfie photo is required",
    })
    .nullable()
    .refine((val) => val !== null, { message: "Selfie photo is required" }),
})

export type KycFormValues = z.infer<typeof kycSchema>
