'use client'

import { User } from '@/interfaces/User'
import { chatPath } from '@/lib/util'
import { usePathname, useRouter } from 'next/navigation'
import { FC,useState,useEffect } from 'react'

interface SidebarChatListProps {
  sessionId:string,
  friends:User[]
}

const SidebarChatList: FC<SidebarChatListProps> = ({ friends, sessionId }) => {
    const router = useRouter();
    const pathName= usePathname();
    const[unSeenMessages,setUnSeenMessages]=useState<Message[]>([]);

    useEffect(()=>{
       if(pathName?.includes('chat')){
        setUnSeenMessages((prev)=>{
            return prev.filter((message)=> !pathName.includes(message.senderId) )
        }
        )
       }
    },[pathName])


  return (
    <ul role='list' className='max-h-[25rem] overflow-y-auto -mx-2 space-y-1'>
        {friends.sort().map((friend)=>{
            const unseenFriendMessagesCount = unSeenMessages.filter((unseenMsg) => {
              return unseenMsg.senderId === friend.id
            }).length
            return(
                <li key={friend.id}>
            <a
              href={`/dashboard/chat/${chatPath(sessionId,friend.id)}`}
              className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'>
              {friend.name}
              {unseenFriendMessagesCount > 0 ? (
                <div className='bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center'>
                  {unseenFriendMessagesCount}
                </div>
              ) : null}
            </a>
          </li>
            )
        })}
    </ul>
  )
}

export default SidebarChatList