import Header from '../app/ui/header';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fast Share",
  description: "Fast Share your HTML Page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-white/50 via-pink-50/50 to-orange-50/50`}
      >
         
        <Header user={{ name: "Knee" }} />
        <main className="text-gray-900 min-h-screen overflow-hidden relative">
          {children}
        </main>
      </body>
    </html>
  );
}
