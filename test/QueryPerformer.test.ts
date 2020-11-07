import { test } from 'tap'
import { QueryPerformer } from '../src/QueryPerformer'
import { ExecutionResult } from 'graphql'
import { Pool, PoolClient } from 'pg'
import { WithPostGraphileContextOptions, mixed } from 'postgraphile'

// Not exported by postgraphile, for testing purpose only
interface PostGraphileContext {
  pgClient: PoolClient;
  [key: string]: PoolClient | mixed;
}

test('should create a performer', async t => {
  t.plan(4)

  const queryMock = 'query'
  const contextMock = { pgPool: new Pool(), jwtToken: 'token' }
  const variablesMock = {}
  const operationNameMock = ''

  const contextHandlerMock = (query: any, variables: any, operationName: any) => {
    t.deepEqual(query, queryMock)
    t.deepEqual(variables, variablesMock)
    t.deepEqual(operationName, operationNameMock)
    return (context: any) => Promise.resolve({} as ExecutionResult)
  }

  const postgraphileQueryHandler = (
    options: WithPostGraphileContextOptions,
    cb: (context: PostGraphileContext) => Promise<any>
  ): Promise<ExecutionResult> => {
    t.deepEqual(options, contextMock)
    cb({} as PostGraphileContext)
    return Promise.resolve({} as ExecutionResult)
  }

  const queryPerformer = new QueryPerformer(
    postgraphileQueryHandler,
    contextHandlerMock as any,
    new Pool(),
    contextMock
  )

  queryPerformer.perform(queryMock, variablesMock, operationNameMock, contextMock.jwtToken)
})
