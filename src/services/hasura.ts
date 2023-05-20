import { createClient } from "graphqurl"

export const client = createClient({
  endpoint: process.env.NEXT_PUBLIC_HASURA_GQL_ENDPOINT || "",
})

const createQuizMutation = `
mutation MyMutation($questions: jsonb = "", $sessionId: String = "", $slug: String = "", $subject: String = "", $difficulty: String = "", $timestamp: timestamptz) {
    insert_quizzes(objects: {questions: $questions, sessionId: $sessionId, slug: $slug, subject: $subject, difficulty: $difficulty, timestamp: $timestamp}) {
      returning {
        id
      }
    }
  }
`

export const createQuiz = async (
  sessionId: string,
  questions: any[],
  subject: string,
  slug: string,
  difficulty: string
) => {
  const response = await client.query({
    query: createQuizMutation,
    variables: {
      questions,
      sessionId,
      slug,
      subject,
      difficulty,
      timestamp: new Date().toISOString,
    },
    headers: {
      "x-hasura-admin-secret": `${process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ADMIN_SECRET}`,
      "content-type": "text/json",
    },
  })

  return response.data.insert_quizzes.returning
}

const updateSlugMutation = `
mutation MyMutation($sessionId: String = "", $slug: String = "") {
    update_quizzes(where: {sessionId: {_eq: $sessionId}}, _set: {slug: $slug}) {
      affected_rows
    }
  }
  `

export const updateSlug = async (sessionId: string, slug: string) => {
  const response = await client.query({
    query: updateSlugMutation,
    variables: {
      sessionId,
      slug,
    },
    headers: {
      "x-hasura-admin-secret": `${process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ADMIN_SECRET}`,
    },
  })
  return response
}

const updateQuestionsMutation = `
mutation MyMutation($sessionId: String = "", $questions: jsonb = "") {
    update_quizzes(where: {sessionId: {_eq: $sessionId}}, _set: {questions: $questions}) {
      affected_rows
    }
  }
  `

export const updateQuestions = async (sessionId: string, questions: any[]) => {
  const response = await client.query({
    query: updateQuestionsMutation,
    variables: {
      sessionId,
      questions: JSON.stringify(questions),
    },
    headers: {
      "x-hasura-admin-secret": `${process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ADMIN_SECRET}`,
    },
  })
  return response
}

const fetchQuizBySlugQuery = `
query MyQuery($slug: String = "") {
  quizzes(where: {slug: {_eq: $slug}}) {
    difficulty
    subject
    slug
    questions
  }
}
`

export const fetchQuizBySlug = async (slug: string) => {
  const response = await client.query({
    query: fetchQuizBySlugQuery,
    variables: {
      slug,
    },
    headers: {
      "x-hasura-admin-secret": `${process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ADMIN_SECRET}`,
    },
  })

  return response.data.quizzes[0]
}
