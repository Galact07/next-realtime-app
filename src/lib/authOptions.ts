import {NextAuthOptions} from 'next-auth'
import { UpstashRedisAdapter } from '@next-auth/upstash-redis-adapter'
import { db } from '@/lib/db'
import GoogleProvider from "next-auth/providers/google";
import { User } from '@/interfaces/User';

export const authOptions:NextAuthOptions = {
    adapter:UpstashRedisAdapter(db),
    session:{
        strategy:'jwt'
    },
    pages:{
        signIn:'/login'
    },
    providers: [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks:{
        async jwt({token, user}) {
            const cachedUser= await db.get(`user:${token.id}`) as User |null;

            if(!cachedUser){
               token.id=user.id
               return token;
            }
            return {
                id:cachedUser.id,
                name:cachedUser.name,
                email:cachedUser.email,
                image:cachedUser.image,
            }
        },

        async session({session, token}) {
          if(token){
            session.user.id=token.id;
            session.user.name=token.name;
            session.user.email=token.email;
            session.user.image=token.picture;
          }
          return session;

        },
        redirect(){
            return  `/dashboard`
        }
    }

}
    


