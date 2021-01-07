import { PoolConfig } from 'pg'
import { PostGraphileOptions, WithPostGraphileContextOptions } from 'postgraphile'

export interface PoolOptions {
  user: string
  host: string
  database: string
  password: string
  port: string
}

export interface Options {
  pool?: PoolConfig
  schemas: string[]|string
  contextOptions: WithPostGraphileContextOptions
  middleware: boolean
  postgraphileOptions: PostGraphileOptions
}
