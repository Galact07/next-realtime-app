import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(request:Request){
    try{
        const reqBody= await request.json();

        const {id:idToDecline} =  z.object({id:z.string()}).parse(reqBody);
        const session = await getServerSession(authOptions);

        if(!session){
            return new Response('Unauthorized',{status:401});
        }

        await db.srem(`user:${session.user.id}:incoming_friend_requests`,idToDecline);

        return new Response('Friend Request Declined',{status:200});
    }catch(error:any){
        if(error instanceof z.ZodError){
            return new Response(error.issues[0].message,{status:400});
        }
        return new Response(error.message,{status:500});
    }
}