"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, role, signOut } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-sm bg-white/75 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and brand */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold">
              Healthcare+
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link
                href="/"
                className="px-3 py-2 rounded-md text-sm hover:text-blue-600"
              >
                Home
              </Link>
              <Link
                href="/services"
                className="px-3 py-2 rounded-md text-sm hover:text-blue-600"
              >
                Services
              </Link>
              <Link
                href="/about"
                className="px-3 py-2 rounded-md text-sm hover:text-blue-600"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="px-3 py-2 rounded-md text-sm hover:text-blue-600"
              >
                Contact
              </Link>
              {user ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="ghost">Dashboard</Button>
                  </Link>
                  <Button variant="outline" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button variant="default">Register</Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              <Link
                href="/"
                className="block px-3 py-2 rounded-md text-base hover:text-blue-600"
                onClick={toggleMenu}
              >
                Home
              </Link>
              <Link
                href="/services"
                className="block px-3 py-2 rounded-md text-base hover:text-blue-600"
                onClick={toggleMenu}
              >
                Services
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 rounded-md text-base hover:text-blue-600"
                onClick={toggleMenu}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 rounded-md text-base hover:text-blue-600"
                onClick={toggleMenu}
              >
                Contact
              </Link>
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2 rounded-md text-base hover:text-blue-600"
                    onClick={toggleMenu}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      toggleMenu();
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base hover:text-blue-600"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="block px-3 py-2 rounded-md text-base hover:text-blue-600"
                    onClick={toggleMenu}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block px-3 py-2 rounded-md text-base hover:text-blue-600"
                    onClick={toggleMenu}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
