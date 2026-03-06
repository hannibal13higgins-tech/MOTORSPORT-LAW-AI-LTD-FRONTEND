'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

export default function RegisterPage() {
  const supabase = getSupabaseBrowserClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center relative">
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
            Create Account
          </h1>
          <p className="text-sm text-[#9ca3af] mb-6">Register for access</p>

          {error && (
            <p className="text-sm text-red-400 bg-red-950/50 border border-red-800 rounded-lg px-3 py-2 mb-4">
              {error}
            </p>
          )}

          {success ? (
            <div className="bg-emerald-950/50 border border-emerald-800 rounded-lg px-4 py-3">
              <p className="text-sm text-emerald-400 font-medium">Check your email to confirm your account</p>
              <p className="text-xs text-emerald-500 mt-1">
                Once confirmed, you can{" "}
                <Link href="/login" className="underline font-medium">sign in</Link>.
              </p>
            </div>
          ) : (
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
                  minLength={6}
                  className="w-full bg-[#0b0f14] border border-[#1f2937] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#00a3ff] focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#e10600] text-white text-sm font-semibold py-2.5 px-4 rounded-lg hover:bg-[#c00500] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating account\u2026" : "Create account"}
              </button>
            </form>
          )}

          <p className="text-sm text-[#6b7280] mt-4 text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-[#00a3ff] font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
