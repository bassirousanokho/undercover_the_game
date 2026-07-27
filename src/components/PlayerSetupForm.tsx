'use client'

import { useMemo, useState } from 'react'
import { useGameStore, defaultRoleCounts } from '@/lib/gameStore'
import { isRoleCountValid } from '@/lib/roleAssignment'
import { THEMES, pickWordPair } from '@/lib/wordBank'
import { useT } from '@/lib/i18n/useT'
import { LanguageToggle } from './LanguageToggle'
import { ScoreTable } from './ScoreTable'

const THEME_LABELS: Record<string, { fr: string; en: string }> = {
  animals: { fr: 'Animaux', en: 'Animals' },
  food: { fr: 'Nourriture', en: 'Food' },
  jobs: { fr: 'Métiers', en: 'Jobs' },
  objects: { fr: 'Objets', en: 'Objects' },
  places: { fr: 'Lieux', en: 'Places' },
  sports: { fr: 'Sport', en: 'Sports' },
  nature: { fr: 'Nature', en: 'Nature' },
}

export function PlayerSetupForm() {
  const t = useT()
  const lang = useGameStore((s) => s.lang)
  const lastSetup = useGameStore((s) => s.lastSetup)
  const startGame = useGameStore((s) => s.startGame)

  const [playerNames, setPlayerNames] = useState<string[]>(
    lastSetup?.playerNames ?? ['', '', ''],
  )
  const [roleCounts, setRoleCounts] = useState(
    lastSetup?.roleCounts ?? defaultRoleCounts(3),
  )
  const [theme, setTheme] = useState<string>('')

  const trimmedNames = playerNames.map((n) => n.trim())
  const filledNames = trimmedNames.filter((n) => n.length > 0)
  const hasDuplicates = new Set(filledNames).size !== filledNames.length
  const hasEnoughPlayers = filledNames.length >= 3 && filledNames.length === playerNames.length
  const rolesValid = isRoleCountValid(playerNames.length, roleCounts)
  const canStart = hasEnoughPlayers && !hasDuplicates && rolesValid

  function updateName(index: number, value: string) {
    setPlayerNames((prev) => prev.map((n, i) => (i === index ? value : n)))
  }

  function addPlayer() {
    setPlayerNames((prev) => {
      const next = [...prev, '']
      setRoleCounts(defaultRoleCounts(next.length))
      return next
    })
  }

  function removePlayer(index: number) {
    setPlayerNames((prev) => {
      const next = prev.filter((_, i) => i !== index)
      setRoleCounts((rc) => (isRoleCountValid(next.length, rc) ? rc : defaultRoleCounts(next.length)))
      return next
    })
  }

  function handleStart() {
    const wordPair = pickWordPair(theme || undefined)
    startGame({ playerNames: filledNames, roleCounts, wordPair })
  }

  const themeOptions = useMemo(() => THEMES, [])

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('appTitle')}</h1>
          <p className="text-sm text-neutral-500">{t('appTagline')}</p>
        </div>
        <LanguageToggle />
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">{t('setup.playersLabel')}</h2>
        {playerNames.map((name, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={name}
              onChange={(e) => updateName(i, e.target.value)}
              placeholder={`${t('setup.playerNamePlaceholder')} ${i + 1}`}
              className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
            />
            {playerNames.length > 3 && (
              <button
                onClick={() => removePlayer(i)}
                aria-label={t('setup.removePlayer')}
                className="rounded-lg border border-neutral-300 px-3 text-neutral-500 dark:border-neutral-700"
              >
                ×
              </button>
            )}
          </div>
        ))}
        <button
          onClick={addPlayer}
          className="rounded-lg border border-dashed border-neutral-400 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-300"
        >
          + {t('setup.addPlayer')}
        </button>
        {!hasEnoughPlayers && (
          <p className="text-sm text-amber-600">{t('setup.minPlayersWarning')}</p>
        )}
        {hasDuplicates && (
          <p className="text-sm text-amber-600">{t('setup.duplicateNamesWarning')}</p>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">{t('setup.roleSettings')}</h2>
        <div className="flex items-center justify-between">
          <span>{t('roles.undercover')}</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setRoleCounts((rc) => ({ ...rc, undercover: Math.max(0, rc.undercover - 1) }))}
              className="h-8 w-8 rounded-full border border-neutral-300 dark:border-neutral-700"
            >
              −
            </button>
            <span className="w-4 text-center">{roleCounts.undercover}</span>
            <button
              onClick={() => setRoleCounts((rc) => ({ ...rc, undercover: rc.undercover + 1 }))}
              className="h-8 w-8 rounded-full border border-neutral-300 dark:border-neutral-700"
            >
              +
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span>{t('roles.mrwhite')}</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setRoleCounts((rc) => ({ ...rc, mrwhite: Math.max(0, rc.mrwhite - 1) }))}
              className="h-8 w-8 rounded-full border border-neutral-300 dark:border-neutral-700"
            >
              −
            </button>
            <span className="w-4 text-center">{roleCounts.mrwhite}</span>
            <button
              onClick={() => setRoleCounts((rc) => ({ ...rc, mrwhite: rc.mrwhite + 1 }))}
              className="h-8 w-8 rounded-full border border-neutral-300 dark:border-neutral-700"
            >
              +
            </button>
          </div>
        </div>
        {!rolesValid && (
          <p className="text-sm text-amber-600">{t('setup.minPlayersWarning')}</p>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">{t('setup.themeLabel')}</h2>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
        >
          <option value="">{t('setup.anyTheme')}</option>
          {themeOptions.map((th) => (
            <option key={th} value={th}>
              {THEME_LABELS[th]?.[lang] ?? th}
            </option>
          ))}
        </select>
      </section>

      <ScoreTable />

      <button
        onClick={handleStart}
        disabled={!canStart}
        className="rounded-xl bg-neutral-900 py-3 text-lg font-semibold text-white disabled:opacity-40 dark:bg-white dark:text-neutral-900"
      >
        {t('setup.startGame')}
      </button>
    </div>
  )
}
