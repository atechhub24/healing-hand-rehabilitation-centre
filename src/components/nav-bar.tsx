"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/hooks/use-auth";
import {
  Bell,
  ChevronDown,
  Edit,
  LogOut,
  Menu,
  Settings,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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
              Soundarya Cosmetic
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
                <div className="flex items-center gap-2">
                  <Link href={`/${role}`}>
                    <Button variant="ghost">Dashboard</Button>
                  </Link>
                  {/* Notification Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                    asChild
                  >
                    <Link href="/notifications">
                      <Bell className="h-5 w-5" />
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                        3
                      </span>
                    </Link>
                  </Button>
                  {/* Profile Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex items-center gap-2"
                      >
                        <User className="h-5 w-5" />
                        <span className="hidden sm:inline-block">Profile</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                          <Link href="/profile" className="flex items-center">
                            <User className="mr-2 h-4 w-4" />
                            <span>View Profile</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href="/profile/edit"
                            className="flex items-center"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit Profile</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/${role}/settings`}
                            className="flex items-center"
                          >
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sign Out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button variant="ghost">Sign In</Button>
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
                    href={`/${role}`}
                    className="block px-3 py-2 rounded-md text-base hover:text-blue-600"
                    onClick={toggleMenu}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/notifications"
                    className="block px-3 py-2 rounded-md text-base hover:text-blue-600"
                    onClick={toggleMenu}
                  >
                    Notifications
                    <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                      3
                    </span>
                  </Link>
                  <Link
                    href="/profile"
                    className="block px-3 py-2 rounded-md text-base hover:text-blue-600"
                    onClick={toggleMenu}
                  >
                    View Profile
                  </Link>
                  <Link
                    href="/profile/edit"
                    className="block px-3 py-2 rounded-md text-base hover:text-blue-600"
                    onClick={toggleMenu}
                  >
                    Edit Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-3 py-2 rounded-md text-base hover:text-blue-600"
                    onClick={toggleMenu}
                  >
                    Settings
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
                    href="/auth/register/customer"
                    className="block px-3 py-2 rounded-md text-base hover:text-blue-600"
                    onClick={toggleMenu}
                  >
                    Register as Patient
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block px-3 py-2 rounded-md text-base hover:text-blue-600"
                    onClick={toggleMenu}
                  >
                    Register as Provider
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
