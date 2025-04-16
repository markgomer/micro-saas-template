import { auth } from "@/lib/auth"
import { redirect } from "next/navigation";

export default async function Dashboard() {
    const session = await auth();

    if(!session) {
        redirect("/login")
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold">OI! AQUI É O DASHBOARD RAPA</h1>
            <p>
                {session?.user?.email ?
                    `Logado como ${session?.user?.email}` :
                    "TU TA AQUI SEM TA LOGADO, EU FIZ ALGO ERRADO"}
            </p>
        </div>
    )
}
