"use client"

import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'


const FileUploader = () => {
const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
        (<div className='bg-stone-100 p-20 rounded-2xl flex flex-col justify-center items-center gap-5'>
            <div className=" md:flex items-center gap-4">
        <button className="flex items-center gap-1 bg-amber-600 text-white rounded-3xl px-4 py-2">
          <img src="cloud.svg" alt="Upload" className="w-5" />
          Upload
        </button>
       
      </div>
            <p >Drop the files here ...</p>
        </div>)
           :(
          <div>
            
            <p className='bg-stone-100 p-20 rounded-3xl'>Drag 'n' drop some files here, or click to select files</p>
            
            </div>)
      }
    </div>
  )
}

export default FileUploader