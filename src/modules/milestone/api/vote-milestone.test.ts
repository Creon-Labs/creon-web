import { beforeEach, describe, expect, it, vi } from "vitest"

const queryClient = vi.hoisted(() => ({
  invalidateQueries: vi.fn(),
}))

vi.mock("@tanstack/react-query", () => ({
  useMutation: vi.fn(),
  useQueryClient: vi.fn(() => queryClient),
}))

vi.mock("@/shared/lib/api-client", () => ({
  api: {
    post: vi.fn(),
  },
}))

import { useMutation } from "@tanstack/react-query"
import { api } from "@/shared/lib/api-client"
import { useVoteMilestone, voteMilestone } from "./vote-milestone"

const mockedPost = vi.mocked(api.post)
const mockedUseMutation = vi.mocked(useMutation)

describe("milestone voting API", () => {
  beforeEach(() => {
    mockedPost.mockReset()
    mockedUseMutation.mockReset()
    queryClient.invalidateQueries.mockReset()
  })

  it.each(["APPROVE", "REJECT"] as const)(
    "sends and unwraps a %s vote",
    async (choice) => {
      const response = {
        statusCode: 200,
        message: "Ballot recorded",
        data: {
          milestoneId: "milestone-1",
          choice,
          weight: "500.0000000",
        },
      }
      mockedPost.mockResolvedValue(response as never)

      await expect(
        voteMilestone({ milestoneId: "milestone-1", choice })
      ).resolves.toEqual(response.data)

      expect(mockedPost).toHaveBeenCalledWith("/milestones/milestone-1/vote", {
        choice,
      })
    }
  )

  it("invalidates the milestone detail after a successful vote", async () => {
    useVoteMilestone()

    const mutationOptions = mockedUseMutation.mock.calls[0][0]
    const vote = {
      milestoneId: "milestone-1",
      choice: "APPROVE" as const,
      weight: "500.0000000",
    }

    await mutationOptions.onSuccess?.(
      vote,
      { milestoneId: "milestone-1", choice: "APPROVE" },
      undefined,
      undefined as never
    )

    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["milestone", "milestone-1"],
    })
  })
})
