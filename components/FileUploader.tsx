"use client"

import { uploadFile } from '@/lib/actions/file.actions'
import { getFileType } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { toast } from 'sonner'
import { useUser } from '../app/context/userContext'

const FileUploader = () => {
  const { ownerId, accountId } = useUser();
  const path = usePathname()
  const [files, setFiles] = useState<File[]>([])
  const [uploaded, setUploadedFiles] = useState<File[]>([])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast("File too large (max 5MB)")
        return false
      }
      return true
    })

    setFiles(prev => [...prev, ...validFiles])

    try {
      const uploadPromises = validFiles.map(async (file) => {
        const uploadedFile = await uploadFile({ file, ownerId, accountId, path })
        if (uploadedFile) {
          toast(`Uploaded: ${file.name}`)
          setUploadedFiles(prev => [...prev, file])
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
 
  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'image':
        return (
          <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )
      case 'video':
        return (
          <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )
      case 'document':
        return (
          <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      default:
        return (
          <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        )
    }
  }

  return (
    <div className="space-y-6">
      {uploaded.length > 0 && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-green-800">Successfully Uploaded</h3>
            <span className="ml-auto bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              {uploaded.length} {uploaded.length === 1 ? 'file' : 'files'}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {uploaded.map((file, index) => {
              const { name, extension, fileType } = getFileType(file.name)
              return (
                <div key={`${file.name}-${index}`} className="bg-white rounded-xl p-4 shadow-sm border border-green-200 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start gap-3">
                    {getFileIcon(fileType)}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-green-600 uppercase mb-1">{fileType}</p>
                      <p className="text-sm font-semibold text-slate-800 truncate">{name}</p>
                      <p className="text-xs text-slate-500">.{extension}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {files.length > 0 && (
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border-2 border-amber-300 shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center animate-pulse">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-amber-800">Uploading...</h3>
            <span className="ml-auto bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">
              {files.length} {files.length === 1 ? 'file' : 'files'}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {files.map((file, index) => {
              const { name, extension, fileType } = getFileType(file.name)
              return (
                <div key={`${file.name}-${index}`} className="bg-white rounded-xl p-4 shadow-sm border border-amber-300 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start gap-3">
                    {getFileIcon(fileType)}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-amber-600 uppercase mb-1">{fileType}</p>
                      <p className="text-sm font-semibold text-slate-800 truncate">{name}</p>
                      <p className="text-xs text-slate-500">.{extension}</p>
                    </div>
                  </div>
                  <div className="mt-3 h-1.5 bg-amber-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full animate-pulse w-3/4"></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <div className={`
          relative overflow-hidden rounded-3xl p-12 sm:p-16 lg:p-20 
          border-3 border-dashed transition-all duration-300 cursor-pointer
          ${isDragActive 
            ? 'bg-gradient-to-br from-amber-100 to-orange-100 border-amber-500 shadow-2xl scale-105' 
            : 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-300 hover:border-amber-400 hover:shadow-xl hover:from-amber-50 hover:to-orange-50'
          }
        `}>
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-4 left-4 w-20 h-20 bg-amber-400 rounded-full blur-2xl"></div>
            <div className="absolute bottom-4 right-4 w-32 h-32 bg-orange-400 rounded-full blur-3xl"></div>
          </div>

          <div className="relative flex flex-col items-center gap-6">
            {isDragActive ? (
              <>
                <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-xl animate-bounce">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-amber-700 mb-2">Drop your files here!</p>
                  <p className="text-slate-600">Release to start uploading</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-xl sm:text-2xl font-bold text-slate-800">
                    Drag & drop your files here
                  </p>
                  <p className="text-slate-600">or click to browse from your device</p>
                  <p className="text-xs text-slate-500 mt-4">Maximum file size: 5MB</p>
                </div>
                <button className="mt-4 px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 hover:scale-105">
                  Select Files
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FileUploader