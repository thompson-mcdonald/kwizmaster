import Image from "next/image"
import styles from "./page.module.css"
import GetData from "@/components/atoms/GetData/GetData"

export default function Home() {
  return (
    <main className={styles.main}>
      <GetData />
    </main>
  )
}
