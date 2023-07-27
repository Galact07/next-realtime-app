import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { addFriend } from "@/lib/validations/addFriend";
import { AxiosError } from "axios";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function POST(request:Request)  {
    try{
        const reqBody = await request.json();
        const {email:emailToAddFriend}= addFriend.parse(reqBody.email);
        console.log(emailToAddFriend);


        const idToAdd = (await fetchRedis(
            'get',
            `user:email:${emailToAddFriend}`
          )) as string
      console.log(idToAdd);   
          if (!idToAdd) {
            return new Response(`This person does not exist.${emailToAddFriend}`, { status: 400 })
          }
      
      

        const session = await getServerSession(authOptions);

        if (!session) {
            return new Response('Unauthorized', { status: 401 })
          }
      

          if (idToAdd === session.user.id) {
            return new Response('You cannot add yourself as a friend', {
              status: 400,
            })
          }
      

        const alreadyAdded = (await fetchRedis(
            'sismember',
            `user:${idToAdd}:incoming_friend_requests`,
            session.user.id)) as 0 | 1; 

        if(alreadyAdded){
            return new Response('Already added this user', { status: 400 })
        }

        const alreadyFriends =( await fetchRedis(
            'sismember',
            `user:${session.user.id}:friends`,
            idToAdd)) as 0 | 1; 

        if(alreadyFriends){
            return new Response('Already friends with this user', { status: 400 })

        }
        await db.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id)

            return new Response('oK')

      
        
    }catch(error:any){
        if (error instanceof z.ZodError) {
            return new Response('Invalid request payload', { status: 422 })
          }
      
          return new Response('Invalid request', { status: 400 })
    }
}