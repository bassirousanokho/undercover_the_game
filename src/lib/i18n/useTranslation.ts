import { dictionaries } from './dictionaries'
import type { Lang } from '../types'

type Vars = Record<string, string | number>

function get(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return (acc as Record<string, unknown>)[key]
    }
    return undefined
  }, obj)
}

function interpolate(template: string, vars?: Vars): string {
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    const value = vars[key]
    return value === undefined ? match : String(value)
  })
}

export function translate(lang: Lang, key: string, vars?: Vars): string {
  const raw = get(dictionaries[lang], key)
  if (typeof raw !== 'string') return key
  return interpolate(raw, vars)
}
