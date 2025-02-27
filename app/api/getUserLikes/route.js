import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    try {
        const { rows } = await sql`
            SELECT p.*
            FROM sa_posts p
            JOIN sa_likes l ON p.post_id = l.post_id
            JOIN sa_users u ON l.user_id = u.user_id
            WHERE u.email = ${email}
            ORDER BY p.post_id DESC
        `;
        return NextResponse.json(rows);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Error fetching likes' }, { status: 500 });
    }
}