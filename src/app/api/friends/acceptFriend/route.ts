import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(request:Request){
    try{
        const reqBody= await request.json();

        const {id:idToAddAsFriend} =  z.object({id:z.string()}).parse(reqBody);
        const session = await getServerSession(authOptions);
        if(!session){
            return new Response('Unauthorized',{status:401});
        }

        const AlreadyFriends= await fetchRedis('sismember',`user:${session.user.id}:friends`,idToAddAsFriend);
        if(AlreadyFriends){
            return new Response('Already Friends',{status:400});
        }

        const isFriendRequest= await fetchRedis('sismember',`user:${idToAddAsFriend}:incoming_friend_requests`,session.user.id);

        if(isFriendRequest){
            return new Response('Friend Request not sent',{status:400});
        }

        await db.sadd(`user:${idToAddAsFriend}:friends`,session.user.id);
        await db.sadd(`user:${session.user.id}:friends`,idToAddAsFriend);
        await db.srem(`user:${session.user.id}:incoming_friend_requests`,idToAddAsFriend);

        return new Response('Friend Added',{status:200});
    }catch(error:any){
        if(error instanceof z.ZodError){
            return new Response(error.issues[0].message,{status:400});
        }
        return new Response(error.message,{status:500});
    }
}