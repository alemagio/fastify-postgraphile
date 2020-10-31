import { test } from 'tap'
import { createSchema } from '../src/schema'
import { Pool } from 'pg'
import { GraphQLSchema } from 'graphql'

test('should create a schema when receiving a single schema name', async t => {
  t.plan(1)
  const schemaName = 'my-schema'
  const handler = (pool: Pool, schema: string|string[]) => {
    t.ok(schema === schemaName)
    return Promise.resolve(new GraphQLSchema({}))
  }
  createSchema(handler, {} as Pool, schemaName)
})

test('should create a schema when receiving multiple schema names', async t => {
  t.plan(1)
  const schemaNames = ['my-schema', 'my-other-schema']
  const handler = (pool: Pool, schema: string|string[]) => {
    t.ok(schema === schemaNames)
    return Promise.resolve(new GraphQLSchema({}))
  }
  createSchema(handler, {} as Pool, schemaNames)
})
