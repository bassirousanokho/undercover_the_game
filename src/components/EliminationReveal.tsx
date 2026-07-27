'use client'

import { useGameStore } from '@/lib/gameStore'
import { useT } from '@/lib/i18n/useT'

export function EliminationReveal() {
  const t = useT()
  const players = useGameStore((s) => s.players)
  const eliminatedThisRound = useGameStore((s) => s.eliminatedThisRound)
  const continueAfterElimination = useGameStore((s) => s.continueAfterElimination)

  const eliminated = players.find((p) => p.id === eliminatedThisRound[0])
  if (!eliminated) return null

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-8 p-4 pt-16 text-center">
      <p className="text-sm text-neutral-500">{t('elimination.title')}</p>
      <h2 className="text-2xl font-bold">{t('elimination.eliminated', { name: eliminated.name })}</h2>
      <p className="rounded-xl border border-neutral-300 px-6 py-4 text-lg font-semibold dark:border-neutral-700">
        {t('elimination.wasA', { role: t(`roles.${eliminated.role}`) })}
      </p>
      <button
        onClick={continueAfterElimination}
        className="rounded-xl bg-neutral-900 px-8 py-3 text-lg font-semibold text-white dark:bg-white dark:text-neutral-900"
      >
        {t('elimination.continue')}
      </button>
    </div>
  )
}
