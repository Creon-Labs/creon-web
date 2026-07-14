import { z } from "zod"

// Regex pattern matching API: ^\\d+(\\.\\d{1,7})?$, value must be > 0
const decimalAmountString = z
  .string()
  .trim()
  .regex(/^\d+(\.\d{1,7})?$/, {
    message: "Must be a valid decimal number (up to 7 decimal places)",
  })
  .refine((val) => parseFloat(val) > 0, {
    message: "Amount must be greater than 0",
  })

export const milestoneSchema = z.object({
  order: z.number().int().min(1),
  title: z
    .string()
    .trim()
    .min(1, "Milestone title is required")
    .max(255, "Milestone title must be at most 255 characters"),
  description: z
    .string()
    .trim()
    .min(1, "Milestone description is required")
    .max(5000, "Milestone description must be at most 5000 characters"),
  amount: decimalAmountString,
})

export const createProposalSchema = z.object({
  businessName: z
    .string()
    .trim()
    .min(1, "Business name is required")
    .max(255, "Business name must be at most 255 characters"),
  businessDescription: z
    .string()
    .trim()
    .min(1, "Business description is required")
    .max(5000, "Business description must be at most 5000 characters"),
  category: z
    .string()
    .trim()
    .min(1, "Category is required")
    .max(100, "Category must be at most 100 characters"),
  location: z
    .string()
    .trim()
    .max(255, "Location must be at most 255 characters")
    .optional()
    .or(z.literal("")),
  requestedAmount: decimalAmountString,
  lockPeriodDays: z.coerce
    .number()
    .int("Lock period must be a whole number")
    .min(1, "Lock period must be at least 1 day")
    .max(3650, "Lock period must be at most 3650 days"),
  milestones: z
    .array(milestoneSchema)
    .min(1, "At least one milestone is required"),
  images: z
    .array(z.custom<File>((val) => val instanceof File, "Must be a file"))
    .max(5, "Maximum 5 images allowed")
    .optional(),
  documents: z
    .array(z.custom<File>((val) => val instanceof File, "Must be a file"))
    .max(3, "Maximum 3 documents allowed")
    .optional(),
})

export type CreateProposalFormValues = z.input<typeof createProposalSchema>
export type CreateProposalFormOutput = z.output<typeof createProposalSchema>
