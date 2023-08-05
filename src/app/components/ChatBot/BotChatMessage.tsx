import { BotMessageContext } from '@/context/BotMessageContextProvider';
import { cn } from '@/lib/util'
import { FC, HTMLAttributes, useContext } from 'react'

interface BotChatMessageProps extends HTMLAttributes<HTMLDivElement>{}

const BotChatMessage: FC<BotChatMessageProps> = ({className,...props}) => {
    const {messages}= useContext(BotMessageContext);
    const inverseMessages=[...messages].reverse()
    return (
      <div
        {...props}
        className={cn(
          'flex flex-col-reverse gap-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch',
          className
        )}>
        <div className='flex-1 flex-grow' />
        {inverseMessages.map((message) => {
          return (
            <div className='chat-message' key={`${message.id}-${message.id}`}>
              <div
                className={cn('flex items-end', {
                  'justify-end': message.isUser,
                })}>
                <div
                  className={cn('flex flex-col rounded-lg space-y-2 text-sm max-w-xs mx-2 overflow-x-hidden', {
                    'bg-blue-600 text-white': message.isUser,
                    'bg-gray-200 text-gray-900': !message.isUser,
                  })}>
                  <p
                    className={cn('px-4 py-2 rounded-lg', {
                      'bg-blue-600 text-white': message.isUser,
                      'bg-gray-200 text-gray-900': !message.isUser,
                    })}>
                 {message.content}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
}

export default BotChatMessage