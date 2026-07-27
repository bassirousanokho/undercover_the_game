'use client'

import { useState } from 'react'
import { useGameStore } from '@/lib/gameStore'
import { isGuessCorrect } from '@/lib/normalizeGuess'
import { useT } from '@/lib/i18n/useT'

export function MrWhiteGuessForm() {
  const t = useT()
  const players = useGameStore((s) => s.players)
  const eliminatedThisRound = useGameStore((s) => s.eliminatedThisRound)
  const wordPair = useGameStore((s) => s.wordPair)
  const lang = useGameStore((s) => s.lang)
  const submitMrWhiteGuess = useGameStore((s) => s.submitMrWhiteGuess)

  const [guess, setGuess] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const mrWhite = players.find((p) => p.id === eliminatedThisRound[0])
  const civilianWord = wordPair?.civilian[lang] ?? ''
  if (!mrWhite || !wordPair) return null

  const correct = submitted && isGuessCorrect(guess, civilianWord)

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-6 p-4 pt-16 text-center">
      <p className="text-sm text-neutral-500">{t('mrwhiteGuess.title')}</p>
      <h2 className="text-2xl font-bold">{t('mrwhiteGuess.instructions', { name: mrWhite.name })}</h2>

      {!submitted ? (
        <div className="flex w-full flex-col gap-3">
          <input
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder={t('mrwhiteGuess.guessPlaceholder')}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-center dark:border-neutral-700 dark:bg-neutral-900"
            autoFocus
          />
          <button
            onClick={() => setSubmitted(true)}
            disabled={guess.trim().length === 0}
            className="rounded-xl bg-neutral-900 px-6 py-3 font-semibold text-white disabled:opacity-40 dark:bg-white dark:text-neutral-900"
          >
            {t('mrwhiteGuess.submitGuess')}
          </button>
        </div>
      ) : (
        <div className="flex w-full flex-col gap-3">
          <p className={`text-lg font-semibold ${correct ? 'text-green-600' : 'text-red-600'}`}>
            {correct ? t('mrwhiteGuess.correct') : t('mrwhiteGuess.incorrect')}
          </p>
          {!correct && (
            <p className="text-neutral-500">{t('mrwhiteGuess.civilianWordWas', { word: civilianWord })}</p>
          )}
          <button
            onClick={() => submitMrWhiteGuess(guess)}
            className="rounded-xl bg-neutral-900 px-6 py-3 font-semibold text-white dark:bg-white dark:text-neutral-900"
          >
            {t('elimination.continue')}
          </button>
          {!correct && (
            <button
              onClick={() => submitMrWhiteGuess(guess, true)}
              className="rounded-lg border border-neutral-300 px-6 py-2 text-sm text-neutral-500 dark:border-neutral-700"
            >
              {t('mrwhiteGuess.overrideCorrect')}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
