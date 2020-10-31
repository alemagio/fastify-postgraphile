import { PoolConfig } from 'pg'
import { WithPostGraphileContextOptions } from 'postgraphile'

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
}
