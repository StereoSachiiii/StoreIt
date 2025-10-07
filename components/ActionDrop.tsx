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
  { label: "Rename", icon: "/assets/icons/edit.svg", value: "rename" },
  { label: "Details", icon: "/assets/icons/info.svg", value: "details" },
  { label: "Share", icon: "/assets/icons/share.svg", value: "share" },
  { label: "Download", icon: "/assets/icons/download.svg", value: "download" },
  { label: "Delete", icon: "/assets/icons/delete.svg", value: "delete" },
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
  const [email , setEmail] = useState("")

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

  const handleDelete = async () =>{
    if(!file) return;
try{
      await deleteFile({
            fileId:file.$id,
            path:"/documents",
        })
    setIsModalOpen(false)
}catch(err){
    console.log(err,"error deleting");
}





  }

 const shareFile = async () => {
  if (!email.trim()) return; 

  try {
    await shareFileWithUser({
      fileId: file.$id,
      targetEmail: email.trim(),
      path: "/documents",
    });
    setIsModalOpen(false);
    setEmail(""); 
  } catch (error) {
    console.error("Error sharing file:", error);
  }
}

return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger
          className="text-sm font-medium bg-gradient-to-r from-blue-500 to-indigo-500 
          text-white px-4 py-2.5 rounded-xl hover:from-blue-600 hover:to-indigo-600 
          transition-all shadow-lg flex items-center gap-2 backdrop-blur-sm"
        >
          
          <span>Options</span>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-48 rounded-xl bg-white/80 backdrop-blur-xl border border-gray-200 shadow-xl"
        >
          <DropdownMenuLabel className="text-xs uppercase tracking-wide text-gray-500 px-3 py-1.5">
            Actions
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-gray-200" />

          {actionsDropdownItems.map((item) => (
            <DropdownMenuItem
              key={item.value}
              onClick={() => handleAction(item.value)}
              className="cursor-pointer flex items-center gap-2 px-3 py-2.5 text-sm text-gray-800 
              hover:bg-gray-100/70 rounded-lg transition-all"
            >
             
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent className="max-w-md rounded-2xl p-6 bg-white/90 backdrop-blur-xl shadow-2xl border border-gray-200">
        <DialogHeader className="space-y-1.5">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            {currentAction === "rename" && "Rename File"}
            {currentAction === "details" && "File Details"}
            {currentAction === "share" && "Share File"}
            {currentAction === "delete" && "Delete File"}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            {currentAction === "rename" && `Rename “${file.name}”`}
            {currentAction === "details" && "View file information below"}
            {currentAction === "share" && "type the email you want to share with"}
            {currentAction === "delete" &&
              `Are you sure you want to delete “${file.name}”?`}
          </DialogDescription>
        </DialogHeader>

        {currentAction === "rename" && (
          <div className="mt-5 space-y-4">
            <input
              type="text"
              value={newFileName || file.name}
              onChange={(e) =>{ setNewFileName(e.target.value)}}
              className="w-full p-2.5 border border-gray-300 rounded-lg bg-white/80 
              focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 border border-gray-300 p-2.5 rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white 
              p-2.5 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition"
              onClick={handleRename}
              >
                Rename
              </button>
            </div>
          </div>
        )}

        {currentAction === "details" && (
          <div className="mt-4 text-sm space-y-2 text-gray-800">
            <p><strong>Name:</strong> {file.name}</p>
            <p><strong>Type:</strong> {file.type}</p>
            <p><strong>ID:</strong> {file.bucketField}</p>
            <p>
              <strong>URL:</strong>{" "}
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline break-all hover:text-blue-700"
              >
                Open File
              </a>
            </p>
          </div>
        )}

        {currentAction === "share" && (
          <div className="mt-4 space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e)=>{setEmail(e.target.value)}}              
              className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-sm shadow-sm"
            />
            <button
              onClick={()=>{
                shareFile()
                setIsModalOpen(false)
            }}             
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white 
              p-2.5 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition"
            >
             share
            </button>
          </div>
        )}

        {currentAction === "delete" && (
          <div className="mt-4 space-y-4">
            <p className="text-sm text-gray-600">
              This action is permanent and cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 border border-gray-300 p-2.5 rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 text-white 
              p-2.5 rounded-lg hover:from-red-600 hover:to-rose-700 transition"
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
