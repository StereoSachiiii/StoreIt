"use client"

import React, { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import Image from "next/image"
import { appwriteConfig } from "@/lib/appwrite/config"
import { deleteFile, renameFile, shareFileWithUser } from "@/lib/actions/file.actions"

const actionsDropdownItems = [
  { 
    label: "Rename", 
    value: "rename",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    )
  },
  { 
    label: "Details", 
    value: "details",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  { 
    label: "Share", 
    value: "share",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
    )
  },
  { 
    label: "Download", 
    value: "download",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    )
  },
  { 
    label: "Delete", 
    value: "delete",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    )
  },
]

const constructFileUrl = (fileId: string, action: "view" | "download") => {
  return `${appwriteConfig.endPointUrl}/storage/buckets/${appwriteConfig.bucketId}/files/${fileId}/${action}?project=${appwriteConfig.projectId}`
}

interface ActionDropProps {
  file?: {
    $id: string
    bucketField: string
    name: string
    type: string
    url: string
  }
}

const ActionDrop = ({ file }: ActionDropProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [currentAction, setCurrentAction] = useState<string | null>(null)
  const [newFileName, setNewFileName] = useState("")
  const [shareLink, setShareLink] = useState("")
  const [email, setEmail] = useState("")

  if (!file) return null

  const handleAction = (value: string) => {
    if (!file) return

    switch (value) {
      case "download": {
        const downloadUrl = constructFileUrl(file.bucketField, "download")
        const link = document.createElement("a")
        link.href = downloadUrl
        link.download = file.name
        link.click()
        setIsDropdownOpen(false)
        break
      }

      default:
        setCurrentAction(value)
        setIsModalOpen(true)
        setIsDropdownOpen(false)
        break
    }
  }

  const fileShareUrl = `${window.location.origin}/share/${file.bucketField}`

  const handleRename = async () => {
    if (!file || !newFileName.trim()) return

    const [baseName, extension] = file.name.split(".")
    try {
      await renameFile({
        fileId: file.$id,
        name: newFileName.trim(),
        extension: extension || "",
        path: "/documents"
      })
      setIsModalOpen(false)
    } catch (error) {
      console.error("Rename failed:", error)
    }
  }

  const handleDelete = async () => {
    if (!file) return
    try {
      await deleteFile({
        fileId: file.$id,
        path: "/documents",
      })
      setIsModalOpen(false)
    } catch (err) {
      console.log(err, "error deleting")
    }
  }

  const shareFile = async () => {
    if (!email.trim()) return

    try {
      await shareFileWithUser({
        fileId: file.$id,
        targetEmail: email.trim(),
        path: "/documents",
      })
      setIsModalOpen(false)
      setEmail("")
    } catch (error) {
      console.error("Error sharing file:", error)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger
          className="text-sm font-semibold bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 
          text-white px-4 py-2 rounded-xl hover:from-amber-600 hover:via-yellow-600 hover:to-orange-600 
          transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 backdrop-blur-sm hover:scale-105"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
          <span>Actions</span>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-52 rounded-2xl bg-white/95 backdrop-blur-xl border-2 border-amber-200 shadow-2xl p-2"
        >
          <DropdownMenuLabel className="text-xs uppercase tracking-wide text-amber-700 font-bold px-3 py-2">
            File Actions
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-amber-200 my-1" />

          {actionsDropdownItems.map((item) => (
            <DropdownMenuItem
              key={item.value}
              onClick={() => handleAction(item.value)}
              className={`cursor-pointer flex items-center gap-3 px-3 py-2.5 text-sm font-medium
              rounded-xl transition-all duration-200 ${
                item.value === "delete"
                  ? "text-red-700 hover:bg-red-50 hover:text-red-800"
                  : "text-slate-700 hover:bg-amber-50 hover:text-amber-800"
              }`}
            >
              <div className={`${item.value === "delete" ? "text-red-600" : "text-amber-600"}`}>
                {item.icon}
              </div>
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent className="max-w-md rounded-3xl p-8 bg-white/95 backdrop-blur-xl shadow-2xl border-2 border-amber-200">
        <DialogHeader className="space-y-3">
          <div className="w-14 h-14 mx-auto bg-gradient-to-br from-amber-100 to-yellow-100 rounded-2xl flex items-center justify-center mb-2">
            {currentAction === "rename" && (
              <svg className="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            )}
            {currentAction === "details" && (
              <svg className="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {currentAction === "share" && (
              <svg className="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            )}
            {currentAction === "delete" && (
              <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-slate-800 text-center">
            {currentAction === "rename" && "Rename File"}
            {currentAction === "details" && "File Details"}
            {currentAction === "share" && "Share File"}
            {currentAction === "delete" && "Delete File"}
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-600 text-center">
            {currentAction === "rename" && `Rename "${file.name}"`}
            {currentAction === "details" && "View file information below"}
            {currentAction === "share" && "Enter the email address you want to share with"}
            {currentAction === "delete" && `Are you sure you want to delete "${file.name}"?`}
          </DialogDescription>
        </DialogHeader>

        {currentAction === "rename" && (
          <div className="mt-6 space-y-4">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                type="text"
                value={newFileName || file.name}
                onChange={(e) => setNewFileName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-amber-200 rounded-xl bg-white 
                focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-sm font-medium shadow-sm transition-all"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 border-2 border-slate-300 text-slate-700 font-semibold py-3 rounded-xl hover:bg-slate-50 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                className="flex-1 bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 text-white font-semibold
                py-3 rounded-xl hover:from-amber-600 hover:via-yellow-600 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={handleRename}
              >
                Rename
              </button>
            </div>
          </div>
        )}

        {currentAction === "details" && (
          <div className="mt-6 space-y-4">
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-4 border-2 border-amber-200">
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-amber-700 min-w-[60px]">Name:</span>
                  <span className="text-slate-700 break-all">{file.name}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-amber-700 min-w-[60px]">Type:</span>
                  <span className="text-slate-700">{file.type}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-amber-700 min-w-[60px]">ID:</span>
                  <span className="text-slate-700 font-mono text-xs break-all">{file.bucketField}</span>
                </div>
              </div>
            </div>
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 text-white font-semibold
              py-3 rounded-xl hover:from-amber-600 hover:via-yellow-600 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Open File
            </a>
          </div>
        )}

        {currentAction === "share" && (
          <div className="mt-6 space-y-4">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full pl-10 pr-4 py-3 border-2 border-amber-200 rounded-xl bg-white 
                focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-sm shadow-sm transition-all"
              />
            </div>
            <button
              onClick={() => {
                shareFile()
                setIsModalOpen(false)
              }}
              className="w-full bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 text-white font-semibold
              py-3 rounded-xl hover:from-amber-600 hover:via-yellow-600 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share File
            </button>
          </div>
        )}

        {currentAction === "delete" && (
          <div className="mt-6 space-y-4">
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <p className="text-sm text-red-800 text-center font-medium">
                This action is permanent and cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 border-2 border-slate-300 text-slate-700 font-semibold py-3 rounded-xl hover:bg-slate-50 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold
                py-3 rounded-xl hover:from-red-600 hover:to-rose-700 shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ActionDrop