import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const term = searchParams.get('term');

    try {
        const { rows } = await sql`
            SELECT 
                u.*,
                COALESCE(
                    (
                        SELECT json_agg(
                            json_build_object(
                                'post_id', p.post_id,
                                'url', p.url,
                                'content', p.content
                            )
                        )
                        FROM sa_posts p 
                        WHERE p.user_id = u.user_id
                    ),
                    '[]'::json
                ) as posts
            FROM sa_users u
            WHERE u.username ILIKE ${`%${term}%`}
            GROUP BY u.user_id, u.username, u.picture
            LIMIT 10
        `;

        return NextResponse.json(rows);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Error searching users' }, { status: 500 });
    }
}