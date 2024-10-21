import { z } from 'zod'

export const retrieveSchema = z.object({
  url: z.string().describe('The url to retrieve')
})
