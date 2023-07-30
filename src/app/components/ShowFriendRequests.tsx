"use client"

import { FC,useEffect,useState } from 'react'
import FriendRequest from './FriendRequest';
import { Check, UserPlus, X } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { pusherClient } from '@/lib/pusher'
import { pusherKey } from '@/lib/util';
import { toast } from 'react-hot-toast';


interface ShowFriendRequestsProps {
  incomingFriendRequests:IncomingRequest[];
  sessionId:string;
}

const ShowFriendRequests: FC<ShowFriendRequestsProps> = ({incomingFriendRequests,sessionId}) => {
  const router=useRouter();
  const [friendRequests,setFriendRequests]=useState<IncomingRequest[]>(incomingFriendRequests);

  const acceptFriend = async(senderId:string)=>{
      try{
        await axios.post('/api/friends/acceptFriend',{id:senderId});
        setFriendRequests((prev) =>
        prev.filter((request) => request.senderId !== senderId)
      )
  
      router.refresh()
      }catch(error:any){
        return new Response(JSON.stringify({error:error.message}),{status:500});
      }
  }


  const denyFriend = async(senderId:string)=>{
    try{
      console.log(senderId +": sessionId");
      await axios.post('/api/friends/denyFriend',{id:senderId});
      setFriendRequests((prev) =>
      prev.filter((request) => request.senderId !== senderId)
    )

    router.refresh()
    }catch(error:any){
      return new Response(JSON.stringify({error:error.message}),{status:500});
    }
}

useEffect(()=>{
  pusherClient.subscribe(pusherKey(`user:${sessionId}:incoming_friend_requests`));

  const friendRequestHandler=()=>{
    toast.success('New friend request',{icon:'👋'});
    console.log('new friend request'); 
  }

  pusherClient.bind('incoming_friend_requests',friendRequestHandler);

  return ()=> {
    pusherClient.unsubscribe(pusherKey(`user:${sessionId}:incoming_friend_requests`))
    pusherClient.unbind('incoming_friend_requests',friendRequestHandler);
  }
},[])

  return (
    <>
    {friendRequests.length === 0 ? (
      <p className='text-sm text-zinc-500'>Nothing to show here...</p>
    ) : (
      friendRequests.map((request) => (
        <div key={request.senderId} className='flex gap-4 items-center'>
          <UserPlus className='text-black' />
          <p className='font-medium text-lg'>{request.senderEmail}</p>
          <button
            onClick={() => acceptFriend(request.senderId)}
            aria-label='accept friend'
            className='w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md'>
            <Check className='font-semibold text-white w-3/4 h-3/4' />
          </button>

          <button
            onClick={() => denyFriend(request.senderId)}
            aria-label='deny friend'
            className='w-8 h-8 bg-redW-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md'>
            <X className='font-semibold text-white w-3/4 h-3/4' />
          </button>
        </div>
      ))
    )}
  </>
  )
}

export default ShowFriendRequests