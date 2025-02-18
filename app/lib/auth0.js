import { Auth0Client } from "@auth0/nextjs-auth0/server"
import { sql } from '@vercel/postgres';

export const uid = async () => {
  const session = await auth0.getSession();
  return session?.user?.user_id || null;
};

export const auth0 = new Auth0Client({
    async beforeSessionSaved(session, idToken) {
      
      if (!session || !session.user) {
        console.error("La sesión o el usuario no están definidos.");
        return session;
      }
        
      const { nickname, name, picture, email } = session.user;
      
      if (!email) {
        console.error("El usuario no tiene un email asociado.");
        return session;
      }
        try {
          console.log(
            `INSERT INTO sa_users(username,name,picture,email) 
            VALUES(
                ${nickname || "Anon"}, ${name || "Not name"}, ${picture || ""}, ${email})
            ON CONFLICT (email) DO NOTHING 
            `)
            await sql`INSERT INTO sa_users(username,name,picture,email) 
            VALUES(
                ${nickname || "Anon"}, ${name || "Not name"}, ${picture || ""}, ${email})
            ON CONFLICT (email) DO NOTHING 
            `;
            
        } catch(e)
        {
          console.error("Error al instertar el usuario", e);
        }

        let user_id =null;
        try {
         
          const result = await sql`SELECT user_id FROM sa_users WHERE email=${email}`;
          
          if (result.rows.length > 0) {
              user_id = result.rows[0].user_id;
          }

      } catch (e) {
          console.error("Error al consultar la base de datos:", e);
      }

        return {
          ...session,
          user: {
            ...session.user,
            user_id: user_id,
          },
        }
      },
})