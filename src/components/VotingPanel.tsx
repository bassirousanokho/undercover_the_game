'use client'

import { useState } from 'react'
import { useGameStore } from '@/lib/gameStore'
import { useT } from '@/lib/i18n/useT'
import type { Player } from '@/lib/types'

function VoterStep({
  voter,
  candidates,
  onVote,
  t,
}: {
  voter: Player
  candidates: Player[]
  onVote: (id: string) => void
  t: ReturnType<typeof useT>
}) {
  const [ready, setReady] = useState(false)

  if (!ready) {
    return (
      <button
        onClick={() => setReady(true)}
        className="rounded-xl bg-neutral-900 px-6 py-3 font-semibold text-white dark:bg-white dark:text-neutral-900"
      >
        {t('reveal.tapToReveal')}
      </button>
    )
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <p className="text-neutral-500">{t('vote.instructions', { name: voter.name })}</p>
      {candidates.map((c) => (
        <button
          key={c.id}
          onClick={() => onVote(c.id)}
          className="rounded-xl border border-neutral-300 py-3 font-medium dark:border-neutral-700"
        >
          {c.name}
        </button>
      ))}
    </div>
  )
}

export function VotingPanel() {
  const t = useT()
  const players = useGameStore((s) => s.players)
  const turnOrder = useGameStore((s) => s.turnOrder)
  const currentVoterIndex = useGameStore((s) => s.currentVoterIndex)
  const tieBreakCandidates = useGameStore((s) => s.tieBreakCandidates)
  const round = useGameStore((s) => s.round)
  const castVote = useGameStore((s) => s.castVote)

  const voterId = turnOrder[currentVoterIndex]
  const voter = players.find((p) => p.id === voterId)
  if (!voter) return null

  const alivePlayers = players.filter((p) => p.alive)
  const candidates = tieBreakCandidates
    ? alivePlayers.filter((p) => tieBreakCandidates.includes(p.id))
    : alivePlayers.filter((p) => p.id !== voter.id)

  const stepKey = `${currentVoterIndex}-${tieBreakCandidates ? tieBreakCandidates.join(',') : 'normal'}`

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-6 p-4 pt-16 text-center">
      <div>
        <p className="text-sm text-neutral-500">{t('vote.title', { round })}</p>
        <h2 className="mt-2 text-2xl font-bold">{t('vote.passTo', { name: voter.name })}</h2>
      </div>

      {tieBreakCandidates && (
        <p className="rounded-lg bg-amber-100 px-3 py-2 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-200">
          {t('vote.revoteNeeded', {
            names: players
              .filter((p) => tieBreakCandidates.includes(p.id))
              .map((p) => p.name)
              .join(', '),
          })}
        </p>
      )}

      <VoterStep key={stepKey} voter={voter} candidates={candidates} onVote={castVote} t={t} />

      <p className="text-sm text-neutral-400">
        {currentVoterIndex + 1} / {turnOrder.length}
      </p>
    </div>
  )
}
