"use client"

import Link from "next/link"
import { Models } from "node-appwrite"
import React from "react"
import ActionDrop from "./ActionDrop"

const Card = ({ file }: { file: Models.Document }) => {
  const getFileIcon = (type: string) => {
    const fileType = type?.toLowerCase()
    
    switch (fileType) {
      case 'image':
        return (
          <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )
      case 'video':
      case 'audio':
        return (
          <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
        )
      case 'document':
        return (
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        )
      default:
        return (
          <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
        )
    }
  }

  return (
    <div
      className="group relative bg-white/90 backdrop-blur-sm border-2 border-amber-200 
      rounded-2xl shadow-lg hover:shadow-xl hover:border-amber-300 transition-all duration-300 
      p-5 flex flex-col gap-4 hover:scale-[1.02]"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-400/10 to-orange-400/10 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="flex items-start gap-4">
        {getFileIcon(file.type)}
        
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-1">
            {file.type || 'File'}
          </p>
          <h3 className="font-bold text-slate-800 truncate text-base group-hover:text-amber-700 transition-colors">
            {file.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{new Date(file.$createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="relative z-10">
          <ActionDrop file={file} />
        </div>
      </div>

      <div className="flex gap-2 mt-2">
        <Link
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 group/btn relative overflow-hidden bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 
          text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md 
          hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></span>
          <svg className="relative w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span className="relative">View File</span>
        </Link>
      </div>
    </div>
  )
}

export default Card