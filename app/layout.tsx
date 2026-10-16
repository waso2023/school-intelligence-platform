import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SOP International Academy | School Intelligence Platform",
  description:
    "Next-generation AI-powered School Intelligence & Academic Management Platform for Private & International Schools in Kenya.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
