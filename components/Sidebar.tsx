"use client"
import { useUser } from '@/app/context/userContext'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'

interface SidebarProps {
  username: string,
  email: string 
}

interface NavItem {
  href: string,
  name: string,
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  { 
    href: "/dashboard", 
    name: "Dashboard",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  },
  { 
    href: "/documents", 
    name: "Documents",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  { 
    href: "/images", 
    name: "Images",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
  { 
    href: "/media", 
    name: "Media",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    )
  },
  { 
    href: "/others", 
    name: "Others",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
      </svg>
    )
  },
];

const Sidebar = ({ username, email }: SidebarProps) => {
  const userDetails = useUser();
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    
  return (
    <>
      <aside className="hidden lg:flex lg:w-64 xl:w-72 flex-1 h-full justify-between flex-col bg-white border-r-2 border-amber-200 ">
  <div className="flex-1 overflow-y-auto py-8 px-4">
    <nav className="space-y-3 mb-50">
      {navItems.map((item, index) => {
        const isActive = pathname === item.href;
        return (
          <Link href={item.href} key={index}>
            <div
              className={`group flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 cursor-pointer font-medium ${
                isActive
                  ? "bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 text-white shadow-lg shadow-amber-500/30"
                  : "text-slate-700 hover:bg-amber-50 hover:text-amber-700"
              }`}
            >
              {item.icon}
              <span className="text-sm">{item.name}</span>
            </div>
          </Link>
        );
      })}
    </nav>
    <Link href="/logout" >
    <div className="p-4 border-t-2 border-amber-200 flex-shrink-0">
      <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border-2 border-amber-200">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center flex-shrink-0 border-2 border-amber-300">
          <svg
            className="w-6 h-6 text-amber-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-800 truncate">
            {userDetails?.username}
          </p>
          <p className="text-xs text-slate-600 truncate">{userDetails?.email}</p>
        </div>
      </div>
    </div>
  </Link>
  </div>

  
</aside>


      <div className='lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-amber-200 shadow-2xl z-50 pb-safe'>
        <nav className='grid grid-cols-5 gap-1 p-2'>
          {navItems.map((item, index) => {
            const isActive = pathname === item.href;
            
            return (
              <Link href={item.href} key={index}>
                <div className={`
                  flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-xl
                  transition-all duration-200
                  ${isActive 
                    ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg' 
                    : 'text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                  }
                `}>
                  {item.icon}
                  <span className='text-[10px] font-semibold truncate max-w-full leading-tight'>
                    {item.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  )
}

export default Sidebar