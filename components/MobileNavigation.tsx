"use client"
import React from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Separator } from "@/components/ui/separator"
const navItems = [
  { href: "/dashboard", name: "Dashboard" },
  { href: "/documents", name: "Documents" },
  { href: "/images", name: "Images" },
  { href: "/media", name: "Media" },
  { href: "/others", name: "Others" },
];

const MobileNavigation = () => {
  const pathname = usePathname();

  return (
    <div className="flex items-center justify-between p-4 sm:hidden">
      {/* Hamburger Trigger */}
      <Sheet>
        <SheetTrigger asChild>
          <button className="flex flex-col justify-between w-6 h-6 p-1 focus:outline-none 
                             hover:scale-110 active:scale-105 transition-transform duration-150">
            <span className="block w-full h-0.5 bg-black rounded"></span>
            <span className="block w-full h-0.5 bg-black rounded"></span>
            <span className="block w-full h-0.5 bg-black rounded"></span>
          </button>
        </SheetTrigger>

        <SheetContent>
          <div className="w-full h-full py-6 px-7 flex flex-col gap-6 shadow-lg justify-between">
            {navItems.map((item,index)=>(
              <Link key={index} href={item.href}>
                <div className={`w-full p-3 rounded-3xl flex justify-center items-center gap-2
                  ${pathname===item.href ? "bg-blue-500 text-white" : "bg-amber-600 text-gray-600"}`}>
                  <img src={`${item.name}.png`} alt="" /> {item.name}
                </div>
                <Separator />
              </Link>
              
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default MobileNavigation
