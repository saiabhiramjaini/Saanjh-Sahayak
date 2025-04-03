import type React from "react"
import Link from "next/link"
import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { Home, Users, LogOut, Menu, Building, Upload, ClipboardList, User, Stethoscope } from "lucide-react"
import { Chatbot } from "./chatbot"

interface SidebarLinkProps {
  href: string
  icon: React.ElementType
  children: ReactNode
  active?: boolean
}

function SidebarLink({ href, icon: Icon, children, active }: SidebarLinkProps) {
  return (
    <Link href={href}>
      <Button
        variant="ghost"
        className={`w-full justify-start rounded-lg px-4 py-6 text-sm font-medium transition-colors ${
          active 
            ? "bg-teal-50 text-teal-700 hover:bg-teal-50" 
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        }`}
      >
        <Icon className="mr-3 h-5 w-5" />
        {children}
      </Button>
    </Link>
  )
}

interface DashboardLayoutProps {
  children: ReactNode
  role: "caretaker" | "doctor"
  currentPath: string
}

export function DashboardLayout({ children, role, currentPath }: DashboardLayoutProps) {
  const caretakerLinks = [
    { href: "/caretaker", icon: Home, label: "Dashboard" },
    { href: "/caretaker/patients", icon: Users, label: "Patients" },
    { href: "/caretaker/upload-report", icon: Upload, label: "Upload Report" },
  ]

  const doctorLinks = [
    { href: "/doctor", icon: Home, label: "Dashboard" },
    { href: "/doctor/evaluation", icon: ClipboardList, label: "Evaluations" },
    { href: "/doctor/patients", icon: User, label: "My Patients" },
  ]

  const links = role === "caretaker" ? caretakerLinks : doctorLinks

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b p-4 flex items-center justify-between">
        <h1 className="font-bold text-teal-600 text-xl">Saanjh Sahayak</h1>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-white border-r h-screen sticky top-0">
          <div className="p-6 border-b">
            <h1 className="font-bold text-teal-600 text-xl">Saanjh Sahayak</h1>
            <p className="text-sm text-gray-500 mt-1">{role === "caretaker" ? "Caretaker" : "Doctor"} Portal</p>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            {links.map((link) => (
              <SidebarLink 
                key={link.href} 
                href={link.href} 
                icon={link.icon} 
                active={currentPath === link.href}
              >
                {link.label}
              </SidebarLink>
            ))}
          </nav>
          <div className="p-4 border-t">
            <Link href="/signin">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg px-4 py-6"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Sign Out
              </Button>
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>

      {/* Chatbot */}
      <Chatbot />
    </div>
  )
}