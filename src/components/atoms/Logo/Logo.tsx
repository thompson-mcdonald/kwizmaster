import { ReactNode } from "react"
import styles from "./Logo.module.css"

export default function Logo(props: any) {
  return (
    <a href="/" className={styles.base}>
      <h1>KwizMaster</h1>
    </a>
  )
}
