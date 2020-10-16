import { PoolConfig } from 'pg'

export interface PoolOptions {
  user: string
  host: string
  database: string
  password: string
  port: string
}

export interface ContextOptions {
  jwtToken?: string
  jwtSecret?: string
  pgDefaultRole?: string
}

export interface Options {
  poolConfig: PoolConfig
  schemas: string[]|string
  contextOptions: ContextOptions
}
