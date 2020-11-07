import fp from 'fastify-plugin'
import { graphql, GraphQLSchema, ExecutionResult } from 'graphql'
import { withPostGraphileContext, createPostGraphileSchema } from 'postgraphile'
import { Options } from './interfaces'
import { createPool } from './create-pool'
import { createSchema } from './schema'
import { QueryPerformer } from './QueryPerformer'

module.exports = fp(async function (fastify: any, opts: Options) {
  const mercurius = opts.mercurius ?? false

  const pool = createPool(opts.pool)
  const schema: GraphQLSchema = await createSchema(createPostGraphileSchema, pool, opts.schemas)

  let contextHandler = defaultContextHandler
  if (mercurius) {
    contextHandler = mercuriusContextHandler
    fastify.graphql.replaceSchema(schema)
  }

  const queryPerformer = new QueryPerformer(
    withPostGraphileContext,
    contextHandler,
    pool,
    opts.contextOptions
  )

  fastify.decorateReply('postgraphileGQL', queryPerformer.perform.bind(queryPerformer))

  function defaultContextHandler (
    query: any,
    variables?: any,
    operationName?: string
  ): (context: any) => Promise<ExecutionResult> {
    return async (context: any) =>
      await graphql(
        schema,
        query,
        null,
        { ...context },
        variables,
        operationName
      )
  }

  function mercuriusContextHandler (
    query: any,
    variables?: any,
    operationName?: string
  ): (context: any) => Promise<ExecutionResult> {
    return async (context: any) =>
      await fastify.graphql( // eslint-disable-line
        query,
        { ...context },
        variables,
        operationName
      )
  }
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
