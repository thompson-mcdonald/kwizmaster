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
    const prompt = generatePrompt(subject, difficulty, amount)
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      temperature: 0.7,
      prompt: `${prompt}`,
      max_tokens: 2000,
    })
    console.log(completion)
    const result = completion.data.choices[0]

    res.status(200).json({
      result: result.text?.replace("\n", ""),
      message: prompt,
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
  return `Write a ${difficulty ? difficulty : "intermediate level"}, ${
    amount ? amount : 10
  } question quiz about ${
    subject ? subject : "Breaking Bad"
  }. Please write the questions and answers in the following format, and respond in JSONB. Follow the structure of the example, do not truncate keys. Choices per question should never exceed 3 - 1 choice should be correct, 1 plausible and 1 ridiculous.

  {"questions": [{"question": "Which planet is the largest?","answers": [{"answer": "Jupiter", "correct": false},{"answer": "Venus", "correct": false},{"answer": "Mars", "correct": false}]}]}
  `
}
