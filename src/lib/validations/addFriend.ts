import {z} from 'zod'

export const addFriend = z.object({
    email:z.string().email({message:'Invalid email address'}),
})