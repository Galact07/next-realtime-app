"use client"

import { cn } from '@/lib/util';
import { FC, HTMLAttributes, useContext, useRef, useState } from 'react'
import TextareaAutoSize from 'react-textarea-autosize';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { BotChatMessage } from '@/lib/validations/botMessage';
import { nanoid } from 'nanoid';
import { BotMessageContext } from '@/context/BotMessageContextProvider';
import { set } from 'date-fns';
import { CornerDownLeft, Loader2 } from 'lucide-react';

interface BotInputProps extends HTMLAttributes<HTMLDivElement> {
}

const BotInput: FC<BotInputProps> = ({className,...props}) => {

  const {messages,messageUpdating,setMessageUpdating,addMessage,removeMessage,updateMessage} = useContext(BotMessageContext);

  const textAreaRef= useRef<HTMLTextAreaElement>(null);

  const [inputMessage,setInputMessage]=useState('');

  const {mutate:sendMessage,isLoading,isError}= useMutation({
    mutationFn: async(message:BotChatMessage)=>{
      {const response= await fetch('/api/botmessages',{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({messages:[message]})
      })
      return response.body;
    }
    },
    onMutate:(message)=>{
      addMessage(message);
    },
    onSuccess:async(stream)=>{
      if(!stream) throw new Error('No Response');
      const responseData:BotChatMessage={
        id:nanoid(),
        content:"",
        isUser:false
      }
      addMessage(responseData);
      setMessageUpdating(true);
      const reader=stream.getReader();
      const decoder=new TextDecoder();
      let done= false;
      while(!done){
        const {value,done:doneReading}=await reader.read();
        done=doneReading;
        const chunkVal=decoder.decode(value);
        updateMessage(responseData.id,(prevString:string)=>prevString+chunkVal);
      }
      setMessageUpdating(false);
      setInputMessage("");

      setTimeout(()=>{
        textAreaRef.current?.focus();
      },10);
    },
    onError:(_,message)=>{
      toast.error("Error Sending Message");
      removeMessage(message.id);
      textAreaRef.current?.focus();
    }
  })

  return (
    <div className={cn('border-t border-zinc-300',className)}>
    <div className='relative mt-4 overflow-hidden rounded-lg outline-none'>
    <TextareaAutoSize
    ref={textAreaRef}
    rows={2}
    maxRows={4}
    disabled={isLoading}
    className='disabled:opacity-50 pr-14 resize-none block w-full border-0 bg-zinc-100 py-1.5 text-gray-900 focus:ring-0 text-sm sm:leading-6'
    placeholder="What Do you Wanna Talk about?"
    onChange={(e)=>{setInputMessage(e.target.value)}}
    onKeyDown={(e=>{
        if(e.key==='Enter' && !e.shiftKey){
            e.preventDefault()

            const message={
                id:nanoid(),
                content:inputMessage,
                isUser:true
            } as BotChatMessage    
            sendMessage(message);
            
        }
        
    })}
    />

<div className='absolute inset-y-0 right-0 flex py-1.5 pr-1.5'>
          <kbd className='inline-flex items-center rounded border bg-white border-gray-200 px-1 font-sans text-xs text-gray-400'>
            {isLoading ? (
              <Loader2 className='w-3 h-3 animate-spin' />
            ) : (
              <CornerDownLeft className='w-3 h-3' />
            )}
          </kbd>
        </div>

        <div
          className='absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-indigo-600'
          aria-hidden='true'
        />
    </div>
  </div>
  )
}

export default BotInput