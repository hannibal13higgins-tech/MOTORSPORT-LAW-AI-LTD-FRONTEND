import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Motorsport Law AI",
  description: "Citation-bound regulatory reasoning for motorsport.",
  icons: { icon: "/assets/logo.png" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
