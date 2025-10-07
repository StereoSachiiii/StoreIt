"use client"

import Link from "next/link"
import { Models } from "node-appwrite"
import React from "react"
import ActionDrop from "./ActionDrop"

const Card = ({ file }: { file: Models.Document }) => {
  return (
    <div
      className="relative bg-white/80 backdrop-blur-xl border border-gray-200 
      rounded-2xl shadow-md hover:shadow-lg transition-all p-4 flex flex-col gap-3"
    >
      <div className="flex justify-between items-center">
        <Link
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gradient-to-r from-green-500 to-emerald-600 
          text-white text-sm font-medium px-4 py-2 rounded-xl shadow-sm 
          hover:from-green-600 hover:to-emerald-700 transition-all"
        >
          View File
        </Link>

        <ActionDrop file={file} />
      </div>

      <div className="mt-2 space-y-1 text-sm text-gray-700">
        <p className="font-medium text-gray-900 truncate">{file.name}</p>
        <p className="text-xs text-gray-500">
          Created: {new Date(file.$createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  )
}

export default Card
