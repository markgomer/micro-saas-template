import { Metadata } from "next";
import Link from "next/link";

// Tags para SEO
const metadata: Metadata = {
    title: "Template Micro SaaS",
    description: "Landing page",
}

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold">Landing Page</h1>
            <Link href="/login">
                <p>Login</p>
            </Link>
        </div>
    );
}
