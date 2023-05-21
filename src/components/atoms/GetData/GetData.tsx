"use client"
import { ReactNode, useEffect, useState } from "react"
import styles from "./GetData.module.css"
import Loader from "../Loader/Loader"
import { generateSlug } from "random-word-slugs"
import { createQuiz, updateQuestions, updateSlug } from "@/services/hasura"
import { v4 as uuid } from "uuid"
import Quiz from "@/components/layout/Quiz/Quiz"
import { useRouter } from "next/navigation"
import Logo from "../Logo/Logo"

export interface GetDataProps {
  children?: ReactNode
}

type KeyType = "string" | "uuid" | "timestamp" | "number"

interface Key {
  name: string
  type: KeyType
}

export default function GetData(props: GetDataProps) {
  const router = useRouter()
  const [amount, setAmount] = useState<number>(5)
  const [subject, setSubject] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [difficulty, setDifficulty] = useState<string>("Easy")
  const [questions, setQuestions] = useState<any[]>([])
  const [answers, setAnswers] = useState<any[]>([])
  const [slug, setSlug] = useState<string>(`${generateSlug(2)}`)
  const [sessionId, setSessionId] = useState<string>("")
  const [isGenerated, setIsGenerated] = useState<boolean>(false)

  useEffect(() => {
    if (isGenerated && questions.length > 0) {
      ;(async () => {
        await updateQuestions(sessionId, questions)
        router.push(`/quiz/${slug}`)
      })()
    }
  }, [isGenerated, questions])

  const onGenerate = async () => {
    const id = uuid()
    setSessionId(id)
    console.log("fetching data")
    setIsLoading(true)
    const response = await fetch("/api/generate-quiz", {
      method: "POST",
      body: JSON.stringify({
        subject,
        amount,
        difficulty,
      }),
    })
    const resObj = await response.json()
    console.log(resObj)

    const que = JSON.parse(resObj.result.content).questions
    const ans = JSON.parse(resObj.result.content).questions.map(
      (item: any) => item.answers
    )
    setQuestions(que)
    setAnswers(ans)
    setIsLoading(false)

    await createQuiz(id, questions, subject, slug, difficulty)
    setIsGenerated(true)
  }

  const slugHandler = async () => {
    await updateSlug(sessionId, `/${slug}`)
  }

  return (
    <div className={styles.base}>
      {!questions.length ? (
        <>
          {isLoading ? (
            <>
              <Loader
                speed={amount}
                value={slug}
                onSubmit={() => console.log("update and that")}
                onChange={setSlug}
              />
            </>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault(), onGenerate()
              }}
              className={styles.init}
            >
              {/* <h1>Quizmaster JSON</h1> */}
              <div className={styles.logo}>
                <Logo />
              </div>
              <div className={styles.formBody}>
                <div>
                  <label htmlFor="subject">Subject of data:</label>
                  <input
                    id="subject"
                    type="text"
                    placeholder="Knights in a dungeon..."
                    onChange={(event) => setSubject(event.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="amount">Amount of questions: {amount}</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label htmlFor="difficulty">Quiz difficulty:</label>
                  <select
                    onChange={(e) => setDifficulty(e.target.value)}
                    defaultValue={difficulty}
                    id="difficulty"
                  >
                    <option>Easy</option>
                    <option>Intermediate</option>
                    <option>Difficult</option>
                    <option>Expert level</option>
                  </select>
                </div>
                <input type="submit" value="Submit" disabled={isLoading} />
              </div>
            </form>
          )}
        </>
      ) : (
        <>
          {/* <Quiz questions={questions} /> */}
          {/* <ol>
            {questions?.map((item) => {
              return (
                <li key={item.key}>
                  {item.question}
                  <ul>
                    {item.answers?.map((item: any) => {
                      return (
                        <li key={item.key}>
                          {item.answer}:{" "}
                          {item.correct ? "correct" : "incorrect"}
                        </li>
                      )
                    })}
                  </ul>
                </li>
              )
            })}
          </ol> */}
        </>
      )}
      {/* <form
        className={styles.slug}
        onSubmit={(e) => {
          e.preventDefault()
          if (isGenerated) {
            slugHandler()
          }
        }}
      >
        <input
          type="text"
          name="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />
        <input type="submit" value="save" />
      </form> */}
    </div>
  )
}
