"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useUser } from "@stackframe/stack";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleMobileMenu = () => setMobileOpen((v) => !v);
  const user = useUser();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // close when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      if (
        mobileOpen &&
        menuRef.current &&
        !menuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setMobileOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [mobileOpen]);

  const onNavigate = () => setMobileOpen(false);

  return (
    <header className="relative flex items-center justify-between px-6 py-1 border-b border-gray-200">
      {/* Center container */}
      <div className="absolute left-1/2 -translate-x-1/2 flex gap-8">
        <Link
          href="/"
          className="text-gray-800 hover:text-blue-600 text-lg font-medium transition-colors"
          onClick={onNavigate}
        >
          home
        </Link>
        <Link
          href="/p/create"
          className="text-gray-800 hover:text-blue-600 text-lg font-medium transition-colors"
          onClick={onNavigate}
        >
          create
        </Link>
      </div>

      {/* Right side: user / login */}
      <div className="ml-auto flex items-center gap-3 relative">
        {user ? (
          <>
            <button
              ref={buttonRef}
              onClick={toggleMobileMenu}
              aria-label="User menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              className="flex items-center gap-2 focus:outline-none"
            >
              <img
                src={user?.profileImageUrl || "/default-avatar.png"}
                alt="Profile"
                className="w-8 h-8 rounded-full border border-gray-300 shadow-sm object-cover hover:scale-105 transition-transform"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Dropdown */}
            {mobileOpen && (
              <div
                id="mobile-menu"
                ref={menuRef}
                className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
              >
                <ul className="py-1">
                  <li>
                    <Link
                      href="/profile"
                      onClick={onNavigate}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/settings"
                      onClick={onNavigate}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/handler/sign-out"
                      onClick={onNavigate}
                      className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Sign out
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </>
        ) : (
          <Link
            href="/handler/sign-in"
            className="text-gray-800 hover:text-blue-600 text-lg font-medium transition-colors"
          >
            login
          </Link>
        )}
      </div>
    </header>
  );
}
