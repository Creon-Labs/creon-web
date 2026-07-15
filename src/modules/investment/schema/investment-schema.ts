import { z } from "zod"

export const investmentSchema = z.object({
  amount: z
    .string()
    .trim()
    .regex(
      /^\d+(?:\.\d{1,7})?$/,
      "Enter a USDC amount with no more than 7 decimal places."
    )
    .refine((value) => /[1-9]/.test(value), {
      message: "Investment amount must be greater than zero.",
    }),
})

export type InvestmentFormValues = z.infer<typeof investmentSchema>
