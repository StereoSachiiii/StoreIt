"use client"
import { UserContext, useUser } from '@/app/context/userContext'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import path from 'path'
import React, { useContext } from 'react'


interface sideBarProps  {
    username : string ,
    email :string 
}


interface navItem {
    href:string,
    name:string,
}
const navItems: navItem[] = [
  { href: "/dashboard", name: "Dashboard" },
  { href: "/documents", name: "Documents" },
  { href: "/images", name: "Images" },
  { href: "/media", name: "Media" },
  { href: "/others", name: "Others" },
];










const Sidebar = ({username , email }:sideBarProps) => {
  const userDetails = useUser()

    const pathname = usePathname();
    
  return (
    <div className='w-1/5 h-full py-6 px-7 hidden  sm:flex flex-col gap-6 shadow-lg justify-between'>
        <div className='flex flex-col gap-6'>
                
   { navItems.map((item,index)=>(

    <Link href={item.href} key={index}>
                    <div className={`w-full bg-amber-600 p-3 overflow-hidden text-white rounded-3xl flex justify-center items-center gap-2 ${pathname===item.href ?"bg-blue-500 text-white" : "text-gray-600" }` }> <img src={`${item.name}.png`} alt="" />{item.name}</div>
    </Link>    


)

)}

        </div>


        <div className=' flex items-center  justify-center w-full  bg-stone-50 p-1 rounded-2xl shadow-md '>
                
                <div title='Username' className=''>
                {userDetails?.username}
                <br />
                
                {userDetails?.email}
                <br />

                
                <img src="person.png"  className="w-8 h-8" alt="" />
        </div>
                </div>


        

    </div>
  )
}

export default Sidebar