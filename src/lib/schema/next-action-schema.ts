import { z } from 'zod'

export const nextActionSchema = z.object({
  next: z.enum(['inquire', 'proceed'])
})