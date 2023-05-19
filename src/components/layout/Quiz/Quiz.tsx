import { ReactNode } from 'react'
import styles from './Quiz.module.css'

export interface QuizProps {
  children: ReactNode
}

export default function Quiz(props: QuizProps) {
  return <div className={styles.base}>Component</div>
}
