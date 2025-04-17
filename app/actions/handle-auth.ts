"use server"

import { auth, signIn, signOut } from "@/lib/auth"

export async function handleAuth() {
    const session = await auth();

    if(session) {
        await signOut({
            redirectTo: "/"
        })
    } else {
        await signIn("google", {
            redirectTo: "/dashboard"
        })
    }
}
