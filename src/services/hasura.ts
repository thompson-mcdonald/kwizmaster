import { createClient } from "graphqurl"

export const client = createClient({
  endpoint: process.env.NEXT_PUBLIC_HASURA_GQL_ENDPOINT || "",
})

const createQuizMutation = `
mutation MyMutation($questions: jsonb = "", $sessionId: String = "", $slug: String = "", $subject: String = "") {
    insert_quizzes(objects: {questions: $questions, sessionId: $sessionId, slug: $slug, subject: $subject}) {
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
  slug: string
) => {
  const response = await client.query({
    query: createQuizMutation,
    variables: {
      questions,
      sessionId,
      slug,
      subject,
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
