import { Pool } from 'pg';

export const pool = new Pool({
  host: 'localhost',
  port: 5433,
  database: 'coaching_hub',
  user: 'user',
  password: 'password',
  max: 10, // maximum number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000 // how long to wait before timing out when connecting a new client
});
