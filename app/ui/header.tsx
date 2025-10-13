"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function Header({ user }: { user?: { name: string } }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleMobileMenu = () => setMobileOpen(!mobileOpen);

  return (
    <header className="w-full p-0">
      <nav className="bg-white/95 backdrop-blur-md border-b border-black/10 shadow-sm ">
        <div className="mx-auto max-w-7xl  flex items-center justify-center relative ">
          {/* Logo / Home */}
          <div className="flex items-center justify-center space-x-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400 text-2xl font-semibold p-0">
            <Link href="/" className="px-8 md:px-14 p-0">
              home
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex space-x-8 md:space-x-16 text-gray-600">
              <Link
                href="/p/create"
                className="hover:text-pink-500 transition-colors duration-300"
              >
                create
              </Link>
              <Link
                href="/p/list"
                className="hover:text-pink-500 transition-colors duration-300"
              >
                pages
              </Link>
              {user && (
                <Link
                  href="/users/log_out"
                  className="hover:text-pink-500 transition-colors duration-300"
                >
                  exit
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Button */}
          <button
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            className="absolute right-4 md:hidden text-pink-500 focus:outline-none"
          >
            <svg
              className={`w-7 h-7 transition-transform duration-300 ${
                mobileOpen ? "rotate-90" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`overflow-hidden transition-all duration-300 text-center text-gray-700 md:hidden ${
            mobileOpen ? "max-h-40 opacity-100 " : "max-h-0 opacity-0 py-0"
          }`}
        >
          <Link
            href="/p"
            className="block py-2 hover:text-pink-500 transition-colors duration-300"
          >
            Ver Páginas
          </Link>
          <Link
            href="/p/create"
            className="block py-2 hover:text-pink-500 transition-colors duration-300"
          >
            Criar Página
          </Link>
          {user && (
            <Link
              href="/users/log_out"
              className="block py-2 hover:text-pink-500 transition-colors duration-300"
            >
              Sair
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
