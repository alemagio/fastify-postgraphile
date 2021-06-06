import { test } from 'tap'
import { createPool } from '../src/create-pool'
import { Pool } from 'pg'

test('should create a Pool with default config', async t => {
  t.plan(1)
  t.same(
    createPool(),
    new Pool()
  )
})

test('should create a Pool with custom config', async t => {
  t.plan(1)

  const config = {
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'password',
    port: 5445
  }
  t.same(
    createPool(config),
    new Pool(config)
  )
})
