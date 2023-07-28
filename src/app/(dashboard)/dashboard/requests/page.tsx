import ShowFriendRequests from '@/app/components/ShowFriendRequests';
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
    
    const getIncomingFriendRequests= await fetchRedis('smembers',`user:${session.user.id}:incoming_friend_requests`) as string[];

    const getRequestsInfo=await Promise.all(
        getIncomingFriendRequests.map(async (senderId)=>{
        const user=(await fetchRedis('get',`user:${senderId}`)) as string;
        const userObj:User=JSON.parse(user) as User;
        return {
            senderId,
            senderEmail:userObj.email
        };
    }));   


  return (
    <main className='pt-8'>
    <h1 className='font-bold text-5xl mb-8'>Add a friend</h1>
    <div className='flex flex-col gap-4'>
      <ShowFriendRequests
        incomingFriendRequests={getRequestsInfo}
        sessionId={session.user.id}
      />
    </div>
  </main>
  )
}

export default ShowRequests