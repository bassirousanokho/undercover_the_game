export function normalizeWord(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
}

export function isGuessCorrect(guess: string, civilianWord: string): boolean {
  return normalizeWord(guess) === normalizeWord(civilianWord)
}
