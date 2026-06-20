Downgrading to next-auth@4 (if you prefer keeping legacy middleware)

1. In package.json change next-auth version to v4:

   "next-auth": "^4.22.1"

2. Reinstall:

   npm install

3. Revert `middleware.ts` to:

   export { default } from "next-auth/middleware";
   export const config = { matcher: ["/admin/:path*"] };

4. Ensure your NextAuth config matches v4 API (callbacks, session options). See https://next-auth.js.org/getting-started/upgrade-v4
