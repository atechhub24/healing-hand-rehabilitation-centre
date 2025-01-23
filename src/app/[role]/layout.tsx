"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  Calendar,
  ClipboardList,
  Settings,
  FileText,
  Activity,
  TestTube,
  Bell,
  LogOut,
  Search,
  User,
  Stethoscope,
  UserCog,
  Microscope,
  Menu,
  X,
} from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Configuration object that defines the navigation menu and title for each role
// This helps in maintaining role-based UI elements in one place
const roleConfig = {
  admin: {
    title: "Admin Dashboard",
    menuItems: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
      { label: "User Management", icon: Users, href: "/admin/users" },
      { label: "Doctors", icon: Stethoscope, href: "/admin/manage/doctors" },
      { label: "Paramedics", icon: UserCog, href: "/admin/manage/paramedics" },
      {
        label: "Laboratories",
        icon: Microscope,
        href: "/admin/manage/laboratories",
      },
      { label: "Analytics", icon: Activity, href: "/admin/analytics" },
      { label: "Settings", icon: Settings, href: "/admin/settings" },
    ],
  },
  doctor: {
    title: "Doctor Dashboard",
    menuItems: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/doctor" },
      { label: "Appointments", icon: Calendar, href: "/doctor/appointments" },
      { label: "Patients", icon: Users, href: "/doctor/patients" },
      { label: "Prescriptions", icon: FileText, href: "/doctor/prescriptions" },
      { label: "Settings", icon: Settings, href: "/doctor/settings" },
    ],
  },
  paramedic: {
    title: "Paramedic Dashboard",
    menuItems: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/paramedic" },
      {
        label: "Emergency Calls",
        icon: Bell,
        href: "/paramedic/emergency-calls",
      },
      { label: "Patients", icon: Users, href: "/paramedic/patients" },
      { label: "Reports", icon: FileText, href: "/paramedic/reports" },
      { label: "Settings", icon: Settings, href: "/paramedic/settings" },
    ],
  },
  lab: {
    title: "Laboratory Dashboard",
    menuItems: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/lab" },
      { label: "Test Orders", icon: TestTube, href: "/lab/test-orders" },
      { label: "Reports", icon: FileText, href: "/lab/reports" },
      { label: "Inventory", icon: ClipboardList, href: "/lab/inventory" },
      { label: "Settings", icon: Settings, href: "/lab/settings" },
    ],
  },
  customer: {
    title: "Patient Dashboard",
    menuItems: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/customer" },
      {
        label: "Appointments",
        icon: Calendar,
        href: "/customer/appointments",
      },
      {
        label: "Medical Records",
        icon: FileText,
        href: "/customer/medical-records",
      },
      {
        label: "Test Results",
        icon: TestTube,
        href: "/customer/test-results",
      },
      { label: "Settings", icon: Settings, href: "/customer/settings" },
    ],
  },
};

// Layout component that wraps all pages within the [role] directory
// This provides a consistent UI shell (navigation, header, etc.) across all role-based pages
export default function RoleBasedLayout({
  children, // The actual page content that will be rendered inside this layout
}: {
  children: React.ReactNode;
}) {
  const router = useRouter(); // For programmatic navigation
  const params = useParams(); // To access URL parameters (like role)
  const { user, role, signOut } = useAuth(); // Authentication context
  const currentRole = params.role as keyof typeof roleConfig;
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("");
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  // Authentication and role verification
  // This effect runs whenever user, role, or currentRole changes
  useEffect(() => {
    // Redirect to login if:
    // 1. User is not authenticated (no user)
    // 2. User has no role assigned
    // 3. User's role doesn't match the current route's role
    if (!user || !role || role !== currentRole) {
      router.replace("/auth/login");
    }
  }, [user, role, currentRole, router]);

  // Set initial sidebar state based on screen size
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1024);
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Don't render anything if authentication/authorization fails
  if (!user || !role || !roleConfig[currentRole]) {
    return null;
  }

  // Get the configuration for the current role
  const { title, menuItems } = roleConfig[currentRole];

  // Handle user sign out
  const handleSignOut = async () => {
    await signOut();
    router.replace("/");
  };

  const sidebarVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        mass: 1,
      },
    },
    closed: {
      x: "-100%",
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        mass: 1,
      },
    },
  };

  const menuItemVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
    closed: {
      x: -20,
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  // The layout is split into two main sections:
  // 1. Sidebar (navigation)
  // 2. Main content area (header + page content)
  return (
    <div className="flex h-screen bg-[#f8fafc]">
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden bg-white/50 backdrop-blur-sm border shadow-sm"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </Button>

      {/* Backdrop for mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm lg:hidden z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex w-72 bg-white/80 backdrop-blur-md border-r border-gray-200/50",
          !isSidebarOpen && "lg:w-20"
        )}
      >
        <div className="flex h-full flex-col w-full">
          {/* Brand/Logo Section */}
          <motion.div
            className="flex items-center gap-3 px-6 py-5 border-b border-gray-200/50"
            whileHover={{ scale: 1.01 }}
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-white font-bold text-lg">H+</span>
            </div>
            {isSidebarOpen && (
              <motion.span
                variants={menuItemVariants}
                className="font-semibold text-gray-800 text-lg"
              >
                Healthcare+
              </motion.span>
            )}
          </motion.div>

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1.5">
              {menuItems.map((item) => (
                <motion.li
                  key={item.href}
                  whileHover={{ scale: 1.01, x: 2 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-2.5 text-gray-700 hover:bg-blue-50/50 hover:text-blue-700 transition-all duration-200",
                      activeItem === item.href &&
                        "bg-blue-50/80 text-blue-700 font-medium shadow-sm"
                    )}
                    onClick={() => setActiveItem(item.href)}
                  >
                    <item.icon className="h-5 w-5" />
                    {isSidebarOpen && (
                      <motion.span variants={menuItemVariants}>
                        {item.label}
                      </motion.span>
                    )}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </nav>

          {/* User Profile Section */}
          <motion.div
            className="border-t border-gray-200/50 p-4 bg-gray-50/50"
            whileHover={{ backgroundColor: "#f1f5f9" }}
          >
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                className="h-10 w-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <User className="h-5 w-5 text-gray-600" />
              </motion.div>
              {isSidebarOpen && (
                <motion.div variants={menuItemVariants}>
                  <p className="text-sm font-medium text-gray-800">
                    {user.email || user.phoneNumber}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{role}</p>
                </motion.div>
              )}
            </div>
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-red-600 hover:bg-red-50/50 hover:text-red-700 rounded-xl"
                onClick={handleSignOut}
              >
                <LogOut className="h-5 w-5" />
                {isSidebarOpen && (
                  <motion.span variants={menuItemVariants}>
                    Sign Out
                  </motion.span>
                )}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.aside
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className="fixed inset-y-0 left-0 z-50 w-72 bg-white/80 backdrop-blur-md border-r border-gray-200/50 shadow-lg lg:hidden"
          >
            <div className="flex h-full flex-col">
              {/* Brand/Logo Section */}
              <motion.div
                className="flex items-center gap-3 px-6 py-5 border-b border-gray-200/50"
                whileHover={{ scale: 1.01 }}
              >
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <span className="text-white font-bold text-lg">H+</span>
                </div>
                {isSidebarOpen && (
                  <motion.span
                    variants={menuItemVariants}
                    className="font-semibold text-gray-800 text-lg"
                  >
                    Healthcare+
                  </motion.span>
                )}
              </motion.div>

              {/* Navigation Menu */}
              <nav className="flex-1 overflow-y-auto p-4">
                <ul className="space-y-1.5">
                  {menuItems.map((item) => (
                    <motion.li
                      key={item.href}
                      whileHover={{ scale: 1.01, x: 2 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-4 py-2.5 text-gray-700 hover:bg-blue-50/50 hover:text-blue-700 transition-all duration-200",
                          activeItem === item.href &&
                            "bg-blue-50/80 text-blue-700 font-medium shadow-sm"
                        )}
                        onClick={() => setActiveItem(item.href)}
                      >
                        <item.icon className="h-5 w-5" />
                        {isSidebarOpen && (
                          <motion.span variants={menuItemVariants}>
                            {item.label}
                          </motion.span>
                        )}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              {/* User Profile Section */}
              <motion.div
                className="border-t border-gray-200/50 p-4 bg-gray-50/50"
                whileHover={{ backgroundColor: "#f1f5f9" }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    className="h-10 w-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <User className="h-5 w-5 text-gray-600" />
                  </motion.div>
                  {isSidebarOpen && (
                    <motion.div variants={menuItemVariants}>
                      <p className="text-sm font-medium text-gray-800">
                        {user.email || user.phoneNumber}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">{role}</p>
                    </motion.div>
                  )}
                </div>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-red-600 hover:bg-red-50/50 hover:text-red-700 rounded-xl"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-5 w-5" />
                    {isSidebarOpen && (
                      <motion.span variants={menuItemVariants}>
                        Sign Out
                      </motion.span>
                    )}
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header with Title and Actions */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-30"
        >
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="hidden lg:flex hover:bg-gray-100/50"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
            </div>
            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <motion.div
                className="relative hidden md:block"
                whileHover={{ scale: 1.01 }}
              >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 pl-10 pr-4 py-2 rounded-xl border border-gray-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20 transition-all duration-200 bg-gray-50/50"
                />
              </motion.div>
              {/* Notifications */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-gray-100/50"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center animate-pulse shadow-sm">
                    3
                  </span>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.header>

        {/* Page Content */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100/50"
        >
          <div className="container mx-auto p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPath}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.main>
      </div>

      {/* Toast notifications container */}
      <Toaster />
    </div>
  );
}
