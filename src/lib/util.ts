import { ClassValue,clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';


export function cn(...inputs:ClassValue[]){
    return twMerge(clsx(inputs))
}

export function chatPath(user1:string, user2:string){
    const sortIds=[user1,user2].sort();
    return `${sortIds[0]}--${sortIds[1]}`
}

export function pusherKey(key:string){
    return key.replace(/_/g,'__')
}