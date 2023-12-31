import { getFriendsId } from '@/helpers/getFriendsId';
import { fetchRedis } from '@/helpers/redis';
import { authOptions } from '@/lib/authOptions';
import { chatPath } from '@/lib/util';
import { ChevronRight } from 'lucide-react';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Image from 'next/image';


const DashBoard = async({}) => {

  const session = await getServerSession(authOptions);
  if(!session){
    return notFound();
  }

  const friends= await getFriendsId(session.user.id);
  

  const lastMessage = await Promise.all(
    friends.map(async (friend) => {
      const [lastMessageRaw] = (await fetchRedis(
        'zrange',
        `chat:${chatPath(session.user.id, friend.id)}:messages`,
        -1,
        -1
      )) as string[]

      const lastMessage = JSON.parse(lastMessageRaw) as Message

      return {
        ...friend,
        lastMessage,
      }
    })
  )



  return <div className='container py-12 overflow-y-auto'>
  <h1 className='text-yellow-500 font-bold text-5xl mb-8'>Recent chats</h1>
  {lastMessage.length === 0 ? (
    <p className='text-sm text-zinc-500'>Nothing to show here...</p>
  ) : (
    lastMessage.map((friend) => (
      <div
        key={friend.id}
        className='relative mb-4 w-full max-w-[600px] bg-zinc-50 border border-zinc-200 p-3 rounded-md'>
        <div className='absolute right-4 inset-y-0 flex items-center'>
          <ChevronRight className='h-7 w-7 text-zinc-400' />
        </div>

        <Link
          href={`/dashboard/chat/${chatPath(
            session.user.id,
            friend.id
          )}`}
          className='relative sm:flex'>
          <div className='mb-4 flex-shrink-0 sm:mb-0 sm:mr-4'>
            <div className='relative h-6 w-6'>
              <Image
                referrerPolicy='no-referrer'
                className='rounded-full'
                alt={`${friend.name} profile picture`}
                src={friend.image}
                fill
              />
            </div>
          </div>

          <div className="text-black">
            <h4 className='text-lg font-semibold '>{friend.name}</h4>
            <p className='mt-1 max-w-md'>
              <span className='text-zinc-400'>
                {friend.lastMessage?.senderId === session.user.id
                  ? 'You: '
                  : 'Friend: '}
              </span>
              {friend.lastMessage?.content}
            </p>
          </div>
        </Link>
      </div>
    ))
  )}
</div>
}

export default DashBoard