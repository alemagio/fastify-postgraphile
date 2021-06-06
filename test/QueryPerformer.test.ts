import { test } from 'tap'
import { QueryPerformer } from '../src/QueryPerformer'
import { GraphQLSchema, ExecutionResult, Source } from 'graphql'
import { Pool, PoolClient } from 'pg'
import { WithPostGraphileContextOptions, mixed } from 'postgraphile'
import { Maybe } from 'graphql/jsutils/Maybe'

// Not exported by postgraphile, for testing purpose only
interface PostGraphileContext {
  pgClient: PoolClient;
  [key: string]: PoolClient | mixed;
}

test('should create a performer', async t => {
  t.plan(6)

  const schemaMock = {} as GraphQLSchema
  const queryMock = 'query'
  const contextMock = { pgPool: new Pool(), jwtToken: 'token' }
  const variablesMock = {}
  const operationNameMock = ''

  const gql = (
    schema: GraphQLSchema,
    query: string|Source,
    rootValue?: any,
    contextValue?: any,
    variables?: any,
    operationName?: Maybe<string>
  ) => {
    t.same(schema, schemaMock)
    t.same(query, queryMock)
    t.same(rootValue, null)
    t.same(variables, variablesMock)
    t.same(operationName, operationNameMock)
    return Promise.resolve({} as ExecutionResult)
  }

  const postgraphileQueryHandler = (
    options: WithPostGraphileContextOptions,
    cb: (context: PostGraphileContext) => Promise<any>
  ): Promise<ExecutionResult> => {
    t.same(options, contextMock)
    cb({} as PostGraphileContext)
    return Promise.resolve({} as ExecutionResult)
  }

  const queryPerformer = new QueryPerformer(
    schemaMock,
    gql,
    postgraphileQueryHandler,
    new Pool(),
    contextMock
  )

  queryPerformer.perform(queryMock, variablesMock, operationNameMock, contextMock.jwtToken)
})
