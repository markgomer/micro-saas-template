"use server"

import { signIn } from "@/lib/auth"

export async function handleLogin() {
    await signIn("google", {
        redirectTo: "/dashboard"
    })
}
