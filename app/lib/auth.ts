import { FirestoreAdapter } from "@auth/firebase-adapter"
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { firebaseCert } from "@/lib/firebase"
 
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
    adapter: FirestoreAdapter({
        credential: firebaseCert,
    })
})
