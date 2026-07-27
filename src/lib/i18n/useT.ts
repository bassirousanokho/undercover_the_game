import { useGameStore } from '../gameStore'
import { translate } from './useTranslation'

export function useT() {
  const lang = useGameStore((s) => s.lang)
  return (key: string, vars?: Record<string, string | number>) => translate(lang, key, vars)
}
