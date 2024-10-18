import { generateOpenApiDocument } from 'trpc-openapi';
import { trpcRouter } from '../trpcRouter';  // Import your main tRPC router

export function createOpenApiDocument(baseURL: string) {
  return generateOpenApiDocument(trpcRouter, {
    title: 'Pulser APIs',
    description: 'List of all the APIs available in the pulser-backend',
    version: '1.0.0',
    baseUrl: baseURL,
  });
}
