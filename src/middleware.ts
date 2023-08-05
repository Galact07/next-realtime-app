import { getToken } from "next-auth/jwt";
import {withAuth} from "next-auth/middleware"
import { NextResponse } from "next/server";
import { rateLimit } from "./helpers/rateLimiter";

export default withAuth(async function middleware (req){
    const ip= req.ip || '127.0.0.1'
    const pathName= req.nextUrl.pathname;
    const isAuthenticated = await getToken({req})
    const isLoginPage= pathName.startsWith('/login');
    const sensitiveRoutes=['/dashboard']
    const isSensitiveRoute= sensitiveRoutes.includes(pathName) as Boolean;


    if (isLoginPage) {
        if (isAuthenticated) {
          return NextResponse.redirect(new URL('/dashboard', req.url))
        }
  
        return NextResponse.next()
      }
  
      if (!isAuthenticated && isSensitiveRoute) {
        return NextResponse.redirect(new URL('/login', req.url))
      }
  
      if (pathName === '/') {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
      try{
        const {success}= await rateLimit.limit(ip)
        if (!success) {
          return new NextResponse("You are writing too fast")
      }else{
        return NextResponse.next()
      }
      }catch(err:any){
        return new NextResponse("Something when wrong"+ err.message)
      }
},
{ 
    callbacks:{
        async authorized() {
            return true;
        },
     }
    
})

export const config ={
    matchter:['/','/login','/dashboard/:path*','/api/botmessages/:path*']
}