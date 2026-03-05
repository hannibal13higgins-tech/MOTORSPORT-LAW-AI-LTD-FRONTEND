'use client';

import { useState } from "react";
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
    <main className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
      <div className="w-full max-w-md">
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-8">
          <h1 className="text-xl font-semibold text-[#111827] mb-1">
            Motorsport Law AI
          </h1>
          <p className="text-sm text-[#6B7280] mb-6">Create your account</p>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 mb-4">
              {error}
            </p>
          )}

          {success ? (
            <div className="bg-green-50 border border-green-200 rounded px-4 py-3">
              <p className="text-sm text-green-800 font-medium">Check your email to confirm your account</p>
              <p className="text-xs text-green-700 mt-1">
                Once confirmed, you can{" "}
                <Link href="/login" className="underline font-medium">sign in</Link>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
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
                  required
                  minLength={6}
                  className="w-full border border-[#E5E7EB] rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1E3A5F] text-white text-sm font-medium py-2.5 px-4 rounded hover:bg-[#162d4a] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating account\u2026" : "Create account"}
              </button>
            </form>
          )}

          <p className="text-sm text-[#6B7280] mt-4 text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-[#1E3A5F] font-medium underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
