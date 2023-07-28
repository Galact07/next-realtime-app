import { getToken } from "next-auth/jwt";
import {withAuth} from "next-auth/middleware"
import { NextResponse } from "next/server";

export default withAuth(async function middleware (req){
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
},
{ 
    callbacks:{
        async authorized() {
            return true;
        },
     }
    
})

export const config ={
    matchter:['/','/login','/dashboard/:path*']
}