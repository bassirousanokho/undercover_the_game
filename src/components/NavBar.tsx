'use client'

import { useGameStore } from '@/lib/gameStore'
import { useT } from '@/lib/i18n/useT'
import { pickWordPair } from '@/lib/wordBank'

export function NavBar() {
  const t = useT()
  const phase = useGameStore((s) => s.phase)
  const revealIndex = useGameStore((s) => s.revealIndex)
  const currentTurnIndex = useGameStore((s) => s.currentTurnIndex)
  const currentVoterIndex = useGameStore((s) => s.currentVoterIndex)
  const wordPair = useGameStore((s) => s.wordPair)
  const scores = useGameStore((s) => s.scores)
  const resetToSetup = useGameStore((s) => s.resetToSetup)
  const goToPrevious = useGameStore((s) => s.goToPrevious)
  const playAgainSamePlayers = useGameStore((s) => s.playAgainSamePlayers)
  const resetScores = useGameStore((s) => s.resetScores)

  const canGoPrevious =
    (phase === 'reveal' && revealIndex > 0) ||
    (phase === 'clue' && currentTurnIndex > 0) ||
    (phase === 'vote' && currentVoterIndex > 0)
  const canGoHome = phase !== 'setup'
  const canRestart = phase !== 'setup'
  const hasScores = Object.keys(scores).length > 0

  function handleHome() {
    if (phase === 'gameover' || window.confirm(t('nav.confirmHome'))) {
      resetToSetup()
    }
  }

  function handleRestart() {
    if (phase === 'gameover' || window.confirm(t('nav.confirmRestart'))) {
      playAgainSamePlayers(pickWordPair(wordPair?.theme))
    }
  }

  function handleResetScores() {
    if (window.confirm(t('nav.confirmResetScores'))) {
      resetScores()
    }
  }

  return (
    <div className="flex items-center justify-between gap-2 border-b border-neutral-200 px-3 py-2 text-sm dark:border-neutral-800">
      <div className="flex gap-2">
        {canGoHome && (
          <button onClick={handleHome} className="rounded-lg px-2 py-1 text-neutral-600 dark:text-neutral-300">
            {t('nav.home')}
          </button>
        )}
        {canGoPrevious && (
          <button onClick={goToPrevious} className="rounded-lg px-2 py-1 text-neutral-600 dark:text-neutral-300">
            {t('nav.previous')}
          </button>
        )}
      </div>
      <div className="flex gap-2">
        {canRestart && (
          <button onClick={handleRestart} className="rounded-lg px-2 py-1 text-neutral-600 dark:text-neutral-300">
            {t('nav.restart')}
          </button>
        )}
        {hasScores && (
          <button onClick={handleResetScores} className="rounded-lg px-2 py-1 text-neutral-600 dark:text-neutral-300">
            {t('scores.reset')}
          </button>
        )}
      </div>
    </div>
  )
}
