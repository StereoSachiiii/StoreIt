'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

const Header = React.memo(() => {
  const router = useRouter()
  const pathname = usePathname()
  const [searchText, setSearchText] = useState('')

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      
      const params = new URLSearchParams()
      if (searchText.trim()) params.set('query', searchText.trim())
      router.push(`${pathname}?${params.toString()}`)
    }
  }

  return (
    <header className="w-full flex items-center justify-between p-4 md:p-6 shadow-lg bg-white border-b-2 border-amber-200 gap-3 md:gap-5">
      <div className="flex items-center gap-2 md:gap-4">
        <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
          <svg className="w-5 h-5 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
          </svg>
        </div>
        <span className="hidden md:block text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
          StoreIT
        </span>
      </div>

      <div className="flex flex-1 max-w-[600px] items-center gap-2 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-2 shadow-inner border-2 border-amber-200">
        <svg
          className="w-5 h-5 text-amber-600 flex-shrink-0 ml-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search files..."
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          onKeyDown={handleSearch}
          className="flex-1 h-8 md:h-10 bg-transparent outline-none text-sm md:text-base text-slate-700 placeholder:text-slate-400"
        />
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <Link href="/upload">
          <button className="flex items-center gap-2 bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 hover:from-amber-600 hover:via-yellow-600 hover:to-orange-600 text-white rounded-xl px-3 py-2 md:px-4 md:py-2.5 font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="hidden sm:inline">Upload</span>
          </button>
        </Link>
      </div>
    </header>
  )
})

Header.displayName = 'Header'
export default Header
