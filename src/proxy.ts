import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { defaultLocale, locales } from "@/config/site";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (hasLocale) return;

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;

  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    // Todo excepto internos de Next, y cualquier ruta con extensión de archivo
    // (favicon.ico, next.svg, etc.), que se sirven tal cual desde public/.
    "/((?!_next/static|_next/image|_next/data|.*\\.[^/]*$).*)",
  ],
};
