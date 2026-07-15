import { describe, expect, it } from "vitest"

import { createProposalSchema, decimalAmountToStroops } from "./proposal-schema"

const validValues = {
  businessName: "Warung Kopi Nusantara",
  businessDescription: "Kedai kopi untuk komunitas setempat.",
  category: "Food & Beverage",
  location: "Yogyakarta",
  requestedAmount: "1.0000001",
  lockPeriodDays: 180,
  milestones: [
    {
      order: 1,
      title: "Persiapan",
      description: "Pembelian bahan dan peralatan awal.",
      amount: "0.5000000",
    },
    {
      order: 2,
      title: "Operasional",
      description: "Biaya operasional pembukaan.",
      amount: "0.5000001",
    },
  ],
  images: [],
  documents: [],
  existingImageCount: 0,
  existingDocumentCount: 0,
}

function makeFile(name: string, type: string, size = 1) {
  return new File([new Uint8Array(size)], name, { type })
}

describe("createProposalSchema", () => {
  it("compares milestone totals as exact stroops", () => {
    expect(decimalAmountToStroops("0.5000001")).toBe("5000001")
    expect(createProposalSchema.safeParse(validValues).success).toBe(true)

    const result = createProposalSchema.safeParse({
      ...validValues,
      milestones: [
        ...validValues.milestones.slice(0, 1),
        { ...validValues.milestones[1], amount: "0.5000000" },
      ],
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({
          path: ["milestones"],
          message: "Milestone amounts must sum exactly to the requested amount",
        })
      )
    }
  })

  it("validates MIME type, size, and the total count including stored media", () => {
    const result = createProposalSchema.safeParse({
      ...validValues,
      images: [makeFile("proof.gif", "image/gif")],
      documents: [
        makeFile("too-large.pdf", "application/pdf", 5 * 1024 * 1024 + 1),
      ],
      existingImageCount: 5,
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      const messages = result.error.issues.map((issue) => issue.message)
      expect(messages).toContain("Images must be JPEG, PNG, or WebP files")
      expect(messages).toContain("Each file must be 5 MB or smaller")
      expect(messages).toContain(
        "A proposal may have at most 5 images in total"
      )
    }
  })
})
