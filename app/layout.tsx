

import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackClientApp } from "../stack/client";
import type { Metadata } from 'next'

import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Header from './components/header'
import { Suspense } from "react";

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}><StackProvider app={stackClientApp}><StackTheme>
          <Suspense>
            <Header></Header>
          </Suspense>
     
          
          {children}
        </StackTheme></StackProvider></body>
      </html>
  )
}