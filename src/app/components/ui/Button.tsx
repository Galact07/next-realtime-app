import {FC } from 'react'
import ButtonProps from '@/interfaces/Button'
import {buttonVariants} from '@/interfaces/Button'
import { Loader2 } from 'lucide-react'
import {cn} from '@/lib/util'


const Button: FC<ButtonProps> = ({className,children,isLoading,variant,size,...props}) => {
  return (
    <button
    className={cn(buttonVariants({variant,size,className}))} disabled={isLoading} {...props}>
        {isLoading ? <Loader2 className='mr-2 w-4 h-4 animate-spin'/> : null}
        {children}
    </button>
  )
}

export default Button