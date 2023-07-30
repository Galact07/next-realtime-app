
import { User } from "@/interfaces/User"
import { fetchRedis } from "./redis"

export async function getFriendsId(userId: string) {
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
}