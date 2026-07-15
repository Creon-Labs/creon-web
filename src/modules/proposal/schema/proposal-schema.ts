import { z } from "zod"

export const STROOPS_DECIMALS = 7
export const MAX_PROPOSAL_IMAGES = 5
export const MAX_PROPOSAL_DOCUMENTS = 3
export const MAX_PROPOSAL_FILE_BYTES = 5 * 1024 * 1024

const decimalAmountPattern = /^\d+(\.\d{1,7})?$/

/** Converts an API decimal amount into an exact 7-decimal Stellar unit string. */
export function decimalAmountToStroops(amount: string): string {
  const [whole, fraction = ""] = amount.trim().split(".")
  return `${whole}${fraction.padEnd(STROOPS_DECIMALS, "0")}`.replace(
    /^0+(?=\d)/,
    ""
  )
}

export function compareStroops(left: string, right: string): number {
  if (left.length !== right.length) return left.length - right.length
  return left.localeCompare(right)
}

export function addStroops(left: string, right: string): string {
  let carry = 0
  let result = ""
  let leftIndex = left.length - 1
  let rightIndex = right.length - 1

  while (leftIndex >= 0 || rightIndex >= 0 || carry > 0) {
    const sum =
      (leftIndex >= 0 ? Number(left[leftIndex--]) : 0) +
      (rightIndex >= 0 ? Number(right[rightIndex--]) : 0) +
      carry
    result = `${sum % 10}${result}`
    carry = Math.floor(sum / 10)
  }

  return result.replace(/^0+(?=\d)/, "")
}

export function subtractStroops(
  left: string,
  right: string
): {
  sign: -1 | 0 | 1
  amount: string
} {
  const comparison = compareStroops(left, right)
  if (comparison === 0) return { sign: 0, amount: "0" }

  const [larger, smaller] = comparison > 0 ? [left, right] : [right, left]
  let borrow = 0
  let result = ""

  for (let index = 0; index < larger.length; index++) {
    const largerIndex = larger.length - 1 - index
    const smallerIndex = smaller.length - 1 - index
    let difference = Number(larger[largerIndex]) - borrow
    const subtrahend = smallerIndex >= 0 ? Number(smaller[smallerIndex]) : 0

    if (difference < subtrahend) {
      difference += 10
      borrow = 1
    } else {
      borrow = 0
    }
    result = `${difference - subtrahend}${result}`
  }

  return {
    sign: comparison > 0 ? 1 : -1,
    amount: result.replace(/^0+(?=\d)/, ""),
  }
}

export function formatStroops(amount: string): string {
  const padded = amount.padStart(STROOPS_DECIMALS + 1, "0")
  const whole = padded.slice(0, -STROOPS_DECIMALS)
  const fraction = padded.slice(-STROOPS_DECIMALS)
  return formatDecimalAmount(`${whole}.${fraction}`)
}

/** Formats a decimal amount without coercing it through a floating-point number. */
export function formatDecimalAmount(amount: string): string {
  if (!decimalAmountPattern.test(amount)) return amount

  const [whole, fraction = ""] = amount.split(".")
  const formattedWhole = whole
    .replace(/^0+(?=\d)/, "")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  const formattedFraction = fraction.replace(/0+$/, "")

  return formattedFraction
    ? `${formattedWhole}.${formattedFraction}`
    : formattedWhole
}

// Regex pattern matching API: ^\d+(\.\d{1,7})?$, value must be > 0
export const decimalAmountString = z
  .string()
  .trim()
  .regex(decimalAmountPattern, {
    message: "Must be a valid decimal number (up to 7 decimal places)",
  })
  .refine((val) => decimalAmountToStroops(val) !== "0", {
    message: "Amount must be greater than 0",
  })

function isFile(value: unknown): value is File {
  return typeof File !== "undefined" && value instanceof File
}

const imageFileSchema = z
  .custom<File>(isFile, "Must be a file")
  .refine(
    (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
    "Images must be JPEG, PNG, or WebP files"
  )
  .refine(
    (file) => file.size <= MAX_PROPOSAL_FILE_BYTES,
    "Each file must be 5 MB or smaller"
  )

const documentFileSchema = z
  .custom<File>(isFile, "Must be a file")
  .refine(
    (file) => file.type === "application/pdf",
    "Documents must be PDF files"
  )
  .refine(
    (file) => file.size <= MAX_PROPOSAL_FILE_BYTES,
    "Each file must be 5 MB or smaller"
  )

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

export const createProposalSchema = z
  .object({
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
    images: z.array(imageFileSchema).max(MAX_PROPOSAL_IMAGES).optional(),
    documents: z
      .array(documentFileSchema)
      .max(MAX_PROPOSAL_DOCUMENTS)
      .optional(),
    // Kept in form state so edit validation can include media already stored
    // by the API. These fields are never sent to the proposal endpoints.
    existingImageCount: z.number().int().min(0).default(0),
    existingDocumentCount: z.number().int().min(0).default(0),
  })
  .superRefine((data, ctx) => {
    const milestoneTotal = data.milestones.reduce(
      (total, milestone) =>
        addStroops(total, decimalAmountToStroops(milestone.amount)),
      "0"
    )

    if (
      compareStroops(
        milestoneTotal,
        decimalAmountToStroops(data.requestedAmount)
      ) !== 0
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["milestones"],
        message: "Milestone amounts must sum exactly to the requested amount",
      })
    }

    if (
      data.existingImageCount + (data.images?.length ?? 0) >
      MAX_PROPOSAL_IMAGES
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["images"],
        message: `A proposal may have at most ${MAX_PROPOSAL_IMAGES} images in total`,
      })
    }

    if (
      data.existingDocumentCount + (data.documents?.length ?? 0) >
      MAX_PROPOSAL_DOCUMENTS
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["documents"],
        message: `A proposal may have at most ${MAX_PROPOSAL_DOCUMENTS} documents in total`,
      })
    }
  })

export type CreateProposalFormValues = z.input<typeof createProposalSchema>
export type CreateProposalFormOutput = z.output<typeof createProposalSchema>
