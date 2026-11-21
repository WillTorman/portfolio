// init.js initializes that database using the schema.
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import bcrypt from 'bcryptjs';
import { pool, query } from './pool.js';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not configured.');
}

const schemaPath = fileURLToPath(new URL('./schema.sql', import.meta.url));
await query(await fs.readFile(schemaPath, 'utf8'));

if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
  await query(
    `INSERT INTO users (email, password_hash, display_name, role)
     VALUES ($1, $2, 'Portfolio Owner', 'admin')
     ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = 'admin'`,
    [process.env.ADMIN_EMAIL.toLowerCase(), passwordHash]
  );
}

const databaseResult = await query('SELECT current_database() AS name');
const projectResult = await query('SELECT COUNT(*)::int AS count FROM projects');
console.log(
  `Database initialized: ${databaseResult.rows[0].name} (${projectResult.rows[0].count} projects).`
);
await pool.end();
