'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
      <div className="w-full max-w-md">
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-8">
          <h1 className="text-xl font-semibold text-[#111827] mb-1">
            Motorsport Law AI
          </h1>
          <p className="text-sm text-[#6B7280] mb-6">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-[#E5E7EB] rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#111827] mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-[#E5E7EB] rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1E3A5F] text-white text-sm font-medium py-2.5 px-4 rounded hover:bg-[#162d4a] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="text-sm text-[#6B7280] mt-4 text-center">
            No account?{" "}
            <Link href="/register" className="text-[#1E3A5F] font-medium underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
