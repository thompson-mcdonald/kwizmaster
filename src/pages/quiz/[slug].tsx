import Quiz from "@/components/layout/Quiz/Quiz"
import { fetchQuizBySlug } from "@/services/hasura"

export default function Page(props: any) {
  const { data } = props
  console.log(props)
  const qList = JSON.parse(data.questions)

  return (
    <>
      {/* {JSON.stringify(props)} */}
      {qList && <Quiz questions={qList} />}
    </>
  )
}

export async function getServerSideProps(context: any) {
  const data = await fetchQuizBySlug(context.query.slug)

  return {
    props: {
      test: "truye",
      data,
    },
  }
}
