'use client';

import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { signOut, getSession } from "@/lib/auth";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [email, setEmail] = useState("");

  useEffect(() => {
    getSession().then((s) => {
      if (s?.user?.email) setEmail(s.user.email);
    });
  }, []);

  const navItems = [
    { label: "Dashboard", href: "/dashboard" },
  ];

  return (
    <header className="bg-[#0b0f14] border-b border-[#1f2937] px-6 py-3 flex items-center justify-between">
      <Link href="/dashboard">
        <Image
          src="/assets/logo-transparent.png"
          alt="Motorsport Law AI"
          width={160}
          height={40}
          priority
        />
      </Link>

      <nav className="flex items-center gap-6">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`text-sm ${
              pathname === item.href
                ? "text-white font-medium"
                : "text-[#9ca3af] hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        ))}
        {email && (
          <span className="text-sm text-[#9ca3af]">{email}</span>
        )}
        <button
          onClick={async () => { await signOut(); router.push("/login"); }}
          className="text-sm text-[#9ca3af] hover:text-white"
        >
          Sign Out
        </button>
      </nav>
    </header>
  );
}
