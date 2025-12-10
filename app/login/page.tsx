import Link from "next/link"
import { login } from './actions'

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <form className="flex flex-col gap-4 p-8 bg-white border rounded-lg shadow-md w-full max-w-sm">
                <h1 className="text-2xl font-bold mb-4">Welcome Back</h1>

                <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                    <input id="email" name="email" type="email" required className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="you@example.com" />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                    <input id="password" name="password" type="password" required className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="••••••••" />
                </div>

                <div className="flex flex-col gap-3 mt-6">
                    <button formAction={login} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition font-medium">Log in</button>
                    <div className="text-center">
                        <span className="text-sm text-gray-500">Don&apos;t have an account? </span>
                        <Link href="/hr/signup" className="text-sm text-gray-500 hover:text-gray-700 hover:underline">
                            Sign up
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    )
}
