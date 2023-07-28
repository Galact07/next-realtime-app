import { Message } from "./Message";

export interface Chats{
    id:string,
    messages:Message[]
}

export interface FriendRequest{
    id:string,
    senderId:string,
    receiverId:string,
}