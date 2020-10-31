import { Pool, PoolConfig } from 'pg'

export function createPool (pool?: PoolConfig): Pool {
  return new Pool(pool)
}
