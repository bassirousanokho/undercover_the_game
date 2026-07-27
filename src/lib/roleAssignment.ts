import type { Lang, Player, Role, RoleCounts, WordPair } from './types'

export function defaultRoleCounts(playerCount: number): RoleCounts {
  if (playerCount >= 12) return { undercover: 2, mrwhite: 2 }
  if (playerCount >= 8) return { undercover: 2, mrwhite: 1 }
  return { undercover: 1, mrwhite: 1 }
}

export function isRoleCountValid(playerCount: number, counts: RoleCounts): boolean {
  const civilians = playerCount - counts.undercover - counts.mrwhite
  return civilians >= 1 && counts.undercover >= 0 && counts.mrwhite >= 0
}

function shuffle<T>(items: T[]): T[] {
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function assignRoles(
  playerNames: string[],
  counts: RoleCounts,
  wordPair: WordPair,
  lang: Lang,
): Player[] {
  const roles: Role[] = [
    ...Array(counts.undercover).fill('undercover' as const),
    ...Array(counts.mrwhite).fill('mrwhite' as const),
    ...Array(playerNames.length - counts.undercover - counts.mrwhite).fill('civilian' as const),
  ]
  const shuffledRoles = shuffle(roles)

  return playerNames.map((name, index) => {
    const role = shuffledRoles[index]
    const word =
      role === 'civilian'
        ? wordPair.civilian[lang]
        : role === 'undercover'
          ? wordPair.undercover[lang]
          : null
    return {
      id: `p${index}-${Math.random().toString(36).slice(2, 8)}`,
      name,
      role,
      word,
      alive: true,
      hasSeenWord: false,
    }
  })
}

export function buildSeatOrder(players: Player[]): string[] {
  const shuffled = shuffle(players.map((p) => p.id))
  const firstMrWhiteIndex = shuffled.findIndex(
    (id) => players.find((p) => p.id === id)?.role === 'mrwhite',
  )
  if (firstMrWhiteIndex === 0) {
    const firstNonMrWhiteIndex = shuffled.findIndex(
      (id) => players.find((p) => p.id === id)?.role !== 'mrwhite',
    )
    if (firstNonMrWhiteIndex > 0) {
      ;[shuffled[0], shuffled[firstNonMrWhiteIndex]] = [shuffled[firstNonMrWhiteIndex], shuffled[0]]
    }
  }
  return shuffled
}

export function buildTurnOrder(seatOrder: string[], startSeatIndex: number, players: Player[]): string[] {
  const alive = new Set(players.filter((p) => p.alive).map((p) => p.id))
  const rotated = [...seatOrder.slice(startSeatIndex), ...seatOrder.slice(0, startSeatIndex)]
  return rotated.filter((id) => alive.has(id))
}
