'use client'

import { useGameStore } from '@/lib/gameStore'

export function LanguageToggle() {
  const lang = useGameStore((s) => s.lang)
  const setLang = useGameStore((s) => s.setLang)

  return (
    <div className="flex overflow-hidden rounded-full border border-neutral-300 text-sm dark:border-neutral-700">
      <button
        onClick={() => setLang('fr')}
        className={`px-3 py-1 ${lang === 'fr' ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900' : ''}`}
      >
        FR
      </button>
      <button
        onClick={() => setLang('en')}
        className={`px-3 py-1 ${lang === 'en' ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900' : ''}`}
      >
        EN
      </button>
    </div>
  )
}
