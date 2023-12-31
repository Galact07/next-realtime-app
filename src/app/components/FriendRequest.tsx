"use client"
import { pusherClient } from '@/lib/pusher'
import { pusherKey } from '@/lib/util'
import { User } from 'lucide-react'
import Link from 'next/link'
import { FC, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface FriendRequestProps {
  sessionId:string,
  initialFriendRequests:number
}


const FriendRequest: FC<FriendRequestProps> = ({sessionId,initialFriendRequests}) => {
  const [friendRequests,setFriendRequests]=useState<number>(initialFriendRequests);
  pusherClient.subscribe(pusherKey(`user:${sessionId}:friend`));

  useEffect(()=>{
    pusherClient.subscribe(pusherKey(`user:${sessionId}:incoming_friend_requests`));
  
    const friendRequestHandler=({senderId,senderEmail}:IncomingRequest)=>{
     setFriendRequests(friendRequests=>friendRequests+1);
      toast.success('New friend request',{icon:'👋'});
    }

    const requestCount=()=>{
      setFriendRequests(friendRequests=>friendRequests-1);
    }
  
    pusherClient.bind('incoming_friend_requests',friendRequestHandler);
    pusherClient.bind('new_friend',requestCount);
  
    return ()=> {
      pusherClient.unsubscribe(pusherKey(`user:${sessionId}:incoming_friend_requests`))
      pusherClient.unbind('incoming_friend_requests',friendRequestHandler);
      pusherClient.subscribe(pusherKey(`user:${sessionId}:friend`));
      pusherClient.bind('new_friend',requestCount);
    }
  },)

  return(
    <Link
    href='/dashboard/requests'
    className='text-white-700  hover:bg-yellow-500 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold'>
    <div className='text-yellow-500 border-yellow-500 group-hover:border-yellow-800 group-hover:text-yellow-500 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'>
      <User className='h-4 w-4' />
    </div>
    <p className='truncate'>Friend Requests</p>
    {friendRequests>0&&<span className='rounded-full w-5 h-5 text-xs flex justify-center items-center text-white bg-yellow-500'>{friendRequests}</span>
    }
  </Link>
  )
}

export default FriendRequest