'use client'

import { useState } from 'react'
import { useGameStore } from '@/lib/gameStore'
import { useT } from '@/lib/i18n/useT'

export function WordRevealCard() {
  const t = useT()
  const players = useGameStore((s) => s.players)
  const revealIndex = useGameStore((s) => s.revealIndex)
  const revealAdvance = useGameStore((s) => s.revealAdvance)
  const [revealed, setRevealed] = useState(false)

  const player = players[revealIndex]
  if (!player) return null

  function handleHideAndPass() {
    setRevealed(false)
    revealAdvance()
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-8 p-4 pt-16 text-center">
      <div>
        <p className="text-sm text-neutral-500">{t('reveal.title')}</p>
        <h2 className="mt-2 text-2xl font-bold">{t('reveal.passTo', { name: player.name })}</h2>
      </div>

      <div className="flex h-56 w-full max-w-xs items-center justify-center rounded-2xl border-2 border-dashed border-neutral-400 dark:border-neutral-600">
        {!revealed ? (
          <button
            onClick={() => setRevealed(true)}
            className="rounded-xl bg-neutral-900 px-6 py-3 font-semibold text-white dark:bg-white dark:text-neutral-900"
          >
            {t('reveal.tapToReveal')}
          </button>
        ) : player.role === 'mrwhite' ? (
          <p className="px-4 text-lg font-semibold text-amber-600">{t('reveal.youAreMrWhite')}</p>
        ) : (
          <div>
            <p className="text-sm text-neutral-500">{t('reveal.yourWord')}</p>
            <p className="mt-1 text-3xl font-bold">{player.word}</p>
          </div>
        )}
      </div>

      {revealed && (
        <button
          onClick={handleHideAndPass}
          className="rounded-xl border border-neutral-400 px-6 py-3 font-medium dark:border-neutral-600"
        >
          {t('reveal.hideAndPass')}
        </button>
      )}

      <p className="text-sm text-neutral-400">
        {revealIndex + 1} / {players.length}
      </p>
    </div>
  )
}
