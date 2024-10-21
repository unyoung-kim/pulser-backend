import { z } from "zod";
import { tRPC } from "../lib/trpc";
import { TRPCError } from '@trpc/server';
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Content endpoint (GET)
 */
export function contentHandler(t: tRPC, supabase: SupabaseClient) {
  return t.procedure
    .input(z.object({ projectId: z.string().uuid() }))
    .query(async ({ input }) => {
      if (!input.projectId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Project ID is required',
        });
      }

      try {
        const { data, error } = await supabase
          .from('Content')
          .select('*')
          .eq('project_id', input.projectId);

        if (error) {
          console.error('Supabase error:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Error fetching content from Supabase',
            cause: error,
          });
        }

        // Log the retrieved data
        console.log('Retrieved data:', data);

        return data;
      } catch (error) {
        console.error('Error in content handler:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred',
          cause: error,
        });
      }
    });
}
