'use client'

import { useGameStore } from '@/lib/gameStore'
import { useT } from '@/lib/i18n/useT'

export function ScoreTable() {
  const t = useT()
  const scores = useGameStore((s) => s.scores)

  const ranked = Object.entries(scores).sort(
    ([nameA, a], [nameB, b]) => b - a || nameA.localeCompare(nameB),
  )

  if (ranked.length === 0) return null

  return (
    <div className="flex w-full flex-col gap-2">
      <h3 className="text-left font-semibold">{t('scores.title')}</h3>
      {ranked.map(([name, count]) => (
        <div
          key={name}
          className="flex items-center justify-between rounded-lg border border-neutral-300 px-4 py-2 dark:border-neutral-700"
        >
          <span>{name}</span>
          <span className="font-medium">{t(count === 1 ? 'scores.points' : 'scores.pointsPlural', { count })}</span>
        </div>
      ))}
    </div>
  )
}
