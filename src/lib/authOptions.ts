import {NextAuthOptions} from 'next-auth'
import { UpstashRedisAdapter } from '@next-auth/upstash-redis-adapter'
import { db } from '@/lib/db'
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import TwitterProvider from "next-auth/providers/twitter";
import { User } from '@/interfaces/User';
import { fetchRedis } from '@/helpers/redis';

export const authOptions:NextAuthOptions = {
    adapter:UpstashRedisAdapter(db), //adapter is used to store session data in redis and connect to data base 
    session:{
        strategy:'jwt'
    },
    pages:{
        signIn:'/login'
    },
    providers: [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_SECRET!,
        }),
        FacebookProvider({
          clientId: process.env.FACEBOOK_CLIENT_ID!,
          clientSecret: process.env.FACEBOOK_SECRET!,
        }),
        TwitterProvider({
          clientId: process.env.TWITTER_CLIENT_ID!,
          clientSecret: process.env.TWITTER_SECRET!,
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
          const dbUserResult = (await fetchRedis('get', `user:${token.id}`)) as
            | string
            | null
    
          if (!dbUserResult) {
            if (user) {
                
              token.id = user!.id
            }
    
            return token
          }
    
          const dbUser = JSON.parse(dbUserResult) as User
    
          return {
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            picture: dbUser.image,
          }
        },
        async session({ session, token }) {
          if (token) {
            session.user.id = token.id
            session.user.name = token.name
            session.user.email = token.email
            session.user.image = token.picture
          }
    
          return session
        },
        redirect() {
          return '/dashboard'
        },
      },

}
    




