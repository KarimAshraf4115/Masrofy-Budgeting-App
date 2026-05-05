'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AppShell({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname()

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // Helper function to decide if a link should have the Active (Blue) or Inactive (Gray) style
  const getLinkClasses = (href) => {
    const baseClasses = "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300"
    const activeClasses = "text-blue-900 bg-blue-50 border-r-4 border-blue-900"
    const inactiveClasses = "text-slate-500 hover:text-blue-900 hover:bg-slate-50"

    return `${baseClasses} ${pathname === href ? activeClasses : inactiveClasses}`
  }

  return (
    <>
      {/* ========================================== */}
      {/* 1. MOBILE TOP NAV BAR (Hidden on Desktop) */}
      {/* ========================================== */}
      <header className="md:hidden bg-slate-50/80 backdrop-blur-md sticky top-0 border-b border-slate-200 shadow-sm flex justify-between items-center w-full px-6 py-3 h-16 z-50">
        <div className="flex items-center gap-4">
          <button onClick={toggleSidebar} className="text-blue-900 cursor-pointer p-1">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <span className="text-xl font-bold text-blue-900 tracking-tight">Masroofy</span>
        </div>
        <div className="flex items-center">
          <button className="text-blue-900 hover:bg-slate-100 transition-colors p-2 rounded-full">
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </div>
      </header>

      {/* ========================================== */}
      {/* 2. DESKTOP SIDEBAR & MOBILE SLIDE-IN */}
      {/* ========================================== */}
      <aside className={`
        flex flex-col h-screen w-64 fixed left-0 top-0 border-r border-slate-100 shadow-[4px_0_20px_rgba(0,0,0,0.04)] bg-white p-4 gap-2 z-50 transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:flex
      `}>
        
        {/* Close Button for Mobile */}
        <div className="md:hidden flex justify-end mb-4">
          <button onClick={toggleSidebar} className="text-slate-500 hover:text-blue-900 p-2">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Logo Area */}
        <div className="px-4 pt-4 mb-8">
      <Link href="/login">
        <h1 className="text-2xl font-black text-blue-900 cursor-pointer">Masrofy</h1>
      </Link>         
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Financial Precision</p>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex-1 flex flex-col gap-2">
          <Link onClick={toggleSidebar} className={getLinkClasses('/dashboard')} href="/dashboard">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-sm font-medium">Dashboard</span>
          </Link>
          
          <Link onClick={toggleSidebar} className={getLinkClasses('/history')} href="/history">
            <span className="material-symbols-outlined">receipt_long</span>
            <span className="text-sm font-medium">History</span>
          </Link>
          
          <Link onClick={toggleSidebar} className={getLinkClasses('/setup')} href="/setup">
            <span className="material-symbols-outlined">settings_accessibility</span>
            <span className="text-sm font-medium">Setup</span>
          </Link>
          
          <Link onClick={toggleSidebar} className={getLinkClasses('/settings')} href="/settings">
            <span className="material-symbols-outlined">settings</span>
            <span className="text-sm font-medium">Settings</span>
          </Link>
        </nav>

        {/* Bottom Actions */}
        <div className="mt-auto">
          {/* Add Expense Button */}
          <Link href="/expenses/add" onClick={toggleSidebar} className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-3 rounded-lg font-label-caps text-label-caps hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm mb-4">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add Expense
          </Link>
        </div>
      </aside>

      {/* Dark overlay when mobile sidebar is open */}
      {isSidebarOpen && (
        <div onClick={toggleSidebar} className="fixed inset-0 bg-black/30 z-40 md:hidden"></div>
      )}

      {/* ========================================== */}
      {/* 3. MAIN CONTENT AREA */}
      {/* ========================================== */}
      <main className="md:ml-64 pt-16 md:pt-0 min-h-screen">
        {children}
      </main>

    </>
  )
}