"use client"
import Link from 'next/link'
import React from 'react'


const Sidebar = () => {
  return (
    <div className='w-1/5 h-full py-6 px-8 flex flex-col gap-6 shadow-lg '>

        <Link href="/dashboard">
            <div className='w-full bg-amber-600 p-3 text-white rounded-3xl flex justify-center items-center gap-2 '> <img src="Dashboard.png" alt="" />Dashboard</div>
        </Link>
         <Link href="/documents">
            <div className='w-full bg-amber-600 p-3 text-white rounded-3xl flex justify-center items-center gap-2 '> <img src="Folder.png" alt="" />Documents</div>
         </Link>

         <Link href="/">
                    <div className='w-full bg-amber-600 p-3 text-white rounded-3xl flex justify-center items-center gap-2 '> <img src="Image.png" alt="" /> Images</div>

         </Link>

         <Link>
                    <div className='w-full bg-amber-600 p-3 text-white rounded-3xl flex justify-center items-center gap-2'><img src="Video.png" alt="" />Media</div>

         </Link>

         <Link>
                    <div className='w-full bg-amber-600 p-3 text-white rounded-3xl flex justify-center items-center gap-2 '><img src="Other.png" alt="" />others</div>

         </Link>



   

    </div>
  )
}

export default Sidebar