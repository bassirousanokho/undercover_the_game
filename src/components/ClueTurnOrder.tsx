'use client'

import { useGameStore } from '@/lib/gameStore'
import { useT } from '@/lib/i18n/useT'

export function ClueTurnOrder() {
  const t = useT()
  const players = useGameStore((s) => s.players)
  const turnOrder = useGameStore((s) => s.turnOrder)
  const currentTurnIndex = useGameStore((s) => s.currentTurnIndex)
  const round = useGameStore((s) => s.round)
  const clueAdvance = useGameStore((s) => s.clueAdvance)

  const currentId = turnOrder[currentTurnIndex]
  const currentPlayer = players.find((p) => p.id === currentId)
  if (!currentPlayer) return null

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-8 p-4 pt-16 text-center">
      <div>
        <p className="text-sm text-neutral-500">{t('clue.title', { round })}</p>
        <p className="mt-2 text-neutral-500">{t('clue.instructions')}</p>
      </div>

      <div className="flex h-40 w-full max-w-xs items-center justify-center rounded-2xl border-2 border-neutral-400 dark:border-neutral-600">
        <h2 className="text-2xl font-bold">{t('clue.currentTurn', { name: currentPlayer.name })}</h2>
      </div>

      <button
        onClick={clueAdvance}
        className="rounded-xl bg-neutral-900 px-8 py-3 text-lg font-semibold text-white dark:bg-white dark:text-neutral-900"
      >
        {currentTurnIndex + 1 >= turnOrder.length ? t('clue.goToVote') : t('clue.nextPlayer')}
      </button>

      <p className="text-sm text-neutral-400">
        {currentTurnIndex + 1} / {turnOrder.length}
      </p>
    </div>
  )
}
