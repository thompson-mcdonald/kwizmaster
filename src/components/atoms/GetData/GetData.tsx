"use client"
import { ReactNode, useState } from "react"
import styles from "./GetData.module.css"

export interface GetDataProps {
  children?: ReactNode
}

type KeyType = "string" | "uuid" | "timestamp" | "number"

interface Key {
  name: string
  type: KeyType
}

export default function GetData(props: GetDataProps) {
  const [data, setData] = useState<any[] | undefined>(undefined)
  const [amount, setAmount] = useState<number>(5)
  const [subject, setSubject] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [difficulty, setDifficulty] = useState<string>("")
  const [questions, setQuestions] = useState<any[]>([])
  const [answers, setAnswers] = useState<any[]>([])
  const [showAnswers, setShowAnswers] = useState<boolean>(false)

  const onGenerate = async () => {
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
    const ans = JSON.parse(resObj.result.content).answers
    setQuestions(que)
    setAnswers(ans)
    setIsLoading(false)
  }

  return (
    <div className={styles.base}>
      {!questions.length ? (
        <form
          onSubmit={(e) => {
            e.preventDefault(), onGenerate()
          }}
        >
          <h1>Quizmaster JSON</h1>
          <div>
            <label>Subject of data:</label>
            <input
              type="text"
              placeholder="Knights in a dungeon..."
              onChange={(event) => setSubject(event.target.value)}
            />
          </div>
          <div>
            <label>Amount of questions: {amount}</label>
            <input
              type="range"
              min="1"
              max="10"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>
          <div>
            <label>Quiz difficulty:</label>
            <select onChange={(e) => setDifficulty(e.target.value)}>
              <option>Easy</option>
              <option>Intermediate</option>
              <option>Difficult</option>
              <option>Expert level</option>
            </select>
          </div>
          <input type="submit" value="Submit" />
        </form>
      ) : (
        <>
          {questions?.map((item) => {
            return <div key={item.key}>{item.question}</div>
          })}
          <button onClick={() => setShowAnswers(true)}>Show answers</button>
          {showAnswers && (
            <div className={styles.answers}>
              {answers?.map((item) => {
                return (
                  <div key={item.key}>
                    {item.key} {item.answer}
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}
