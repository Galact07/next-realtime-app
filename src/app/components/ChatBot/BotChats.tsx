"use client"

import { FC } from 'react'
import { Accordion,AccordionItem,AccordionContent,AccordionTrigger } from '../ui/accordion'
import BotHeader from './BotHeader'
import BotInput from './BotInput'
import BotChatMessage from './BotChatMessage'

interface BotChatsProps {
  
}

const BotChats: FC<BotChatsProps> = ({}) => {
  return (
    <Accordion
    type='single'
    collapsible
    className='relative bg-white z-40 shadow border-none'
    >
      <AccordionItem value='item1'>
        <div className="fixed right-8  top-10 w-80 bg-white border border-gray-800 rounded-md overflow:hidden">
          <div className="w-full h-full flex flex-col">
            <AccordionTrigger className='px-6 border-b border-zinc-300'>
              <BotHeader/>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col h-60">
                <BotChatMessage className='px-2 py-3 flex-1'/>
                <BotInput className="px-4"/>
              </div>
            </AccordionContent>
          </div>
        </div>
      </AccordionItem>
    </Accordion>
  )
}

export default BotChats