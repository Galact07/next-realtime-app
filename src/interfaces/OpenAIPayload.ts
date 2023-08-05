import { BotChatMessage } from "@/lib/validations/botMessage";
import { ChatGPTMessage } from "./ChatGPTMessage";

export interface OpenAIPayload {
    model: string;
    messages: ChatGPTMessage[];
    temperature: number;
    top_p: number;
    frequency_penalty: number;
    presence_penalty: number;
    max_tokens: number;
    stream: boolean;
    n: number;
}