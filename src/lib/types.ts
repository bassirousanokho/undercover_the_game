export type Lang = 'fr' | 'en'

export type Role = 'civilian' | 'undercover' | 'mrwhite'

export interface Player {
  id: string
  name: string
  role: Role
  word: string | null
  alive: boolean
  hasSeenWord: boolean
}

export interface WordPair {
  id: string
  theme: string
  civilian: Record<Lang, string>
  undercover: Record<Lang, string>
}

export type Phase =
  | 'setup'
  | 'reveal'
  | 'clue'
  | 'vote'
  | 'elimination'
  | 'mrwhite-guess'
  | 'gameover'

export type Winner = 'civilians' | 'undercover' | 'mrwhite' | null

export interface RoleCounts {
  undercover: number
  mrwhite: number
}

export interface GameState {
  phase: Phase
  lang: Lang
  players: Player[]
  round: number
  turnOrder: string[]
  currentTurnIndex: number
  votes: Record<string, string>
  currentVoterIndex: number
  eliminatedThisRound: string[]
  tieBreakCandidates: string[] | null
  winner: Winner
  wordPair: WordPair | null
  revealIndex: number
}
