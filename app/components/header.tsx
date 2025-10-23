"use client";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import React, { useState } from "react";
import Link from "next/link";

export default function Header({ user }: { user?: { name: string } }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleMobileMenu = () => setMobileOpen(!mobileOpen);

  return (

    <ClerkProvider>
    <header className="flex items-center justify-between h-16 pb-1">
      {/* Center link container */}
      <div className="pl-[2rem] flex-1 flex justify-center">
        <Link
          href="/p/create"
          className="text-gray-700 hover:text-blue-600 text-xl transition-colors"
        >
          create
        </Link>
      </div>

      {/* Auth controls on the right */}
      <div className="flex items-center gap-4 pr-[2rem]">
        <SignedOut>
          <SignInButton />
          <SignUpButton>
            <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
              Sign Up
            </button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>

    </ClerkProvider>

  );
}