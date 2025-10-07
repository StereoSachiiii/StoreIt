import React from 'react'
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

const loading = () => {
  return (
    <div className='bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex justify-center items-center w-full h-full'>
        <div className="flex flex-col items-center gap-4">
      
      <Button variant="secondary"  size="sm">
        <Spinner className='size-40  text-amber-600' />
        <br />
        <p className=' text-amber-600 text-4xl'>Fetching your files! hold on 🤓</p>
      </Button>
    </div> 
    </div>
  )
}

export default loading