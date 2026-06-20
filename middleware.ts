import { proxy } from "@/proxy";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  return proxy(req);
}

export const config = {
  matcher: ["/admin/:path*"],
};