AuthJS (next-auth v5) Migration Guide

Summary
- This project currently uses `next-auth` v5 beta alongside legacy patterns.
- The `next-auth/middleware` module is deprecated in v5; migrate to AuthJS recommended server-side patterns.

Quick steps to migrate to AuthJS v5 middleware:

1. Install AuthJS (if not already on v5):

   npm install next-auth@latest

2. Create an `app/auth.ts` or `src/auth.ts` that exports the auth handler (already present in this repo as `src/auth.ts`). Use `auth()` on server components or API routes to get session info.

3. Replace `middleware.ts` usage with server-side checks or Edge-compatible handlers. Example (AuthJS v5):

   import { auth } from "@/auth";

   export function middleware(req) {
     const session = auth(); // depends on your setup
     if (!session) return NextResponse.redirect(new URL('/login', req.url));
     return NextResponse.next();
   }

4. Update any client-side uses from `next-auth/react` to AuthJS equivalents.

More info: https://authjs.dev/getting-started/migrating-to-v5
