import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt"; // <-- Import NextAuth's getToken utility

async function validateTokenAndGetType(
  request: NextRequest
): Promise<{ isAuthenticated: boolean; userType: string | null }> {
  const token = await getToken({ req: request });
  // console.log(token);

  if (!token) {
    return { isAuthenticated: false, userType: null };
  }

  const userType = token.typeAdmin as string | undefined | null;

  if (userType) {
    return { isAuthenticated: true, userType };
  }

  console.error(
    "Authenticated token is missing the 'type' field in its payload."
  );
  return { isAuthenticated: false, userType: null };
}

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const isBlockRoute = pathname.startsWith("/block/");
  const isGpRoute = pathname.startsWith("/gps/");

  if (isBlockRoute || isGpRoute) {
    const { isAuthenticated, userType } = await validateTokenAndGetType(
      request
    );
    // console.log(userType);

    if (!isAuthenticated) {
      // console.log(
      //   `[AUTH] Access Denied: No valid token for protected path ${pathname}`
      // );
      return NextResponse.redirect(new URL("/", request.url));
    }

    let requiredType: string;

    if (isBlockRoute) {
      requiredType = "block";
      if (userType !== "block" && userType !== "gpadmin") {
        // console.log(
        //   `[AUTH] Access Denied: User type '${userType}' not authorized for Block Routes.`
        // );
        return NextResponse.redirect(new URL("/", request.url));
      }
    } else if (isGpRoute) {
      requiredType = "gp";
      if (userType !== "gp" && userType !== "gpadmin") {
        // console.log(
        //   `[AUTH] Access Denied: User type '${userType}' not authorized for GP Routes.`
        // );
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    // console.log(
    //   `[AUTH] Access Granted: User type '${userType}' allowed for ${pathname}.`
    // );
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/block/:path*", "/gps/:path*"],
};
