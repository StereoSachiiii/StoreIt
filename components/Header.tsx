import React from 'react'
import MobileNavigation from './MobileNavigation'

const Header = React.memo(() => {
  return (
    <header className="w-full flex items-center justify-between p-4 md:p-6 shadow-lg bg-white gap-5">
      {/* Logo + Title */}
      <div className="flex items-center gap-2 md:gap-4">
        <img
          src="/Logo.png"
          alt="Logo"
          className="h-8 md:h-12 w-auto"
        />
        <span className="hidden md:block text-2xl font-bold text-amber-600">
          Storage
        </span>
      </div>

      {/* Search bar (hidden on small screens) */}
      <div className=" flex flex-1 max-w-[600px] items-center gap-2 bg-stone-100 rounded-3xl p-2 shadow-inner">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 50 50"
          className="text-gray-500"
        >
          <path d="M 21 3 C 11.654545 3 4 10.654545 4 20 C 4 29.345455 11.654545 37 21 37 C 24.701287 37 28.127393 35.786719 30.927734 33.755859 L 44.085938 46.914062 L 46.914062 44.085938 L 33.875 31.046875 C 36.43682 28.068316 38 24.210207 38 20 C 38 10.654545 30.345455 3 21 3 z M 21 5 C 29.254545 5 36 11.745455 36 20 C 36 28.254545 29.254545 35 21 35 C 12.745455 35 6 28.254545 6 20 C 6 11.745455 12.745455 5 21 5 z"></path>
        </svg>
        <input
          type="text"
          placeholder="Search"
          className="flex-1 h-10 rounded-2xl bg-stone-100 p-2 outline-none"
        />
      </div>

      {/* Desktop buttons (hidden on mobile) */}
      <div className="hidden md:flex items-center gap-4">
        <button className="flex items-center gap-1 bg-amber-600 text-white rounded-3xl px-4 py-2">
          <img src="cloud.svg" alt="Upload" className="w-5" />
          Upload
        </button>
        <img src="back.svg" alt="Back" className="w-6 cursor-pointer" />
      </div>

      {/* Mobile Hamburger / Trigger */}
      <div className="md:hidden flex items-center">
        <MobileNavigation />
      </div>
    </header>
  )
})

export default Header
