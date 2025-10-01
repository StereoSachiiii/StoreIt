'use client'
import React, { createContext, useContext, useState } from 'react'
import { FormProvider, useFormContext } from './FormContext'





const layout = ({children}:{children: React.ReactNode}) => {
    

  return (
    <FormProvider >

    
    <div className=' h-screen flex  w-full'>
    <section className='w-1/3 bg-amber-600 p-12 flex flex-col items-center  justify-center'>
        <div className='flex min-h-screen flex-col items-center justify-center'>
           

            <div className='space-y-10 text-white font-serif'>
                <p className='text-4xl font-extrabold'>
                    StoreIT
                </p>
                <h1 className='text-3xl font-semibold'>
                    Manage your files the best way
                </h1>
                <p className='font-extralight'>
                    You can store your precious data here! 
                    let us get started!
                </p>
            </div>
        </div>
    </section>
    <div className='h-screen flex flex-col justify-center items-center w-full '>
        {children}
    </div>
    
    </div>
    </FormProvider>
  )
}

export default layout