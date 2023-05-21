import { ReactNode, useEffect, useState } from "react"
import styles from "./Loader.module.css"
import classNames from "classnames"
import { shuffle } from "lodash"

export interface LoaderProps {
  speed: number
  value: string
  onSubmit: () => void
  onChange: (value: string) => void
}

const prompts = [
  "Generating your quiz, this may take a while...",
  "Waiting for this quiz to load... Ugh, patience is overrated. 😒",
  "Loading screens: the modern-day equivalent of watching paint dry. 🙄",
  "Time spent waiting for quizzes to load: a masterclass in frustration. 😤",
  "Loading... Loading... Just kidding, we're not actually doing anything productive. 😴",
  "Did you know... The person responsible for this loading screen is probably on a coffee break? ☕️",
  "Waiting for this quiz to load is like watching a sloth on a marathon. 🐌",
  "Tick tock, tick tock... The loading screen thinks it's a suspenseful thriller. ⏳",
  "Boredom level while waiting: off the charts. How about a loading screen dance party? 💃",
  "This loading time is longer than the line at a hipster coffee shop. ☕️🙄",
  "Can we hire a professional sprinter to replace this loading screen? 🏃",
  "While you wait, you can contemplate the meaning of life and why on earth loading screens exist. Deep thoughts, right? 🙄",
  "Did you know... The inventor of this loading screen must have won the 'Most Torturous User Experience' award? They deserve a standing ovation. 👏",
  "While you wait, you can write a novel, learn a new language, and solve world hunger. Or you can just wait for this painfully slow quiz to load. Your call. 🙃",
  "Did you know... Waiting for this quiz to load is a highly effective way to test your patience and sanity? It's like a personal growth exercise. 😤",
  "While you wait, you can imagine a parallel universe where loading screens don't exist. Ah, the blissful utopia we'll never experience. 😒",
  "Did you know... The snail community holds an annual celebration every time a loading screen appears? They appreciate the solidarity. 🐌",
  "While you wait, you can invent a new Olympic sport: Competitive Loading Screen Watching. It's the next big thing, we promise. 😴",
  "Did you know... A sloth on a leisurely stroll could beat this quiz's loading time? Talk about a race of epic proportions. 🦥",
  "While you wait, you can ponder the mysteries of the universe, like why it takes longer to load a quiz than it does to launch a rocket into space. 🚀",
  "Did you know... Some scientists believe that staring at loading screens for extended periods can cause spontaneous eye-rolling? It's a groundbreaking discovery. 🙄",
]

export default function Loader({
  speed,
  value,
  onSubmit,
  onChange,
}: LoaderProps) {
  const [active, setActive] = useState<boolean>(false)
  const [step, setStep] = useState<number>(0)
  const promptList = shuffle(prompts)

  useEffect(() => {
    if (!active) {
      setTimeout(() => {
        setActive(true)
      }, speed * 1000)
    }
  }, [])

  const func = () => setStep(step + 1)
  let to = setTimeout(() => func(), 3000)
  clearTimeout(to)

  to = setTimeout(() => func(), 5000)

  return (
    <div className={styles.loaderBase}>
      <div>
        <p>
          {promptList?.map((item: string, index: number) => {
            if (index === step) {
              return item
            }
          })}
        </p>
      </div>
      <div className={styles.base}>
        <div
          className={classNames(styles.loader, { [styles.active]: active })}
          style={{ transition: `width ${speed * 2}s` }}
        ></div>
      </div>
    </div>
  )
}
