// pool.js builds the app's connection from DATABASE_URL
// init.js initializes that database using the schema.
// server.js uses the same pool for application queries and sessions.
import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export async function query(text, values) {
  return pool.query(text, values);
}
