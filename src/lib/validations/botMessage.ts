import {z} from 'zod'

const botMessageValidator= z.object({
    id: z.string(),
    content:z.string().max(500),
    isUser: z.boolean()
})

export const botMessageArrayValidator= z.array(botMessageValidator);

export default botMessageValidator;
export type BotChatMessage= z.infer<typeof botMessageValidator>