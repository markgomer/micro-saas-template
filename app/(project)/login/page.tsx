import { handleLogin } from "@/actions/handle-login";

export default function Login() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold">FAZ O LOGIN AI PO</h1>
            <form action={handleLogin}>
                <button type="submit">Sign in with Google</button>
            </form>
        </div>
    )
}
