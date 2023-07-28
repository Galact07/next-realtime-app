import { User } from "next-auth";
import { fetchRedis } from "./redis"

export async function getFriendsId(userId: string) {
  try{
    const getFriendsIds=(await fetchRedis(
        'smembers',
        `user:${userId}:friends`
      )) as string[]

     const friends = await Promise.all(
        getFriendsIds.map(async (friendId) => {
          const friend = await fetchRedis('get', `user:${friendId}`) as string
          const parsedFriend = JSON.parse(friend) as User
          return parsedFriend
        })
      )
    
      return friends
  }catch(error:any){
    return new Response(error.message, { status: 500 })
  }
}