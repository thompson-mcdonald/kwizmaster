import Quiz from "@/components/layout/Quiz/Quiz"
import { fetchQuizBySlug } from "@/services/hasura"
import Head from "next/head"

export default function Page(props: any) {
  const { data } = props
  console.log(props)
  const qList = JSON.parse(data.questions)

  return (
    <>
      {/* {JSON.stringify(props)} */}
      <Head>
        <title>{data.subject} quiz - Kwizmaster</title>
      </Head>
      {qList && <Quiz questions={qList} />}
    </>
  )
}

export async function getServerSideProps(context: any) {
  const data = await fetchQuizBySlug(context.query.slug)

  return {
    props: {
      data,
    },
  }
}
