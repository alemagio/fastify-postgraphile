import { ExecutionResult } from 'graphql'
import { WithPostGraphileContextFn } from 'postgraphile/build/postgraphile/withPostGraphileContext'
import { WithPostGraphileContextOptions } from 'postgraphile'
import { Pool } from 'pg'

export declare type ContextHandler = (
  query: any,
  variables?: any,
  operationName?: string
) => (context: any) => Promise<ExecutionResult>

export class QueryPerformer {
  constructor (
    private readonly postgraphileQueryHandler: WithPostGraphileContextFn,
    private readonly contextHandler: ContextHandler,
    readonly pool: Pool,
    private readonly contextOptions: WithPostGraphileContextOptions
  ) {
    this.postgraphileQueryHandler = postgraphileQueryHandler
    this.contextOptions = { ...contextOptions, pgPool: pool }
    this.contextHandler = contextHandler
  }

  public async perform (
    query: any,
    variables?: any,
    operationName?: string,
    jwtToken?: string
  ): Promise<any> {
    return await this.postgraphileQueryHandler(
      {
        ...this.contextOptions,
        jwtToken
      },
      this.contextHandler(query, variables, operationName)
    )
  }
}
