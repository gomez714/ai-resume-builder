import { SignUp } from "@clerk/nextjs";

export default function Page() {
    return <main className="flex h-screen p-3 items-center justify-center">
        <SignUp />
    </main>
}