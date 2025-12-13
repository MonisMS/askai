import { polarClient, createAuthClient } from "@polar-sh/better-auth/client"
export const authClient = createAuthClient({
   plugins:[polarClient()]
})