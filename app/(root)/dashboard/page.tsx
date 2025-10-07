"use client"
import { getFileCounts, getSharedFiles } from '@/lib/actions/file.actions'
import { useSearchParams } from 'next/navigation'
import { Models } from 'node-appwrite'
import React, { useEffect, useState } from 'react'



interface countsInterface  {
  documents:number
  images:number
  media:number
  others:number
}

const page =  () => {

  const [counts,setCounts] = useState<countsInterface|null>(null)
  const [sharedFiles, setSharedFiles] = useState<Models.Document[]|null>(null)
  useEffect(()=>{
      //fetch stats for cards
    const fetchStats = async ()=>{
    try{
        const result = await getFileCounts()
          setCounts(result)
    }catch(err){
        console.log(err,"error fetching stats");
    }
  }

  //fetch shared files
  const fetchsharedFiles = async ()=>{
    try{
     const result = await  getSharedFiles()
     setSharedFiles(result)   
    }catch(err){
      console.log(err,"error fetching recent activity");
    }
  }




  fetchsharedFiles()
  fetchStats()
},[])

  return (
    <div className='min-h-screen w-full bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 p-4 sm:p-6 lg:p-8'>
      <div className='max-w-7xl mx-auto h-full'>
        <div className='grid w-full gap-4 sm:gap-5 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-fr lg:grid-rows-3'>
          
          <div className='rounded-2xl sm:col-span-2 lg:col-span-2 lg:row-span-1 bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-500 shadow-xl border-2 border-amber-300 p-6 sm:p-8 flex items-center justify-center text-white font-bold text-2xl min-h-[200px] sm:min-h-[250px] lg:min-h-0'>
            <div className='text-center'>
              <h2 className='text-3xl sm:text-4xl font-bold mb-2'>Featured</h2>
              <p className='text-amber-100 text-sm'>Main content area</p>
            </div>
          </div>
          
          <div className='rounded-2xl sm:col-span-2 lg:col-span-2 lg:row-span-3 bg-white/90 backdrop-blur-sm shadow-xl border-2 border-amber-200 p-6 sm:p-8 min-h-[400px] lg:min-h-0'>
            <div className='h-full flex flex-col'>
              <div className='mb-4'>
                <h3 className='text-xl font-bold text-slate-800 mb-2'>Activity </h3>
                <p className='text-sm text-slate-600'>Recent updates and notifications</p>
              </div>
              <div className='flex-1 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border-2 border-amber-200 p-4'>
                {
                
                sharedFiles?.map((item,index)=>(

                <div className='space-y-3'>
                  <div className='flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm'>
                    <div className='w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center'>
                      <svg className='w-5 h-5 text-amber-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' />
                      </svg>
                    </div>
                    <div className='flex-1'>
                      <p className='text-sm font-semibold text-slate-800'>File shared with a user {item.sharedWithEmails}</p>
                      <p className='text-xs text-slate-500'>{`${item.name} `}</p>
                    </div>
                  </div>
                </div>



               )

                )}
                
               



              </div>
            </div>
          </div>
          
          <div className='rounded-2xl sm:col-span-1 lg:col-span-1 lg:row-span-1 bg-white/90 backdrop-blur-sm shadow-lg border-2 border-amber-200 p-5 sm:p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] min-h-[150px] lg:min-h-0'>
            <div className='flex flex-col items-center justify-center h-full text-center'>
              <div className='w-14 h-14 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-xl flex items-center justify-center mb-3'>
                <svg className='w-7 h-7 text-amber-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                </svg>
              </div>
              <h4 className='font-bold text-slate-800 text-lg mb-1'>Documents</h4>
              <p className='text-2xl font-bold text-amber-600'>{counts?.documents}</p>
            </div>
          </div>
          
          <div className='rounded-2xl sm:col-span-1 lg:col-span-1 lg:row-span-1 bg-white/90 backdrop-blur-sm shadow-lg border-2 border-amber-200 p-5 sm:p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] min-h-[150px] lg:min-h-0'>
            <div className='flex flex-col items-center justify-center h-full text-center'>
              <div className='w-14 h-14 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center mb-3'>
                <svg className='w-7 h-7 text-orange-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                </svg>
              </div>
              <h4 className='font-bold text-slate-800 text-lg mb-1'>Images</h4>
              <p className='text-2xl font-bold text-orange-600'>{counts?.images}</p>
            </div>
          </div>
          
          <div className='rounded-2xl sm:col-span-1 lg:col-span-1 lg:row-span-1 bg-white/90 backdrop-blur-sm shadow-lg border-2 border-amber-200 p-5 sm:p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] min-h-[150px] lg:min-h-0'>
            <div className='flex flex-col items-center justify-center h-full text-center'>
              <div className='w-14 h-14 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-xl flex items-center justify-center mb-3'>
                <svg className='w-7 h-7 text-yellow-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' />
                </svg>
              </div>
              <h4 className='font-bold text-slate-800 text-lg mb-1'>Media</h4>
              <p className='text-2xl font-bold text-yellow-600'>{counts?.media}</p>
            </div>
          </div>
          
          <div className='rounded-2xl sm:col-span-1 lg:col-span-1 lg:row-span-1 bg-white/90 backdrop-blur-sm shadow-lg border-2 border-amber-200 p-5 sm:p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] min-h-[150px] lg:min-h-0'>
            <div className='flex flex-col items-center justify-center h-full text-center'>
              <div className='w-14 h-14 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center mb-3'>
                <svg className='w-7 h-7 text-slate-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z' />
                </svg>
              </div>
              <h4 className='font-bold text-slate-800 text-lg mb-1'>Others</h4>
              <p className='text-2xl font-bold text-slate-600'>{counts?.others}</p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default page