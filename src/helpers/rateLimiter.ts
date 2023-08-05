import { db } from '@/lib/db'
import {Ratelimit} from '@upstash/ratelimit'
export const rateLimit = new Ratelimit({
redis:db,
limiter:Ratelimit.slidingWindow(4, '10 s'),
prefix:'@upstash/ratelimit'
})