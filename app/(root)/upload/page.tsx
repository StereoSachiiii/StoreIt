import FileUploader from '@/components/FileUploader'
import React from 'react'


const page = () => {
  return (
    <div className='w-full h-full flex-1  flex justify-center items-center'>
        <div className="bg-white rounded-2xl  " style={{
            

        }}>
    <FileUploader />
        </div>
        
    </div>
  )
}

export default page