"use client"

import { FC, useState } from 'react'
import { addFriend } from '@/lib/validations/addFriend'
import { ZodError, z } from 'zod'
import {AxiosError} from 'axios'
import axios from 'axios'
import {useForm} from 'react-hook-form'
import {zodResolver} from "@hookform/resolvers/zod"
import Button from './Button'
import { toast } from 'react-hot-toast'


interface AddFriendButtonProps {
  
}

type FormData= z.infer<typeof addFriend>;


const AddFriendButton: FC<AddFriendButtonProps> = ({}) => {
  const [success,setShowSuccess]= useState<boolean>(false);

  const {register,handleSubmit,setError,formState:{errors}} = useForm<FormData>({
    resolver: zodResolver(addFriend)
  })

const addFriendValidate = async(email:string)=>{
  try{
    const validateEmail= addFriend.parse({
      email:email
    })
      await axios.post('/api/friends/addFriend',{
        email:validateEmail
      });
  
    setShowSuccess(true)
    toast.success("Friend added!")
  }catch(error:any){
    if(error instanceof ZodError){
      setError("email",{message:error.message})
      return
    }
    if(error instanceof AxiosError){
      setError("email",{message:error.response?.data})
      return
    }
    toast.error("Something went wrong")
    setError("email",{message:"Something went wrong"})
  }
}

const handleSubmitForm = (data:FormData)=>{
   addFriendValidate(data.email)
  
}

  return (
  <form onSubmit={handleSubmit(handleSubmitForm)}>
    <label 
    htmlFor="email"
    placeholder='Email'
    className='block text-sm font-medium text-white'
    >Email</label>
    <div className="mt-2 flex gap-4">
        <input
        {...register('email')}
        type='text'
        placeholder='YOU@example.com'
        className='shadow-sm text-black py-2 focus:ring-indigo-500 focus:border-indigo-500  w-full sm:text-sm border-gray-300 rounded-md max-w-md'
        />
        <Button>Add</Button>
    </div>
    {errors && <p className="text-red-600">{errors.email?.message}</p>}
    {success && <p className="text-green-600">Friend added!</p>}
  </form>
  )
}

export default AddFriendButton




