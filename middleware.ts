import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { usePathname } from 'next/navigation';
import { NextResponse } from 'next/server';
const isPublicRoute = createRouteMatcher([
    "/signin",
    "/signup",
    "/",
    "/home"
]);

const isPublicApiRouter = createRouteMatcher([
    "/api/videos"
])


export default clerkMiddleware((auth,req) =>{
    const {userId} = auth();
    const currentUrl = new URL(req.url);
    const isAccessingDashBoard = currentUrl.pathname === "/home";
    const isApiRequest  = currentUrl.pathname.startsWith ("/Api");

    if(userId && isPublicRoute(req) && !isAccessingDashBoard){
        return NextResponse.redirect(new URL('/home' , req.url))
    }
    if(!userId){
        if(!isPublicRoute(req) && !isPublicApiRouter(req)){
            return NextResponse.redirect(new URL("/signin" , req.url))
        }
    }
    return NextResponse.next();

});


export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
};