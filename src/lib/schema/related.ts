import { z } from 'zod'

export const relatedSchema = z.object({
  relatedQueries: z
    .array(
      z.object({
        query: z.string()
      })
    )
    .length(3)
})
