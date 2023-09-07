'use client'

import { FC,useState } from 'react'
import Button from '../../components/ui/Button';
import {signIn} from 'next-auth/react'
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import logo from '../../../../public/logo_bgremove.png'
import background from '../../../../public/bg.jpg'
import bg_new from '../../../../public/bg_new.jpg'


interface pageProps {}

const Login: FC<pageProps> = ({}) => {
    const [isLoading,setIsLoading] =useState<boolean>(false);

    const loginWithGoogle= async()=>{
        try{
            setIsLoading(true);
            await signIn("google");
            toast.success("Logged in successfully");
        }catch(err:any){
            toast.error("Something went wrong");
        }finally{
            setIsLoading(false);
        }
    }

  return (
    <div className="w-full h-screen  relative">
        <div className=' absolute inset-0'>
            <Image
            src={bg_new}
            alt='bg'
            className='object-fill object-center w-full h-full'
            />
        </div>
        <div className=' absolute inset-0 bg-black/50'/>
        <div className='absolute inset-0 h-full flex flex-col justify-center items-center z-100 space-y-10 '>
        <Image
                src={logo}
                alt="logo"
                width={300}
                height={300}
                />  
        <div className="md:w-[400px] w-[250px] p-6 rounded-lg bg-gradient-to-r  from-gray-800 to-gray-800 space-y-4 shadow-mg shadow-white  flex flex-col items-center border border-white/30">
            
      
                  
                <h1 className='mb-5 md:mb-10 text-2xl font-extrabold text-center text-yellow-300'>Sign In</h1>
               
                <Button
                    className='max-w-sm mx-auto w-full'
                    onClick={loginWithGoogle}
                    type="submit"
                    isLoading={isLoading}
                    >Google
                </Button> 
                <Button
                    className='max-w-sm mx-auto w-full'
                    onClick={loginWithGoogle}
                    type="submit"
                    isLoading={isLoading}
                    >Github
                </Button> 
                </div>
        </div>
    </div>
  )
}

export default Login


