export type QuorumSafeguardInput = {
  quorumBps: number
  quorumMet: boolean
  votingExtended?: boolean
}

export type QuorumSafeguardCopy = {
  title: string
  description: string
}

export function getQuorumSafeguardCopy({
  quorumBps,
  quorumMet,
  votingExtended = false,
}: QuorumSafeguardInput): QuorumSafeguardCopy {
  const quorumPercentage = quorumBps / 100

  if (votingExtended && quorumMet) {
    return {
      title: "Extended voting has reached quorum",
      description: `This is the one-time extended window, and participation now meets the ${quorumPercentage}% quorum. The approval threshold will determine the result when voting closes; automatic approval is used only if an extended window ends without quorum.`,
    }
  }

  if (votingExtended) {
    return {
      title: "One-time voting extension is active",
      description: `The original window ended below the ${quorumPercentage}% quorum, so voting was extended automatically once. If participation is still below quorum when this deadline passes, the milestone will be approved automatically so low participation cannot block the release indefinitely.`,
    }
  }

  if (quorumMet) {
    return {
      title: "Quorum has been reached",
      description: `Participation currently meets the ${quorumPercentage}% quorum. If the original window had ended below quorum, voting would extend automatically once; only another quorum miss at the extended deadline would trigger automatic approval.`,
    }
  }

  return {
    title: "Quorum has not been reached yet",
    description: `If participation remains below the ${quorumPercentage}% quorum at this deadline, voting will extend automatically once. If quorum is still missing when that extended window ends, the milestone will be approved automatically so passive investors cannot block the release indefinitely.`,
  }
}
