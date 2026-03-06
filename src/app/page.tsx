'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getSession } from "@/lib/auth";

export default function LandingPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    getSession().then((s) => {
      setHasSession(!!s);
      setChecking(false);
    });
  }, []);

  function handleEnterConsole() {
    if (hasSession) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0f14]">
      {/* ── Hero ── */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/hero-bg.png"
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-[#0b0f14]/55" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <Image
            src="/assets/logo-dark.png"
            alt="Motorsport Law AI"
            width={240}
            height={60}
            className="mx-auto mb-10"
            priority
          />
          <h1 className="text-4xl font-bold text-white mb-4">
            Motorsport Law AI
          </h1>
          <p className="text-lg text-[#9ca3af] mb-10 leading-relaxed">
            Citation-bound regulatory reasoning for motorsport teams, insurers and legal advisors.
          </p>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleEnterConsole}
              disabled={checking}
              className="bg-[#e10600] text-white text-sm font-semibold px-8 py-3 rounded-lg hover:bg-[#c00500] disabled:opacity-50"
            >
              Enter Console
            </button>
            <a
              href="mailto:hello@motorsportlawai.com"
              className="border border-[#1f2937] text-[#e5e7eb] text-sm font-semibold px-8 py-3 rounded-lg hover:border-[#9ca3af]"
            >
              Request Access
            </a>
          </div>
        </div>

        {/* Speed line at bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-10 h-16 opacity-60">
          <Image
            src="/assets/speed-line-1.png"
            alt=""
            fill
            className="object-cover object-bottom"
          />
        </div>
      </section>

      {/* ── Feature cards ── */}
      <section className="relative max-w-[1200px] mx-auto px-6 py-20">
        {/* Decorative overlay */}
        <div className="absolute top-0 right-0 w-80 h-80 opacity-10 pointer-events-none">
          <Image src="/assets/track-transparent-1.png" alt="" fill className="object-contain" />
        </div>

        <div className="grid md:grid-cols-3 gap-6 relative z-10">
          <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-6">
            <h3 className="text-base font-semibold text-white mb-2">Citation-First AI</h3>
            <p className="text-sm text-[#9ca3af] leading-relaxed">
              Every answer grounded in cited regulation clauses. No citation, no answer.
            </p>
          </div>
          <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-6">
            <h3 className="text-base font-semibold text-white mb-2">Version-Controlled Rulebooks</h3>
            <p className="text-sm text-[#9ca3af] leading-relaxed">
              Regulations versioned by effective date. Always know which edition you are querying.
            </p>
          </div>
          <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-6">
            <h3 className="text-base font-semibold text-white mb-2">Deterministic Refusal</h3>
            <p className="text-sm text-[#9ca3af] leading-relaxed">
              When the system cannot ground an answer in regulation text, it refuses. No hallucination.
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative border-t border-[#1f2937] py-10 px-6">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <Image src="/assets/footer-tyremarks.png" alt="" fill className="object-cover object-bottom" />
        </div>
        <div className="relative z-10 max-w-[1200px] mx-auto text-center">
          <p className="text-xs text-[#6b7280]">
            &copy; 2026 Motorsport Law AI Ltd. All rights reserved.
          </p>
          <p className="text-xs text-[#6b7280] mt-1">
            This system provides regulatory information only. It does not constitute legal advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
