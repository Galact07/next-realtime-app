'use client'

import { FC,useState } from 'react'
import Button from '../../components/ui/Button';
import {signIn} from 'next-auth/react'
import { toast } from 'react-hot-toast';

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

  return <div className="flex min-h-full items-center justify-center py-12 px-4 sm:py-6 lg:py-8">
    <div className="w-full flex flex-col items-center max-w-md space-y-8">
        <div className="flex flex-col items-center gap-8">
            Logo
            <h2 className='mt-6 text-center font-bold tracking-tight text-yellow-300 text-3xl'>Sign in to your account</h2>
        </div>
        <Button
            className='max-w-sm mx-auto w-full'
            onClick={loginWithGoogle}
            type="submit"
            isLoading={isLoading}
            >Google</Button>
    </div>
  </div>
}

export default Login