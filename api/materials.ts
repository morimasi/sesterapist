
import { sql } from '@vercel/postgres';

export default async function handler(request: Request) {
  if (request.method === 'POST') {
    try {
      const body = await request.json();
      const { title, description, type, content, image, settings } = body;
      
      // JSON verilerini string formatında saklamak için
      const contentJson = JSON.stringify(content);

      const { rows } = await sql`
        INSERT INTO materials (title, description, type, content, image_url, target_sound, age_group)
        VALUES (${title}, ${description}, ${type}, ${contentJson}, ${image}, ${settings.targetSound}, ${settings.ageGroup})
        RETURNING *;
      `;
      
      return new Response(JSON.stringify(rows[0]), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ error: 'Failed to save material' }), { status: 500 });
    }
  }
  
  if (request.method === 'GET') {
      const { rows } = await sql`SELECT * FROM materials ORDER BY created_at DESC LIMIT 20;`;
      return new Response(JSON.stringify(rows), {
        headers: { 'Content-Type': 'application/json' },
      });
  }
}
