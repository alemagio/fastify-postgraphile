import { test } from 'tap'
import { fastify } from 'fastify'
import { Pool } from 'pg'
const plugin = require('../src')

const connection = {
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'password',
  port: 5445
}

const options = { pool: connection, schemas: 'public' }

test('should create the reply decorator', async t => {
  t.plan(1)

  const app = fastify()
  app.register(plugin, options)
  await app.ready()

  t.ok(app.hasReplyDecorator('graphql'))
})

test('should execute graphql queries', async t => {
  t.plan(1)

  const user = {
    id: 'b1f26dea-47bf-463b-befe-bb4c9adaae45',
    username: 'user',
    password: 'password'
  }
  const pool = new Pool(connection)
  await pool.query(`
  CREATE table IF NOT EXISTS users (
    id UUID PRIMARY key,
    username varchar(255) not null,
    password varchar(255) not null
  );`)
  await pool.query(`
  INSERT INTO users (id, username, password)
    VALUES (\'${user.id}\', \'${user.username}\', \'${user.password}\');
  `)

  t.tearDown(async () => {
    await pool.query(`DROP TABLE users`)
  })

  const app = fastify()
  app.register(plugin, options)

  app.post('/', async (req: any, reply: any) => {
    return reply.graphql(req.body.query, req.body.variables)
  })

  await app.ready()

  const res: any = await app.inject({
    url: '/',
    method: 'POST',
    payload: {
      query: `
        {
          allUsers {
            nodes {
              id,
              username,
              password
            }
          }
        }`
    }
  })

  t.deepEqual(
    JSON.parse(res.body),
    {
      data: {
        allUsers: {
          nodes: [user]
        }
      }
    }
  );
})
