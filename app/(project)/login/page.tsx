import { handleAuth } from "@/actions/handle-auth";
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation";

export default async function Login() {
    const session = await auth();
    if(session) {
        redirect("/dashboard");
    }
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold">FAZ O LOGIN AI PO</h1>
            <form action={handleAuth}>
                <button type="submit">Sign in with Google</button>
            </form>
        </div>
    )
}
