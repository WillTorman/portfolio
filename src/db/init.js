import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import bcrypt from 'bcryptjs';
import { pool, query } from './pool.js';

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

console.log('Database initialized.');
await pool.end();
