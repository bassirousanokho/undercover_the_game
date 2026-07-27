import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GameState, Lang, Player, RoleCounts, WordPair } from './types'
import { assignRoles, buildSeatOrder, buildTurnOrder, defaultRoleCounts } from './roleAssignment'
import { checkImmediateWin } from './winConditions'
import { isGuessCorrect } from './normalizeGuess'

interface SetupSnapshot {
  playerNames: string[]
  roleCounts: RoleCounts
}

interface GameStore extends GameState {
  seatOrder: string[]
  roundStartSeatIndex: number
  lastSetup: SetupSnapshot | null

  setLang: (lang: Lang) => void
  startGame: (setup: SetupSnapshot & { wordPair: WordPair }) => void
  revealAdvance: () => void
  clueAdvance: () => void
  castVote: (targetId: string) => void
  continueAfterElimination: () => void
  submitMrWhiteGuess: (guess: string, forceCorrect?: boolean) => void
  playAgainSamePlayers: (wordPair: WordPair) => void
  resetToSetup: () => void
}

const initialGameState: GameState = {
  phase: 'setup',
  lang: 'fr',
  players: [],
  round: 1,
  turnOrder: [],
  currentTurnIndex: 0,
  votes: {},
  currentVoterIndex: 0,
  eliminatedThisRound: [],
  tieBreakCandidates: null,
  winner: null,
  wordPair: null,
  revealIndex: 0,
}

function startRound(players: Player[], seatOrder: string[], roundStartSeatIndex: number) {
  const turnOrder = buildTurnOrder(seatOrder, roundStartSeatIndex, players)
  return { turnOrder, currentTurnIndex: 0, votes: {}, currentVoterIndex: 0, tieBreakCandidates: null }
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialGameState,
      seatOrder: [],
      roundStartSeatIndex: 0,
      lastSetup: null,

      setLang: (lang) => set({ lang }),

      startGame: ({ playerNames, roleCounts, wordPair }) => {
        const players = assignRoles(playerNames, roleCounts, wordPair, get().lang)
        const seatOrder = buildSeatOrder(players)
        set({
          ...initialGameState,
          lang: get().lang,
          phase: 'reveal',
          players,
          wordPair,
          seatOrder,
          roundStartSeatIndex: 0,
          revealIndex: 0,
          round: 1,
          lastSetup: { playerNames, roleCounts },
        })
      },

      revealAdvance: () => {
        const { players, revealIndex, seatOrder, roundStartSeatIndex } = get()
        const nextIndex = revealIndex + 1
        if (nextIndex >= players.length) {
          set({
            phase: 'clue',
            revealIndex: nextIndex,
            ...startRound(players, seatOrder, roundStartSeatIndex),
          })
        } else {
          set({ revealIndex: nextIndex })
        }
      },

      clueAdvance: () => {
        const { turnOrder, currentTurnIndex } = get()
        const nextIndex = currentTurnIndex + 1
        if (nextIndex >= turnOrder.length) {
          set({ phase: 'vote', currentTurnIndex: nextIndex })
        } else {
          set({ currentTurnIndex: nextIndex })
        }
      },

      castVote: (targetId) => {
        const state = get()
        const voterId = state.turnOrder[state.currentVoterIndex]
        const votes = { ...state.votes, [voterId]: targetId }
        const nextVoterIndex = state.currentVoterIndex + 1

        if (nextVoterIndex < state.turnOrder.length) {
          set({ votes, currentVoterIndex: nextVoterIndex })
          return
        }

        const tally: Record<string, number> = {}
        for (const target of Object.values(votes)) {
          tally[target] = (tally[target] ?? 0) + 1
        }
        const maxVotes = Math.max(...Object.values(tally))
        const topCandidates = Object.keys(tally).filter((id) => tally[id] === maxVotes)

        if (topCandidates.length > 1 && !state.tieBreakCandidates) {
          set({ votes: {}, currentVoterIndex: 0, tieBreakCandidates: topCandidates })
          return
        }

        const eliminatedId =
          topCandidates.length === 1
            ? topCandidates[0]
            : topCandidates[Math.floor(Math.random() * topCandidates.length)]

        const players = state.players.map((p) => (p.id === eliminatedId ? { ...p, alive: false } : p))
        set({ players, votes, phase: 'elimination', eliminatedThisRound: [eliminatedId], tieBreakCandidates: null })
      },

      continueAfterElimination: () => {
        const state = get()
        const eliminatedId = state.eliminatedThisRound[0]
        const eliminated = state.players.find((p) => p.id === eliminatedId)

        if (eliminated?.role === 'mrwhite') {
          set({ phase: 'mrwhite-guess' })
          return
        }

        const winner = checkImmediateWin(state.players)
        if (winner) {
          set({ phase: 'gameover', winner })
          return
        }

        const nextRoundStartSeatIndex = (state.roundStartSeatIndex + 1) % state.seatOrder.length
        set({
          phase: 'clue',
          round: state.round + 1,
          roundStartSeatIndex: nextRoundStartSeatIndex,
          eliminatedThisRound: [],
          ...startRound(state.players, state.seatOrder, nextRoundStartSeatIndex),
        })
      },

      submitMrWhiteGuess: (guess, forceCorrect) => {
        const state = get()
        const civilianWord = state.wordPair?.civilian[state.lang] ?? ''
        const correct = forceCorrect || isGuessCorrect(guess, civilianWord)

        if (correct) {
          set({ phase: 'gameover', winner: 'mrwhite' })
          return
        }

        const winner = checkImmediateWin(state.players)
        if (winner) {
          set({ phase: 'gameover', winner })
          return
        }

        const nextRoundStartSeatIndex = (state.roundStartSeatIndex + 1) % state.seatOrder.length
        set({
          phase: 'clue',
          round: state.round + 1,
          roundStartSeatIndex: nextRoundStartSeatIndex,
          eliminatedThisRound: [],
          ...startRound(state.players, state.seatOrder, nextRoundStartSeatIndex),
        })
      },

      playAgainSamePlayers: (wordPair) => {
        const { lastSetup } = get()
        if (!lastSetup) return
        get().startGame({ ...lastSetup, wordPair })
      },

      resetToSetup: () => set({ ...initialGameState, lang: get().lang, seatOrder: [], roundStartSeatIndex: 0 }),
    }),
    { name: 'undercover-game-state', skipHydration: true },
  ),
)

export { defaultRoleCounts }
