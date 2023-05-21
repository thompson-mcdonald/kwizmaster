import { ReactNode } from "react"
import styles from "./Logo.module.css"
import Link from "next/link"

export default function Logo(props: any) {
  return (
    <Link href="/" className={styles.base}>
      <h1>KwizMaster</h1>
    </Link>
  )
}
