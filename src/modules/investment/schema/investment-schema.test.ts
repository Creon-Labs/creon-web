import { describe, expect, it } from "vitest"

import { investmentSchema } from "./investment-schema"

describe("investment schema", () => {
  it.each(["1", "0.0000001", "500.1234567", " 25.5 "])(
    "accepts a positive USDC decimal string: %s",
    (amount) => {
      expect(investmentSchema.safeParse({ amount }).success).toBe(true)
    }
  )

  it.each(["0", "0.0000000", "1.12345678", ".5", "-1", "1e2", ""])(
    "rejects an invalid investment amount: %s",
    (amount) => {
      expect(investmentSchema.safeParse({ amount }).success).toBe(false)
    }
  )

  it("keeps the API amount as a string", () => {
    expect(investmentSchema.safeParse({ amount: 100 }).success).toBe(false)
  })
})
