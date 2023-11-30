import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  let auth = request.cookies.get("auth");
  let user = request.cookies.get("user");
  // if (request.nextUrl.pathname.startsWith("/dashboard")) {
  //   if (!auth || !user) {
  //     return NextResponse.redirect(new URL("/auth/signin", request.url));
  //   }
  // }

  // console.log(request.cookies.get("nextjs")?.value);
}

export const config = {
  matcher: ["/", "/dashboard/:path*"],
};
