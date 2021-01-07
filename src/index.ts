import fp from 'fastify-plugin'
import { graphql, GraphQLSchema } from 'graphql'
import { withPostGraphileContext, createPostGraphileSchema, postgraphile, PostGraphileResponse, PostGraphileResponseFastify3, PostGraphileOptions } from 'postgraphile'
import { Options } from './interfaces'
import { createPool } from './create-pool'
import { createSchema } from './schema'
import { QueryPerformer } from './QueryPerformer'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { Pool } from 'pg'

module.exports = fp(async function (fastify, opts: Options) {
  const pool = createPool(opts.pool)

  if (opts.middleware) {
    withMiddleware(fastify, pool, opts.schemas, opts.postgraphileOptions)
    return
  }

  // TODO watch
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

function withMiddleware (
  fastify: FastifyInstance,
  pool: Pool,
  schemas: string | string [],
  postgraphileOptions: PostGraphileOptions
): void {
  const middleware = postgraphile(pool, schemas, postgraphileOptions)

  const convertHandler = (handler: (res: PostGraphileResponse) => Promise<void>) => async (
    req: FastifyRequest,
    reply: FastifyReply
  ) => await handler(new PostGraphileResponseFastify3(req, reply))

  fastify.options(middleware.graphqlRoute, convertHandler(middleware.graphqlRouteHandler))
  fastify.post(middleware.graphqlRoute, convertHandler(middleware.graphqlRouteHandler))

  if (middleware.options.graphiql !== undefined && middleware.options.graphiql !== null) {
    if (middleware.graphiqlRouteHandler !== undefined && middleware.graphiqlRouteHandler !== null) {
      fastify.head(middleware.graphiqlRoute, convertHandler(middleware.graphiqlRouteHandler))
      fastify.get(middleware.graphiqlRoute, convertHandler(middleware.graphiqlRouteHandler))
    }
  }

  // TODO watch
}

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
