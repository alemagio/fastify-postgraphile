import fp from 'fastify-plugin'
import { Pool } from 'pg'
import { graphql, GraphQLSchema } from 'graphql'
import { withPostGraphileContext, createPostGraphileSchema } from 'postgraphile'
import { Options } from './interfaces'

module.exports = fp(async function (fastify, opts: Options) {
  const pool = new Pool(opts.poolConfig)
  const schema: GraphQLSchema = await createPostGraphileSchema(pool, opts.schemas)
  const performQuery = async function (
    schema: GraphQLSchema,
    query: any,
    variables: any,
    jwtToken?: string,
    operationName?: string
  ): Promise<any> /* TODO: fix return type */ {
    return await withPostGraphileContext(
      {
        pgPool: pool,
        jwtToken,
        jwtSecret: opts?.contextOptions?.jwtSecret,
        pgDefaultRole: opts?.contextOptions?.pgDefaultRole
      },
      async context => {
        return await graphql(
          schema,
          query,
          null,
          { ...context },
          variables,
          operationName
        )
      }
    )
  }

  fastify.decorateReply('graphql', async (query: any, variables: any) => {
    return await performQuery(schema, query, variables)
  })
}, { fastify: '3.x' })
