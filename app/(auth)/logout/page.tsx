"use client"
import React from 'react'
import Link from 'next/link'
import { signOut } from '@/lib/actions/user.actions'
import { symbol } from 'zod'



const signOutHandler = async () =>{
try{
     await signOut()

}catch(err){
    console.log(err,"error logging out");
}

}



const page = () => {
  return (
    <div className='min-h-screen w-full bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 flex items-center justify-center p-4'>
      <div className='max-w-md w-full'>
        <div className='bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-amber-200 p-8 sm:p-10'>
          <div className='text-center space-y-6'>
            <div className='inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-2xl mb-4 animate-pulse'>
              <svg className='w-10 h-10 text-amber-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
              </svg>
            </div>

            <div>
              <h1 className='text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-3'>
                Sign Out
              </h1>
              <p className='text-slate-600 text-base sm:text-lg'>
                Are you sure you want to log out of your account?
              </p>
            </div>

            <div className='bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-4 border-2 border-amber-200'>
              <p className='text-sm text-slate-700'>
                You'll need to sign in again to access your files and folders.
              </p>
            </div>

            <div className='space-y-3 pt-4'>
              <button 
                className='w-full h-12 bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 hover:from-amber-600 hover:via-yellow-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2'
                onClick={() => {
                  signOutHandler()
                  console.log('Logging out...')
                }}
              >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
                </svg>
                Yes, Sign Me Out
              </button>

              <Link href='/dashboard'>
                <button className='w-full h-12 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2'>
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 19l-7-7m0 0l7-7m-7 7h18' />
                  </svg>
                  Cancel, Go Back
                </button>
              </Link>
            </div>

            <div className='pt-4 border-t-2 border-amber-200'>
              <p className='text-xs text-slate-500'>
                Need help? <Link href='/support' className='text-amber-600 hover:text-amber-700 font-semibold hover:underline'>Contact Support</Link>
              </p>
            </div>
          </div>
        </div>

        <div className='mt-6 text-center'>
          <p className='text-sm text-slate-600'>
            Thanks for using <span className='font-bold text-amber-600'>StoreIT</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default page