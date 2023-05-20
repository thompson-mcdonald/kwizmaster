import { ReactNode } from 'react'
import styles from './Header.module.css'

export interface HeaderProps {
  children: ReactNode
}

export default function Header(props: HeaderProps) {
  return <div className={styles.base}>Component</div>
}
