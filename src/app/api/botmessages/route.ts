import { BotChatMessage, botMessageArrayValidator } from "@/lib/validations/botMessage";
import { chatbotPrompt } from "@/lib/chatbotprompt";
import { OpenAIPayload } from "@/interfaces/OpenAIPayload";
import { ChatGPTMessage } from "@/interfaces/ChatGPTMessage";
import { OpenAIStream } from "@/helpers/openAIStream";

export async function POST(request:Request){
    try{
        const {messages}=await request.json();
        const validMessage= botMessageArrayValidator.parse(messages);

        const botMessages:ChatGPTMessage[]=validMessage.map((message:BotChatMessage)=>{
            return {
                role:message.isUser?"user":"system",
                content:message.content,
            }
        })

        botMessages.unshift({
            role:"system",
            content:chatbotPrompt
        })

        const payload:OpenAIPayload={
            model: 'gpt-3.5-turbo',
            messages: botMessages,
            temperature: 0.4,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            max_tokens: 150,
            stream: true,
            n: 1,
        }
        const stream =await OpenAIStream(payload);

        return new Response(stream);
    }catch(err:any){
        return new Response(err.message,{status:500})
    }
}