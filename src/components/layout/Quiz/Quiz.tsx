import { useEffect, useState } from "react"
import styles from "./Quiz.module.css"
import { useFormik } from "formik"
import classNames from "classnames"
import Logo from "@/components/atoms/Logo/Logo"

export interface QuizProps {
  questions: {
    key: number
    question: string
    answers: {
      key: number
      answer: string
      correct: boolean
    }[]
  }[]
  slug?: string
}

export default function Quiz({ questions, slug }: QuizProps) {
  console.log(questions)

  const [count, setCount] = useState<number>(0)
  const [step, setStep] = useState<number>(0)
  const [answered, setAnswered] = useState<number>(0)
  const [isComplete, setIsComplete] = useState<boolean>(false)
  const questionsOnly = questions?.map(({ question }, key) => {
    return {
      question,
      key: `q-${key}`,
      answerKey: null,
      correct: null,
      answered: false,
    }
  })

  const formik = useFormik({
    initialValues: Object.assign({}, questionsOnly),
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2))
    },
  })

  useEffect(() => {
    console.log("updated", formik.values, count)
    // console.log(isCorrect)
    if (formik.dirty) {
      const isCorrect = Object.entries(formik.values).filter((item) => {
        if (item[1].correct) {
          return true
        }
      })
      const isAnswered = Object.entries(formik.values).filter((item) => {
        if (item[1].answered) {
          return true
        }
      })
      console.log(isAnswered)
      setAnswered(isAnswered.length)
      setCount(isCorrect.length)
      formik.resetForm({ values: formik.values })
    }
  }, [formik.values, count])

  useEffect(() => {
    if (step == questions?.length) {
      setIsComplete(true)
    }
  }, [step])

  const iterateStep = (direction: "next" | "previous") => {
    switch (direction) {
      case "next": {
        if (step < questions?.length) {
          return setStep(step + 1)
        }
      }
      case "previous": {
        if (step !== 0) {
          return setStep(step - 1)
        }
      }
    }
  }

  return (
    <div className={styles.base}>
      <div className={styles.quizBase}>
        {isComplete ? (
          <div
            className={classNames(styles.questionBase, {
              [styles.active]: true,
            })}
          >
            <h1>
              You got {count} / {answered} answers right!
            </h1>
          </div>
        ) : (
          <>
            {questions?.map((item, index) => {
              return (
                <div
                  key={`q-${index}`}
                  className={classNames(styles.questionBase, {
                    [styles.active]: index == step,
                  })}
                >
                  <div className={styles.counter}>
                    <Logo />
                    {isComplete ? "" : `${count} / ${questions.length}`}
                  </div>
                  <h3>
                    {" "}
                    Question {index + 1}
                    <br />
                    <br />
                    {item.question}
                  </h3>
                  <div
                    key={item.key}
                    className={classNames(styles.answersBase)}
                  >
                    {questions[index].answers.map((ans, key) => {
                      return (
                        <div
                          key={ans.key}
                          className={classNames(styles.optionBase, {
                            [styles.disabled]: formik.values[index].answered,
                            [styles.checked]:
                              formik.values[index].answerKey === `a-${key}`,
                            [styles.correct]:
                              formik.values[index].answered && ans.correct,
                            [styles.inCorrect]:
                              formik.values[index].answered && !ans.correct,
                            [styles.answered]: formik.values[index].answered,
                          })}
                        >
                          <label htmlFor={`q-${index}-a-${key}`}>
                            {ans.answer}
                          </label>
                          <input
                            type="radio"
                            name={`q-${index}`}
                            id={`q-${index}-a-${key}`}
                            value={`q-${index}`}
                            onChange={() => {
                              formik.setFieldValue(`${index}`, {
                                ...formik.values[index],
                                answerKey: `a-${key}`,
                                correct: ans.correct,
                                answered: true,
                              })
                            }}
                            disabled={formik.values[step]?.answered}
                          />
                        </div>
                      )
                    })}
                  </div>
                  {formik.values[index].answered &&
                    (formik.values[index].correct ? "Correct" : "Incorrect")}
                </div>
              )
            })}
            <nav className={styles.buttonNav}>
              <button
                onClick={() => iterateStep("previous")}
                disabled={step === 0}
              >
                -
              </button>
              <button
                onClick={() => iterateStep("next")}
                disabled={
                  !formik.values[step]?.answered || step == questions?.length
                }
              >
                +
              </button>
            </nav>
          </>
        )}
      </div>
    </div>
  )
}
