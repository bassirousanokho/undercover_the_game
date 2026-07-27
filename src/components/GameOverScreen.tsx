'use client'

import { useGameStore } from '@/lib/gameStore'
import { pickWordPair } from '@/lib/wordBank'
import { useT } from '@/lib/i18n/useT'
import { ScoreTable } from './ScoreTable'

export function GameOverScreen() {
  const t = useT()
  const players = useGameStore((s) => s.players)
  const winner = useGameStore((s) => s.winner)
  const wordPair = useGameStore((s) => s.wordPair)
  const lang = useGameStore((s) => s.lang)
  const playAgainSamePlayers = useGameStore((s) => s.playAgainSamePlayers)
  const resetToSetup = useGameStore((s) => s.resetToSetup)

  if (!winner || !wordPair) return null

  const winnerLabel =
    winner === 'civilians'
      ? t('gameover.civiliansWin')
      : winner === 'undercover'
        ? t('gameover.undercoverWins')
        : t('gameover.mrwhiteWins')

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-6 p-4 pt-16 text-center">
      <p className="text-sm text-neutral-500">{t('gameover.title')}</p>
      <h2 className="text-3xl font-bold">{winnerLabel}</h2>

      <p className="text-neutral-500">
        {t('gameover.wordsWere', {
          civilian: wordPair.civilian[lang],
          undercover: wordPair.undercover[lang],
        })}
      </p>

      <div className="flex w-full flex-col gap-2">
        <h3 className="text-left font-semibold">{t('gameover.rolesReveal')}</h3>
        {players.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between rounded-lg border border-neutral-300 px-4 py-2 dark:border-neutral-700"
          >
            <span className={p.alive ? '' : 'text-neutral-400 line-through'}>{p.name}</span>
            <span className="font-medium">{t(`roles.${p.role}`)}</span>
          </div>
        ))}
      </div>

      <ScoreTable />

      <div className="flex w-full flex-col gap-3">
        <button
          onClick={() => playAgainSamePlayers(pickWordPair(wordPair.theme))}
          className="rounded-xl bg-neutral-900 px-6 py-3 font-semibold text-white dark:bg-white dark:text-neutral-900"
        >
          {t('gameover.playAgain')}
        </button>
        <button
          onClick={resetToSetup}
          className="rounded-xl border border-neutral-400 px-6 py-3 font-medium dark:border-neutral-600"
        >
          {t('gameover.newGame')}
        </button>
      </div>
    </div>
  )
}
