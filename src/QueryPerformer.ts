import { GraphQLSchema, ExecutionResult, Source, GraphQLFieldResolver, GraphQLTypeResolver } from 'graphql'
import { Maybe } from 'graphql/jsutils/Maybe'
import { WithPostGraphileContextFn } from 'postgraphile/build/postgraphile/withPostGraphileContext'
import { WithPostGraphileContextOptions } from 'postgraphile'
import { Pool } from 'pg'

// This is declared here since it is not exported by graphql
export declare type GQLFunction = (
  schema: GraphQLSchema,
  source: Source | string,
  rootValue?: any,
  contextValue?: any,
  variableValues?: Maybe<{ [key: string]: any }>,
  operationName?: Maybe<string>,
  fieldResolver?: Maybe<GraphQLFieldResolver<any, any>>,
  typeResolver?: Maybe<GraphQLTypeResolver<any, any>>,
) => Promise<ExecutionResult>

export class QueryPerformer {
  constructor (
    private readonly schema: GraphQLSchema,
    private readonly gql: GQLFunction,
    private readonly postgraphileQueryHandler: WithPostGraphileContextFn,
    readonly pool: Pool,
    private readonly contextOptions: WithPostGraphileContextOptions
  ) {
    this.schema = schema
    this.gql = gql
    this.postgraphileQueryHandler = postgraphileQueryHandler
    this.contextOptions = { ...contextOptions, pgPool: pool }
  }

  public async perform (
    query: any,
    variables: any,
    operationName?: string,
    jwtToken?: string
  ): Promise<any> {
    return await this.postgraphileQueryHandler(
      {
        ...this.contextOptions,
        jwtToken
      },
      async (context: any) => {
        return await this.gql(
          this.schema,
          query,
          null,
          { ...context },
          variables,
          operationName
        )
      }
    )
  }
}
