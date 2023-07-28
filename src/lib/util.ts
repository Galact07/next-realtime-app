import { ClassValue,clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';


export function cn(...inputs:ClassValue[]){
    return twMerge(clsx(inputs))
}

export function chatPath(user1:string, user2:string){
    return `${user1}--${user2}`
}