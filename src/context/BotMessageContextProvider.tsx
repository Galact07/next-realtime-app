import { BotChatMessage } from "@/lib/validations/botMessage";
import { createContext, useState } from "react";

export const BotMessageContext= createContext<{
    messages:BotChatMessage[],
    messageUpdating:boolean,
    setMessageUpdating:(value:boolean)=>void,
    addMessage:(message:BotChatMessage)=>void,
    removeMessage:(id:string)=>void,
    updateMessage:(id:string,updateFunction:(prevString:string)=>string)=>void,
}>({
    messages:[],
    messageUpdating:false,
    setMessageUpdating:()=>{},
    addMessage:()=>{},
    removeMessage:()=>{},
    updateMessage:()=>{},
})

export const BotMessageContextProvider=({children}:{children:React.ReactNode})=>{
    const [messages,setMessages]=useState<BotChatMessage[]>([]);
    const [messageUpdating,setMessageUpdating]=useState<boolean>(false);

    const addMessage=(message:BotChatMessage)=>{
        setMessages(prev=>[...prev,message])
    }

    const removeMessage=(id:string)=>{
        setMessages(prev=>prev.filter(message=>message.id!==id))
    }

    const updateMessage=(id:string,updateFunction:(prevString:string)=>string)=>{
        setMessages(prev=>prev.map(message=>{
            if(message.id===id){
                return {...message,content:updateFunction(message.content)}
            }
            return message;
        }))
    }

    return (
        <BotMessageContext.Provider value={{
            messages,
            messageUpdating,
            setMessageUpdating,
            addMessage,
            removeMessage,
            updateMessage
        }}>
            {children}
        </BotMessageContext.Provider>
    )
}