import { fetchRedis } from '@/helpers/redis';
import { Chats } from '@/interfaces/Chat';
import { Message } from '@/interfaces/Message';
import { User } from '@/interfaces/User';
import { authOptions } from '@/lib/authOptions';
import { messageArrayValidator } from '@/lib/validations/message';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import Image from 'next/image'

interface ChatPageProps {
    params: {
        chatId: string
      }
}

const getAllMessages=async(chatId:string)=>{
    try{
        const getMessages=( await fetchRedis(
            'zrange',
            `chat:${chatId}:messages`,
            0,
            -1,
        )) as string[]

        const parseMessages = getMessages.map((message)=>JSON.parse(message)) as Message[];

        const reverseMessages = parseMessages.reverse();

        const messages=  messageArrayValidator.parse(reverseMessages); 
    }catch(err){
        return new Response("Error"+err,{status:404});
    }
}

const Chat= async({params}:ChatPageProps) => {
    const {chatId}= params;
    const session = await getServerSession(authOptions);
    if(!session){
        return notFound();
    }

    const {user} = session;
    const[user1,user2] = chatId.split('--');

    if(user.id === user1 && user.id === user2){
        notFound()
    }

    const chatPartnerId:string = user.id === user1 ? user2 : user1;

    const chatPartnerJSON = await fetchRedis(
        'get',
        `user:${chatPartnerId}`
    ) as string;
    const chatPartner = JSON.parse(chatPartnerJSON) as User


    const getMessages = await getAllMessages(chatId);

  return(
    <div className='flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-2rem)]'>
      <div className='flex sm:items-center justify-between py-3 border-b-2 border-gray-200'>
        <div className='relative flex items-center space-x-4'>
          <div className='relative'>
            <div className='relative w-8 sm:w-12 h-8 sm:h-12'>
              <Image
                fill
                referrerPolicy='no-referrer'
                src={chatPartner.image}
                alt={`${chatPartner.name} profile picture`}
                className='rounded-full'
              />
            </div>
          </div>

          <div className='flex flex-col leading-tight'>
            <div className='text-xl flex items-center'>
              <span className='text-gray-700 mr-3 font-semibold'>
                {chatPartner.name}
              </span>
            </div>

            <span className='text-sm text-gray-600'>{chatPartner.email}</span>
          </div>
        </div>
      </div>
    </div>
  )
  }
export default Chat;