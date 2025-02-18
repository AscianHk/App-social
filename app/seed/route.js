import { sql } from "@vercel/postgres"

export async function GET() {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`
    await sql`DROP TABLE IF EXISTS sa_LIKES`
    await sql`DROP TABLE IF EXISTS sa_COMMENTS`
    await sql`DROP TABLE IF EXISTS sa_POSTS`
    await sql`DROP TABLE IF EXISTS sa_USERS`
    
    
    await sql`CREATE TABLE IF NOT EXISTS sa_users(
        user_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        username text,
        name text,
        picture text,
        email text UNIQUE
    )`;
    
    await sql`CREATE TABLE IF NOT EXISTS sa_posts(
    post_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES sa_users(user_id),
    content TEXT,
    url TEXT
    )`;

    await sql`CREATE TABLE IF NOT EXISTS sa_likes (
        user_id UUID REFERENCES sa_users(user_id),
        post_id UUID REFERENCES sa_posts(post_id),
        PRIMARY KEY (user_id, post_id)
    )`;

    await sql`CREATE TABLE IF NOT EXISTS sa_comments (
        comment_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        post_id UUID REFERENCES sa_posts(post_id),
        user_id UUID REFERENCES sa_users(user_id),
        content TEXT,
        created_at TIMESTAMP DEFAULT now()
    )`;

    return Response.json({"message": "Database seed the guay"});
}