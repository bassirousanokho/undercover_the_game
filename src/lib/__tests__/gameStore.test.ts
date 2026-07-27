import { beforeEach, describe, expect, it } from 'vitest'
import { useGameStore } from '../gameStore'
import type { WordPair } from '../types'

const wordPair: WordPair = {
  id: 'cat-lion',
  theme: 'animals',
  civilian: { fr: 'Chat', en: 'Cat' },
  undercover: { fr: 'Lion', en: 'Lion' },
}

function revealEveryone() {
  const { players } = useGameStore.getState()
  for (let i = 0; i < players.length; i++) useGameStore.getState().revealAdvance()
}

function idsByRole(role: 'civilian' | 'undercover' | 'mrwhite') {
  return useGameStore
    .getState()
    .players.filter((p) => p.role === role)
    .map((p) => p.id)
}

function runClueRoundToVote() {
  const { turnOrder } = useGameStore.getState()
  for (let i = 0; i < turnOrder.length; i++) useGameStore.getState().clueAdvance()
}

function voteAllFor(targetId: string) {
  const { turnOrder } = useGameStore.getState()
  for (let i = 0; i < turnOrder.length; i++) useGameStore.getState().castVote(targetId)
}

beforeEach(() => {
  useGameStore.getState().resetToSetup()
  useGameStore.getState().resetScores()
})

describe('gameStore full playthrough', () => {
  it('civilians win when both undercover and mrwhite are eliminated and mrwhite guesses wrong', () => {
    useGameStore.getState().startGame({
      playerNames: ['Alice', 'Bob', 'Carol', 'Dave'],
      roleCounts: { undercover: 1, mrwhite: 1 },
      wordPair,
    })
    expect(useGameStore.getState().phase).toBe('reveal')

    revealEveryone()
    expect(useGameStore.getState().phase).toBe('clue')

    runClueRoundToVote()
    expect(useGameStore.getState().phase).toBe('vote')

    const [mrwhiteId] = idsByRole('mrwhite')
    voteAllFor(mrwhiteId)
    expect(useGameStore.getState().phase).toBe('elimination')
    expect(useGameStore.getState().eliminatedThisRound).toEqual([mrwhiteId])

    useGameStore.getState().continueAfterElimination()
    expect(useGameStore.getState().phase).toBe('mrwhite-guess')

    useGameStore.getState().submitMrWhiteGuess('totally wrong word')
    expect(useGameStore.getState().phase).toBe('clue')
    expect(useGameStore.getState().round).toBe(2)

    runClueRoundToVote()
    const [undercoverId] = idsByRole('undercover')
    voteAllFor(undercoverId)
    useGameStore.getState().continueAfterElimination()

    expect(useGameStore.getState().phase).toBe('gameover')
    expect(useGameStore.getState().winner).toBe('civilians')

    const civilianNames = useGameStore
      .getState()
      .players.filter((p) => p.role === 'civilian')
      .map((p) => p.name)
    expect(useGameStore.getState().scores).toEqual(
      Object.fromEntries(civilianNames.map((n) => [n, 1])),
    )
  })

  it('mrwhite wins immediately by guessing the civilian word correctly after being unmasked', () => {
    useGameStore.getState().startGame({
      playerNames: ['Alice', 'Bob', 'Carol', 'Dave'],
      roleCounts: { undercover: 1, mrwhite: 1 },
      wordPair,
    })
    revealEveryone()
    runClueRoundToVote()

    const [mrwhiteId] = idsByRole('mrwhite')
    voteAllFor(mrwhiteId)
    useGameStore.getState().continueAfterElimination()

    useGameStore.getState().submitMrWhiteGuess('Chat')
    expect(useGameStore.getState().phase).toBe('gameover')
    expect(useGameStore.getState().winner).toBe('mrwhite')

    const mrWhiteName = useGameStore.getState().players.find((p) => p.role === 'mrwhite')?.name
    expect(useGameStore.getState().scores).toEqual({ [mrWhiteName as string]: 1 })
  })

  it('accumulates scores across successive games instead of resetting them', () => {
    useGameStore.getState().startGame({
      playerNames: ['Alice', 'Bob', 'Carol'],
      roleCounts: { undercover: 1, mrwhite: 1 },
      wordPair,
    })
    revealEveryone()
    runClueRoundToVote()

    const [civilianId] = idsByRole('civilian')
    voteAllFor(civilianId)
    useGameStore.getState().continueAfterElimination()
    expect(useGameStore.getState().winner).toBe('undercover')

    const scoresAfterGame1 = useGameStore.getState().scores
    expect(Object.values(scoresAfterGame1).reduce((a, b) => a + b, 0)).toBe(1)

    useGameStore.getState().playAgainSamePlayers(wordPair)
    expect(useGameStore.getState().phase).toBe('reveal')
    expect(useGameStore.getState().scores).toEqual(scoresAfterGame1)
  })

  it('undercover wins as soon as it becomes one of the last 2 alive, without needing mrwhite eliminated', () => {
    useGameStore.getState().startGame({
      playerNames: ['Alice', 'Bob', 'Carol'],
      roleCounts: { undercover: 1, mrwhite: 1 },
      wordPair,
    })
    revealEveryone()
    runClueRoundToVote()

    const [civilianId] = idsByRole('civilian')
    voteAllFor(civilianId)
    useGameStore.getState().continueAfterElimination()

    expect(useGameStore.getState().phase).toBe('gameover')
    expect(useGameStore.getState().winner).toBe('undercover')
  })

  it('resolves a tied vote with a revote restricted to tied candidates', () => {
    useGameStore.getState().startGame({
      playerNames: ['Alice', 'Bob', 'Carol', 'Dave'],
      roleCounts: { undercover: 1, mrwhite: 1 },
      wordPair,
    })
    revealEveryone()
    runClueRoundToVote()

    const { turnOrder } = useGameStore.getState()
    const [a, b] = turnOrder

    turnOrder.forEach((voterId, i) => {
      useGameStore.getState().castVote(i % 2 === 0 ? a : b)
    })

    expect(useGameStore.getState().phase).toBe('vote')
    expect(useGameStore.getState().tieBreakCandidates).toEqual(expect.arrayContaining([a, b]))
    expect(useGameStore.getState().votes).toEqual({})

    const revoters = useGameStore.getState().turnOrder
    revoters.forEach(() => useGameStore.getState().castVote(a))

    expect(useGameStore.getState().phase).toBe('elimination')
    expect(useGameStore.getState().eliminatedThisRound).toEqual([a])
  })
})
