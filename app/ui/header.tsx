"use client";

import React, { useState } from "react";
import Link from "next/link";
export default function Header({ user }: { user?: { name: string } }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleMobileMenu = () => setMobileOpen(!mobileOpen);

  return (
    <header className="w-full">
      <nav className="bg-gray-100 shadow shadow-lg mx-[2rem] rounded-lg pt-1 ">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-full">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-8">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  fastshare
                </span>
              </Link>
              <Link
                href="/p/create"
                className="text-gray-700 hover:text-blue-600 text-xl transition-colors"
              >
                create
              </Link>
              <Link
                href="/p/list"
                className="text-gray-700 hover:text-blue-600 text-xl transition-colors"
              >
                pages
              </Link>
              {user ? (
                <Link
                  href="/users/log_out"
                  className="text-gray-700 hover:text-blue-600 text-xl transition-colors"
                >
                  exit
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="px-4 py-2 bg-blue-600 text-gray-100 rounded-lg hover:bg-blue-700 text-xl transition-colors"
                >
                  sign in
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
              className="md:hidden p-2 text-gray-700 hover:text-blue-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-200 bg-gray-100">
            <div className="px-4 py-3 space-y-3">
              <Link
                href="/p/create"
                className="block text-gray-700 hover:text-blue-600 font-medium"
              >
                create
              </Link>
              <Link
                href="/p/list"
                className="block text-gray-700 hover:text-blue-600 font-medium"
              >
                pages
              </Link>
              {user ? (
                <Link
                  href="/users/log_out"
                  className="block text-gray-700 hover:text-blue-600 font-medium"
                >
                  exit
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="block px-4 py-2 bg-blue-600 text-gray-100 rounded-lg hover:bg-blue-700 font-medium text-center"
                >
                  sign in
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}