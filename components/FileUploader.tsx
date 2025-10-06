"use client"

import { uploadFile } from '@/lib/actions/file.actions'
import { getFileType } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { toast } from 'sonner'
import { useUser } from '../app/context/userContext'


const FileUploader = () => {
  const { ownerId, accountId } = useUser(); // Get from context
  const path = usePathname()
  const [files, setFiles] = useState<File[]>([])
  const [uploaded, setUploadedFiles] = useState<File[]>([])



  const onDrop = useCallback(async (acceptedFiles: File[]) => {
   

    // Validate before uploading
    const validFiles = acceptedFiles.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast("File too large (max 5MB)")
        return false
      }
      return true
    })

    // Show in UI
    setFiles(prev => [...prev, ...validFiles])

    // Perform uploads
    try {
      const uploadPromises = validFiles.map(async (file) => {
        const uploadedFile = await uploadFile({ file, ownerId, accountId, path })
        if (uploadedFile) {
          toast(`Uploaded: ${file.name}`)
          // Remove from pending list after upload'
                        setUploadedFiles(prev => [...prev,file])

          


          setFiles(prev => prev.filter(f => f.name !== file.name))
          
        }
      })

      await Promise.all(uploadPromises)
    } catch (err) {
      console.error(err)
      toast("Upload failed")
    }
  }, [ownerId, accountId, path])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })
 
  return (
    <div>


       <div className="h-auto w-full bg-lime-200 rounded-2xl mb-6">
        {uploaded.length>0 && (
          <ul className="grid grid-cols-3 p-3">
            {uploaded.map((file, index) => {
              const { name, extension, fileType } = getFileType(file.name)
              console.log(name,uploaded)
              
              return (
                <li key={`${file.name}-${index}`} className='border-1'>
                  <div>
                    
                    <p className="text-sm text-center">{fileType}</p>
                    <p className="text-sm text-center">{`${name}.${extension}`}</p>
                  </div>
                </li>
                
              )

            })}
          </ul>
        )}
      </div>



      <div className="h-auto w-full bg-accent rounded-2xl mb-6">
        {files.length>0 && (
          <ul className="grid grid-cols-3 p-3">
            {files.map((file, index) => {
              const { name, extension, fileType } = getFileType(file.name)
              

              return (
                <li key={`${file.name}-${index}`}>
                  <div>
                    
                    <p className="text-sm text-center">{fileType}</p>
                    <p className="text-sm text-center">{`${name}.${extension}`}</p>
                  </div>
                </li>
                
              )

            })}
          </ul>
        )}
      </div>

      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <div className="bg-stone-100 p-20 rounded-3xl flex flex-col justify-center items-center gap-5">
          {isDragActive ? (
            <>
              <div className="md:flex items-center gap-4">
                <button className="flex items-center gap-1 bg-amber-600 text-white rounded-3xl px-4 py-2">
                  <img src="cloud.svg" alt="Upload" className="w-5" />
                  Upload
                </button>
              </div>
              <p>Drop the files here...</p>
            </>
          ) : (
            <p>Drag & drop some files here, or click to select files</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default FileUploader