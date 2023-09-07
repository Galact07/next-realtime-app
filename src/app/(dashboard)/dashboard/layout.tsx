import { FC, ReactNode } from 'react'
import { Logos,Icons } from '@/app/components/Logo'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { User2 } from 'lucide-react'
import SignOutButton from '@/app/components/ui/SignOutButton'
import FriendRequest from '@/app/components/FriendRequest'
import { fetchRedis } from '@/helpers/redis'
import { User } from '@/interfaces/User'
import { getFriendsId } from '@/helpers/getFriendsId'
import SidebarChatList from '@/app/components/SidebarChatList'
import MobileLayout from '@/app/components/MobileLayout'
import { SidebarOptions } from '@/interfaces/SidebarOptions'
import icon from '../../../../public/icon_bgremove.png'

interface LayoutProps {
  children: ReactNode
}

// export interface SidebarOptions{
//   id:number,
//   name:string,
//   Logo:Logos,
//   path:string
// }

export const sidebarOptions:SidebarOptions[]=[
  {
    id:1,
    name:"Add Friend",
    Logo:"UserPlus",
    path:"/dashboard/add"
  }
]


const Layout =async ({children}:LayoutProps) => {
  const session = await getServerSession(authOptions);
  if(!session){
    return notFound();
  }

  const friendRequest = (await fetchRedis(
    'smembers',
    `user:${session.user.id}:incoming_friend_requests`
  ) as User[]
).length

const friends = await getFriendsId(session.user.id);


  return (
    <div className='w-full flex h-screen md:space-x-2 md:p-2'>
      <div className="md:hidden">
        <MobileLayout friends={friends} session={session} unseenRequestCount={friendRequest}/>
      </div>
      <div className='hidden md:flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto  bg-gray-800 px-4 md:rounded-lg'>
      <Link href='/dashboard' className='flex h-16 shrink-0 justify-center '>
        <Image className="h-16 w-auto hover:scale-90 duration-200" src={icon} alt="icon"/>
        </Link>
        {friends.length > 0 ? (
          <div className='text-xs font-semibold leading-6 text-white'>
            Your chats
          </div>
        ) : null}
        <nav className='flex flex-1 flex-col'>
          <ul role='list' className='flex flex-1 flex-col gap-y-4'>
          <li>
              <SidebarChatList sessionId={session.user.id} friends={friends} />
            </li>
            <li>
              <div className='text-xs font-semibold leading-6 text-white'>
                Overview
              </div>

              <ul role='list' className='-mx-2 mt-2 space-y-1'>
                {sidebarOptions.map((option) => {
                  const Icon = Icons[option.Logo]
                  return (
                    <li key={option.id}>
                      <Link
                        href={option.path}
                        className='text-white-700  hover:bg-yellow-500 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold'>
                        <span className='text-yellow-500 border-yellow-500 group-hover:border-yellow-800 group-hover:text-yellow-500 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'>
                          <Icon className='h-4 w-4' />
                        </span>

                        <span className='truncate'>{option.name}</span>
                      </Link>
                    </li>
                  )
                })}
                <FriendRequest sessionId={session.user.id} initialFriendRequests={friendRequest}/>
              </ul>
            </li>
            <li className=' mt-auto flex justify-start'>
              <div className='flex  items-center gap-x-4 px-2 py-3 text-sm font-semibold leading-6 text-gray-900'>
                <div className='relative h-8 w-8 bg-gray-50 rounded-full'>
                  <Image
                    fill
                    referrerPolicy='no-referrer'
                    className='rounded-full'
                    src={session.user.image || ""}
                    alt='Your profile picture'
                  />
                </div>

                <span className='sr-only'>Your profile</span>
                <div className='flex flex-col'>
                  <span aria-hidden='true' className=' text-white'>{session.user.name}</span>
                  <span className='text-xs text-zinc-400' aria-hidden='true'>
                    {session.user.email}
                  </span>
                </div>
              </div>

              <SignOutButton className='h-full aspect-square text-yellow-500 border-none hover:bg-gray-800 hover:text-yellow-500 hover:scale-90 duration-200' />
            </li>
          </ul>
        </nav>
      </div>
      <aside className='max-h-screen container md:rounded-lg py-16 md:py-12 px-4 w-full bg-gray-800'>
        {children}
      </aside>
    </div>
    )
}

export default Layout