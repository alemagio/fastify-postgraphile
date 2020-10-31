import { Pool } from 'pg'
import { GraphQLSchema } from 'graphql'

export async function createSchema (
  handler: (pool: Pool, schema: string|string[]) => Promise<GraphQLSchema>,
  pool: Pool,
  schema: string|string[]
): Promise<GraphQLSchema> {
  return await handler(pool, schema)
}
