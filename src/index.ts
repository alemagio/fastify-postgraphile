import fp from 'fastify-plugin'
import { graphql, GraphQLSchema } from 'graphql'
import { withPostGraphileContext, createPostGraphileSchema } from 'postgraphile'
import { Options } from './interfaces'
import { createPool } from './create-pool'
import { createSchema } from './schema'
import { QueryPerformer } from './QueryPerformer'

module.exports = fp(async function (fastify, opts: Options) {
  const pool = createPool(opts.pool)
  const schema: GraphQLSchema = await createSchema(createPostGraphileSchema, pool, opts.schemas)
  const queryPerformer = new QueryPerformer(
    schema,
    graphql,
    withPostGraphileContext,
    pool,
    opts.contextOptions
  )

  fastify.decorateReply('graphql', queryPerformer.perform.bind(queryPerformer))
}, { fastify: '3.x' })

declare module 'fastify' {
  export interface FastifyReply {
    graphql: (
      query: any,
      variables: any,
      operationName?: string,
      jwtToken?: string
    ) => Promise<any>
  }
}
