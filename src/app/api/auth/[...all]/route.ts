import { auth } from "@/lib/auth"; 
import { toNextJsHandler } from "@polar-sh/better-auth/next-js";
 
export const { POST, GET } = toNextJsHandler(auth);