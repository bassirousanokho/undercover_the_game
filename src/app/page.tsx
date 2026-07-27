'use client'

import { useEffect, useState } from 'react'
import { useGameStore } from '@/lib/gameStore'
import { PlayerSetupForm } from '@/components/PlayerSetupForm'
import { WordRevealCard } from '@/components/WordRevealCard'
import { ClueTurnOrder } from '@/components/ClueTurnOrder'
import { VotingPanel } from '@/components/VotingPanel'
import { EliminationReveal } from '@/components/EliminationReveal'
import { MrWhiteGuessForm } from '@/components/MrWhiteGuessForm'
import { GameOverScreen } from '@/components/GameOverScreen'
import { NavBar } from '@/components/NavBar'

function useHydrated() {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const unsubscribe = useGameStore.persist.onFinishHydration(() => setHydrated(true))
    useGameStore.persist.rehydrate()
    return unsubscribe
  }, [])

  return hydrated
}

export default function Home() {
  const hydrated = useHydrated()
  const phase = useGameStore((s) => s.phase)

  if (!hydrated) {
    return <div className="flex flex-1 items-center justify-center bg-zinc-50 dark:bg-black" />
  }

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <NavBar />
      {phase === 'setup' && <PlayerSetupForm />}
      {phase === 'reveal' && <WordRevealCard />}
      {phase === 'clue' && <ClueTurnOrder />}
      {phase === 'vote' && <VotingPanel />}
      {phase === 'elimination' && <EliminationReveal />}
      {phase === 'mrwhite-guess' && <MrWhiteGuessForm />}
      {phase === 'gameover' && <GameOverScreen />}
    </div>
  )
}
