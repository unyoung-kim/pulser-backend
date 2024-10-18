import { generateText } from 'ai'
import { getTools } from '../tools/get-tools'
import { getModel } from '../get-model'

const SYSTEM_PROMPT = `As a professional search expert, you possess the ability to search for any information on the web.
For each user query, utilize the search results to their fullest potential to provide additional information and assistance in your response.
If there are any images relevant to your answer, be sure to include them as well.
Aim to directly address the user's question, augmenting your response with insights gleaned from the search results.`

export async function researcher(query: string) {
  try {
    // let toolResults: any[] = []

    const currentDate = new Date().toLocaleString()
    const result = await generateText({
      model: getModel(),
      system: `${SYSTEM_PROMPT} Current date and time: ${currentDate}`,
      prompt: query,
      tools: getTools(),
      maxSteps: 5,
      // onStepFinish: async (event: { stepType: string; toolCalls?: any[]; toolResults?: any }) => {
      //   if (event.stepType === 'initial' && event.toolCalls) {
      //     toolResults = event.toolResults
      //   }
      // }
    })

    return { text: result.text }
  } catch (error) {
    console.error('Error in researcher:', error)
    return {
      text: 'An error has occurred. Please try again.',
    }
  }
}
