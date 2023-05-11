import { NextApiRequest, NextApiResponse } from "next"
import { NextRequest, NextResponse } from "next/server"
import { Configuration, OpenAIApi } from "openai"

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

export default async function generate(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    })
    return
  }

  const { subject, amount, difficulty } = JSON.parse(req.body) || []
  try {
    const prompt = generatePrompt(subject, amount, difficulty)
    const msg = generateMessage("user", prompt)
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      messages: [msg],
    })
    console.log(completion)
    const result = completion.data.choices[0].message

    res.status(200).json({
      result,
    })
  } catch (error: any) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data)
      res.status(error.response.status).json(error.response.data)
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`)
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      })
    }
  }
}

export function generatePrompt(
  subject?: string,
  difficulty?: string,
  amount?: number
) {
  return `Write a ${difficulty ? difficulty : "intermediate level"} ${
    amount ? amount : 10
  } question quiz about ${
    subject ? subject : "Breaking Bad"
  }. Please write the questions and answers in the following format, and respond only with JSON. 

  For example:
  {"questions": [ { key: "1", question: "Which character is nonverbal and communicates via a bell?"}], "answers": [ {key: "1", answer: "Hector Salamanca"}]}`
}

export function generateMessage(
  role: "user" | "system" | "assistant",
  content: string
) {
  return {
    role,
    content,
  }
}
