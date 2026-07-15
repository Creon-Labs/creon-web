export type VotingCountdown = {
  isOpen: boolean
  label: string
}

const SECOND_MS = 1000
const MINUTE_MS = 60 * SECOND_MS
const HOUR_MS = 60 * MINUTE_MS
const DAY_MS = 24 * HOUR_MS

export function getVotingCountdown(
  votingEndsAt: string | null,
  now: number
): VotingCountdown {
  if (!votingEndsAt) {
    return { isOpen: false, label: "No deadline available" }
  }

  const deadline = new Date(votingEndsAt).getTime()
  if (Number.isNaN(deadline)) {
    return { isOpen: false, label: "Invalid voting deadline" }
  }

  const remaining = deadline - now
  if (remaining <= 0) {
    return { isOpen: false, label: "Voting has ended" }
  }

  const days = Math.floor(remaining / DAY_MS)
  const hours = Math.floor((remaining % DAY_MS) / HOUR_MS)
  const minutes = Math.floor((remaining % HOUR_MS) / MINUTE_MS)
  const seconds = Math.floor((remaining % MINUTE_MS) / SECOND_MS)

  if (days > 0) {
    return { isOpen: true, label: `${days}d ${hours}h ${minutes}m` }
  }

  if (hours > 0) {
    return { isOpen: true, label: `${hours}h ${minutes}m ${seconds}s` }
  }

  return { isOpen: true, label: `${minutes}m ${seconds}s` }
}
