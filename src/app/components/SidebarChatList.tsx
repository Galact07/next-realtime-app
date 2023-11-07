'use client'

import { User } from '@/interfaces/User'
import { pusherClient } from '@/lib/pusher'
import { chatPath, cn, pusherKey } from '@/lib/util'
import { usePathname, useRouter } from 'next/navigation'
import { FC,useState,useEffect } from 'react'
import { type Toast, toast } from 'react-hot-toast'
import Image from 'next/image'

interface SidebarChatListProps {
  sessionId:string,
  friends:User[]
}

interface ExtendedMessage extends Message{
  senderImg:string
  senderName:string
}

const SidebarChatList: FC<SidebarChatListProps> = ({ friends, sessionId }) => {
    const router = useRouter();
    const pathName= usePathname();
    const[unSeenMessages,setUnSeenMessages]=useState<Message[]>([]);
    const [currentChats,setCurrentChats]=useState<User[]>(friends);

    useEffect(()=>{
       if(pathName?.includes('chat')){
        setUnSeenMessages((prev)=>{
            return prev.filter((message)=> !pathName.includes(message.senderId) )
        }
        )
       }
    },[pathName])

    useEffect(()=>{
      pusherClient.subscribe(pusherKey(`user:${sessionId}:newmessage`));
      pusherClient.subscribe(pusherKey(`user:${sessionId}:friend`));

      const chatHandler=(message:ExtendedMessage)=>{
        const diffRoute = pathName!==`/dashboard/chat/${chatPath(sessionId,message.senderId)}`;

        if(!diffRoute){
          return;
        }

        toast.custom((t)=>(
          <ToastMessageUnseen message={message} sessionId={sessionId} t={t} />
        ))

        setUnSeenMessages((prev)=>{
          return [...prev,message]
        })
      }

      const friendHandler=(friend:User)=>{
        setCurrentChats((prev)=>{
          return [...prev,friend]
        })
      }
      pusherClient.bind('new_message',chatHandler);
      pusherClient.bind('new_friend',friendHandler);

      return ()=>{
        pusherClient.unsubscribe(pusherKey(`user:${sessionId}:newmessage`));
      pusherClient.unsubscribe(pusherKey(`user:${sessionId}:friend`));
        pusherClient.unbind('new_message',chatHandler);
        pusherClient.unbind('new_friend',friendHandler);
      }
    },[pathName,sessionId,router])


  return (
    <ul role='list' className='max-h-[25rem] overflow-y-auto -mx-2 space-y-1'>
        {currentChats.sort().map((friend)=>{
            const unseenFriendMessagesCount = unSeenMessages.filter((unseenMsg) => {
              return unseenMsg.senderId === friend.id
            }).length
            return(
                <li key={friend.id}>
            <a
              href={`/dashboard/chat/${chatPath(sessionId,friend.id)}`}
              className='text-yellow-500 hover:text-white hover:bg-yellow-500 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'>
              {friend.name}
              {unseenFriendMessagesCount > 0 ? (
                <div className='bg-yellow-700 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center'>
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

interface ToastMessageUnseenProps {
  t:Toast
  sessionId:string
  message:ExtendedMessage
}

export const ToastMessageUnseen:FC<ToastMessageUnseenProps> = ({t,sessionId,message}) => {
  return (
    <div
    className={cn(
      'max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5',
      { 'animate-enter': t.visible, 'animate-leave': !t.visible }
    )}>
    <a
      onClick={() => toast.dismiss(t.id)}
      href={`/dashboard/chat/${chatPath(sessionId, message.senderId)}`}
      className='flex-1 w-0 p-4'>
      <div className='flex items-start'>
        <div className='flex-shrink-0 pt-0.5'>
          <div className='relative h-10 w-10'>
            <Image
              fill
              referrerPolicy='no-referrer'
              className='rounded-full'
              src={message.senderImg}
              alt={`${message.senderImg} profile picture`}
            />
          </div>
        </div>

        <div className='ml-3 flex-1'>
          <p className='text-sm font-medium text-gray-900'>{message.senderName}</p>
          <p className='mt-1 text-sm text-gray-500'>{message.content}</p>
        </div>
      </div>
    </a>

    <div className='flex border-l border-gray-200'>
      <button
        onClick={() => toast.dismiss(t.id)}
        className='w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500'>
        Close
      </button>
    </div>
  </div>
  )
}