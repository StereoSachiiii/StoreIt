"use client"

import { getFileType } from '@/lib/utils'
import { FileType } from 'lucide-react'
import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'


const FileUploader = () => {

const [files, setFiles] = useState<File[]>([])
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        const binaryStr = reader.result
        console.log(binaryStr)
      }
      reader.readAsArrayBuffer(file)
      setFiles((prev)=>([...prev, file]))
      
    })

    
  }, [])


  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (


    <div>
       <div className='p-2 h-auto w-full bg-accent rounded-2xl mb-6'>
       {
        files.length > 0 && (
          <ul className='grid grid-cols-3  '>
            
              {
                files.map((file, index) => {
                  const type = file.type;
                  const { name, extension, fileType }= getFileType(file.name);
                  return (
                    <li key={`${file.name}-${index}`}
                        className=''
                    >
                      


                     <div>
                      <p className='text-sm text-center'>
                        {fileType}
                      </p>
                      <p className='text-sm text-center'>
                        {`${name}.${extension}`}
                      </p>
                     </div>
                    </li>
                  );
                })
                
              }
            
          </ul>
        )
      }

    </div>



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

    </div>

  )
}

export default FileUploader
