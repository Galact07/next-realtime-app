import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { nanoid } from "nanoid";
import { messageArrayValidator, messageSchema } from "@/lib/validations/message";
import {Message} from "@/lib/validations/message";
import { User } from "@/interfaces/User";
import { pusherServer } from "@/lib/pusher";
import { pusherKey } from "@/lib/util";

export async function POST(request:Request){
    try{
       const reqBody = await request.json();
       const{text,chatId} = reqBody;

       const session = await getServerSession(authOptions);
       if(!session){
        return notFound();
       }

       const [user1,user2] = chatId.split("--");

       if(session.user.id !== user1 && session.user.id !== user2){
        return notFound();
       }

       const friendId=  session.user.id ===user1 ? user2 : user1;

       const friends = await fetchRedis('smembers', `user:${session.user.id}:friends`) as string[];
       const isFriend = friends.includes(friendId);

       if(!isFriend){
        return new Response("This person is not your friend",{status:401});
       }

       const jsonSender = await fetchRedis('get',`user:${session.user.id}`) as string;
       const sender = JSON.parse(jsonSender) as User;

       const messageData :Message={
        id:nanoid(),
        senderId:sender.id,
        content:text,
        sentTime:Date.now()
       } 

       const messageValid=  messageSchema.parse(messageData);

       await pusherServer.trigger(
        pusherKey(`chat:${chatId}:messages`),
        'incoming_friend_messages',
       messageValid
      )

     await pusherServer.trigger(
        pusherKey(`user:${friendId}:newmessage`),
        'new_message',
        {
            ...messageValid,
            senderImg:sender.image,
            senderName:sender.name
        }
      )

       await db.zadd(`chat:${chatId}:messages`,{
        score: Date.now(),
        member: JSON.stringify(messageValid),
       });

       return new Response("Message sent",{status:200});

    }catch(error:any){
        if (error instanceof Error) {
            return new Response(error.message, { status: 500 })
          }
      
          return new Response('Internal Server Error', { status: 500 })
    }
}