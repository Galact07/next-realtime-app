"use client"

import { FC } from 'react'
import AddFriendButton from '@/app/components/ui/AddFriendButton'
interface pageProps {
  
}

const AddFriend: FC<pageProps> = ({}) => {
  return (
    <main className="pt-8">
        <h1 className="font-bold text-yellow-500 text-5xl mb-8">
            Add a Friend
        </h1>
        <AddFriendButton/>
    </main>
  )
}

export default AddFriend;