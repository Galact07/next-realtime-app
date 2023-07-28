import { fetchRedis } from '@/helpers/redis';
import { User } from '@/interfaces/User';
import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import { FC } from 'react'

interface ShowRequestsProps {
  
}

const ShowRequests: FC<ShowRequestsProps> =async ({}) => {

    const session = await getServerSession(authOptions);
    if(!session){
        return notFound();
    }
    
    const getIncomingFriendRequests= await fetchRedis('smembers',`user:${session.user.id}:incoming_friend_requests`) as User[];

    const getRequestsInfo=await Promise.all(
        getIncomingFriendRequests.map(async (senderId)=>{
        const user=(await fetchRedis('get',`user:${senderId}`)) as User;
        return {
            senderId,
            senderEmail:user.email
        };
    }));   


  return <div>page</div>
}

export default ShowRequests