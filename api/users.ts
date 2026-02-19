
import { sql } from '@vercel/postgres';

export default async function handler(request: Request) {
  if (request.method === 'GET') {
    try {
      const { rows } = await sql`SELECT * FROM users ORDER BY created_at DESC;`;
      return new Response(JSON.stringify(rows), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Database connection failed' }), { status: 500 });
    }
  }

  if (request.method === 'POST') {
    try {
      const body = await request.json();
      const { name, email, role, avatar } = body;
      
      const { rows } = await sql`
        INSERT INTO users (full_name, email, role, avatar_url)
        VALUES (${name}, ${email}, ${role}, ${avatar})
        RETURNING *;
      `;
      
      return new Response(JSON.stringify(rows[0]), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to create user' }), { status: 500 });
    }
  }
}
