'use client';

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const blocked = searchParams.get("blocked") === "1";
  const supabase = getSupabaseBrowserClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    });

    if (authError) {
      setError(authError.message);
      setGoogleLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center relative">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/hero-bg-alt.png"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[#0b0f14]/70" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="text-center mb-8">
          <Image
            src="/assets/logo.png"
            alt="Motorsport Law AI"
            width={200}
            height={50}
            className="mx-auto"
            priority
          />
        </div>

        <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-8">
          <h1 className="text-xl font-semibold text-white mb-1">
            Sign In
          </h1>
          <p className="text-sm text-[#9ca3af] mb-6">Access the regulatory console</p>

          {blocked && (
            <p className="text-sm text-amber-400 bg-amber-950/50 border border-amber-800 rounded-lg px-3 py-2 mb-4">
              Access is currently by invitation only.
            </p>
          )}

          {error && (
            <p className="text-sm text-red-400 bg-red-950/50 border border-red-800 rounded-lg px-3 py-2 mb-4">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#e5e7eb] mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#0b0f14] border border-[#1f2937] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#00a3ff] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#e5e7eb] mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#0b0f14] border border-[#1f2937] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#00a3ff] focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#e10600] text-white text-sm font-semibold py-2.5 px-4 rounded-lg hover:bg-[#c00500] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in\u2026" : "Sign in"}
            </button>
          </form>

          {/* Separator */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-[#1f2937]" />
            <span className="text-xs text-[#6b7280]">or</span>
            <div className="flex-1 h-px bg-[#1f2937]" />
          </div>

          {/* Google OAuth */}
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-2 border border-[#1f2937] text-sm font-medium text-white py-2.5 px-4 rounded-lg hover:bg-[#1f2937] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {googleLoading ? "Redirecting\u2026" : "Continue with Google"}
          </button>

          <p className="text-sm text-[#6b7280] mt-4 text-center">
            No account?{" "}
            <Link href="/register" className="text-[#00a3ff] font-medium hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
