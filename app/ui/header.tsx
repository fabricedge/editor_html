"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function Header({ user }: { user?: { name: string } }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleMobileMenu = () => setMobileOpen(!mobileOpen);

  return (
    <div>
      <style jsx>{`
        .text-gradient-header {
          background: linear-gradient(45deg, #ec4899, #f97316);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-size: var(--text-3xl);
        }

        .hover-text-maroon-400:hover {
          color: #ec4899;
        }

        #mobile-menu {
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          transition: max-height 0.3s ease-out, opacity 0.3s ease-out;
        }

        #mobile-menu.show {
          max-height: 300px;
          opacity: 1;
        }

        .hamburger {
          transition: transform 0.3s ease;
        }

        .hamburger.active {
          transform: rotate(90deg);
        }

        .hamburger .line1,
        .hamburger .line2,
        .hamburger .line3 {
          transition: all 0.3s ease;
          transform-origin: center;
        }

        .hamburger.active .line1 {
          transform: rotate(45deg) translate(5px, 5px);
        }

        .hamburger.active .line2 {
          opacity: 0;
        }

        .hamburger.active .line3 {
          transform: rotate(-45deg) translate(7px, -6px);
        }

        /* ✅ Sticky instead of fixed */
        .stuck-nav-container {
          position: sticky;
          top: 0;
          z-index: 40;
          width: 100%;
        }

        .stuck-nav {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          padding: 1rem 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          padding: 0;
        }

        @media (max-width: 768px) {
          .stuck-nav {
            padding: 0.75rem 1rem;
          }
        }
      `}</style>

      <header className="mb-2">
        <div className="stuck-nav-container">
          <nav className="stuck-nav text-gray-300 transition-all duration-300">
            <div className="mx-auto max-w-7xl">
              <div className="flex items-center justify-center relative w-full">
                <div className="text-2xl text-gradient-header flex">
                  <Link href="/" className="px-8 md:px-14">
                    home
                  </Link>

                  <div className="text-white space-x-8 md:space-x-16 hidden md:flex">
                    <Link
                      href="/pg/create"
                      className="hover-text-maroon-400 transition-colors duration-300"
                    >
                      create
                    </Link>
                    <Link
                      href="/pg"
                      className="hover-text-maroon-400 transition-colors duration-300"
                    >
                      pages
                    </Link>
                    {user && (
                      <Link
                        href="/users/log_out"
                        className="hover-text-maroon-400 transition-colors duration-300"
                      >
                        exit
                      </Link>
                    )}
                  </div>
                </div>

                {/* Toggle Menu Button */}
                <button
                  className={`text-white focus:outline-none hamburger absolute right-0 md:hidden ${
                    mobileOpen ? "active" : ""
                  }`}
                  onClick={toggleMobileMenu}
                  aria-label="Toggle menu"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      className="line1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16"
                    ></path>
                    <path
                      className="line2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 12h16"
                    ></path>
                    <path
                      className="line3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 18h16"
                    ></path>
                  </svg>
                </button>
              </div>

              {/* Mobile Menu */}
              <div
                id="mobile-menu"
                className={`mt-4 space-y-4 text-center md:hidden ${
                  mobileOpen ? "show" : ""
                }`}
              >
                <Link
                  href="/pg"
                  className="block hover-text-maroon-400 transition-colors duration-300 py-2"
                >
                  Ver Páginas
                </Link>
                <Link
                  href="/pg/create"
                  className="block hover-text-maroon-400 transition-colors duration-300 py-2"
                >
                  Criar Página
                </Link>
                {user && (
                  <Link
                    href="/users/log_out"
                    className="hover-text-maroon-400 transition-colors duration-300"
                  >
                    Sair
                  </Link>
                )}
              </div>
            </div>
          </nav>
        </div>
      </header>
    </div>
  );
}
