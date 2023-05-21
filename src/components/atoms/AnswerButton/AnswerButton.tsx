import type { ReactNode } from "react"
import styles from "./AnswerButton.module.css"
import classNames from "classnames"

export interface AnswerButtonProps {
  children: ReactNode
  onClick: () => void
  isCorrect: boolean
  isSelected: boolean
}

export default function AnswerButton({ children, onClick }: AnswerButtonProps) {
  return <button className={classNames(styles.base)}>{children}</button>
}
