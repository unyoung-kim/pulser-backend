import { z } from 'zod'

export const queryResultSchema = z.object({
  type: z.enum(['question', 'result', 'error']),
  result: z.string()
})
