"use client"

import { FC,ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import { BotMessageContextProvider } from '@/context/BotMessageContextProvider'
interface ProviderProps {
  children: ReactNode
}

const Provider: FC<ProviderProps> = ({children}) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <BotMessageContextProvider>
      <Toaster position='top-center' reverseOrder={false}/>
    {children}
      </BotMessageContextProvider>
    </QueryClientProvider>
 
  )
}

export default Provider