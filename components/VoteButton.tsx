'use client'
import { useState, useTransition } from 'react'
import { voteProposition } from '@/app/actions/submitProposition'
import styles from './VoteButton.module.css'

interface Props {
  id: string
  votes: number
}

export default function VoteButton({ id, votes }: Props) {
  const [count, setCount]   = useState(votes)
  const [voted, setVoted]   = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleVote() {
    if (voted || isPending) return
    setVoted(true)
    setCount((c) => c + 1)
    startTransition(() => { voteProposition(id) })
  }

  return (
    <button
      className={`${styles.btn} ${voted ? styles.voted : ''}`}
      onClick={handleVote}
      disabled={voted || isPending}
      aria-label={voted ? 'Vote enregistré' : 'Voter pour cette idée'}
    >
      <span className={styles.count}>{count}</span>
      <span className={styles.icon}>{voted ? '✓' : '↑'}</span>
    </button>
  )
}
