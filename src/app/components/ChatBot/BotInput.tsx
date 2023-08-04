"use client"

import { cn } from '@/lib/util';
import { FC, HTMLAttributes } from 'react'
import TextareaAutosize from 'react-textarea-autosize';

interface BotInputProps extends HTMLAttributes<HTMLDivElement> {
}

const BotInput: FC<BotInputProps> = ({className,...props}) => {
  return (
    <div className={cn('border-t border-zinc-300',className)}>
    <div className='relative mt-4 overflow-hidden rounded-lg outline-none'>
    <TextareaAutosize
    rows={2}
    maxRows={4}
    className='disabled:opacity-50 pr-14 resize-none block w-full border-0 bg-zinc-100 py-1.5 text-gray-900 focus:ring-0 text-sm sm:leading-6'
    placeholder="What Do you Wanna Talk about?"
    />
    </div>
    </div>
  )
}

export default BotInput