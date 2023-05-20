import { fetchQuizBySlug } from "@/services/hasura"
import { NextApiRequest, NextApiResponse } from "next"

export default async function fetch(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = JSON.parse(req.body) || []
  try {
    const data = await fetchQuizBySlug(slug)
    res.status(200).send({ ...data })
  } catch (e) {
    res.status(500).send({ e })
  }
}
