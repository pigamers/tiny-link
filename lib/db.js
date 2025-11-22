import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export async function createLinksTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS links (
      id SERIAL PRIMARY KEY,
      original_url TEXT NOT NULL,
      short_code VARCHAR(50) UNIQUE NOT NULL,
      clicks INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      last_clicked TIMESTAMP
    )
  `;
  
  // Check if last_clicked column exists and add it if not
  const columnExists = await sql`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'links' AND column_name = 'last_clicked'
  `;
  
  if (columnExists.length === 0) {
    await sql`ALTER TABLE links ADD COLUMN last_clicked TIMESTAMP`;
  }
}

export async function createLink(originalUrl, shortCode) {
  try {
    const istTime = new Date(new Date().getTime() + (5.5 * 60 * 60 * 1000)).toISOString().slice(0, 19);
    const result = await sql`
      INSERT INTO links (original_url, short_code, created_at)
      VALUES (${originalUrl}, ${shortCode}, ${istTime})
      RETURNING *
    `;
    return result[0];
  } catch (error) {
    if (error.code === '23505') { // Unique constraint violation
      throw new Error('Short code already exists');
    }
    throw error;
  }
}

export async function getLink(shortCode) {
  const result = await sql`SELECT * FROM links WHERE short_code = ${shortCode}`;
  return result[0];
}

export async function incrementClicks(shortCode) {
  console.log('Incrementing clicks for:', shortCode);
  const istTime = new Date(new Date().getTime() + (5.5 * 60 * 60 * 1000)).toISOString().slice(0, 19);
  const result = await sql`
    UPDATE links SET clicks = clicks + 1, last_clicked = ${istTime} WHERE short_code = ${shortCode}
    RETURNING *
  `;
  console.log('Increment result:', result);
  return result[0];
}

export async function getAllLinks() {
  return await sql`
    SELECT * FROM links ORDER BY created_at DESC
  `;
}

export async function deleteLink(shortCode) {
  await sql`DELETE FROM links WHERE short_code = ${shortCode}`;
}