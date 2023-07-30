"use client"
import { cn } from '@/lib/util'
import { Message } from '@/lib/validations/message'
import { format } from 'date-fns'
import { FC, useRef, useState } from 'react'
import Image from 'next/image'
import { User } from '@/interfaces/User'

interface MessageProps {
  initialMessages: Message[],
  sessionId:string,
  sessionImg:string | null | undefined,
  friend:User
}

const Messages: FC<MessageProps> = ({initialMessages,sessionId,sessionImg,friend}) => {

    const [messages,setMessages] = useState<Message[]>(initialMessages)

    const scrollDownRef = useRef<HTMLDivElement | null >(null)

  return (
    <div id='messageSection'
     className="flex w-full h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
        <div ref={scrollDownRef}/>
        {messages.map((message,index)=>{
            const currentUser= message.senderId === sessionId;
            const lastMessageSameUser = messages[index-1]?.senderId === messages[index].senderId;
            return (
                <div
                  className='chat-message'
                  key={`${message.id}-${message.sentTime}`}>
                  <div
                    className={cn('flex items-end', {
                      'justify-end': currentUser,
                    })}>
                    <div
                      className={cn(
                        'flex flex-col space-y-2 text-base max-w-xs mx-2',
                        {
                          'order-1 items-end': currentUser,
                          'order-2 items-start': !currentUser,
                        }
                      )}>
                      <span
                        className={cn('px-4 py-2 rounded-lg inline-block', {
                          'bg-indigo-600 text-white': currentUser,
                          'bg-gray-200 text-gray-900': !currentUser,
                          'rounded-br-none':
                            !lastMessageSameUser && currentUser,
                          'rounded-bl-none':
                            !lastMessageSameUser && !currentUser,
                        })}>
                        {message.content}{' '}
                        <span className='ml-2 text-xs text-gray-400'>
                          {format(new Date(message.sentTime), 'HH:mm')}
                        </span>
                      </span>
                    </div>
      
                    <div
                className={cn('relative w-6 h-6', {
                  'order-2': currentUser,
                  'order-1': !currentUser,
                  invisible: lastMessageSameUser,
                })}>
                <Image
                  fill
                  src={
                    currentUser ? (sessionImg as string) : friend.image
                  }
                  alt='Profile picture'
                  referrerPolicy='no-referrer'
                  className='rounded-full'
                />
              </div>
                  </div>
                </div>
              )
        })}
    </div>
  )
}

export default Messages