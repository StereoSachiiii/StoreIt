"use client"
import React, { useState } from 'react'
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
import { appwriteConfig } from '@/lib/appwrite/config'

export const actionsDropdownItems = [
  {
    label: "Rename",
    icon: "/assets/icons/edit.svg",
    value: "rename",
  },
  {
    label: "Details",
    icon: "/assets/icons/info.svg",
    value: "details",
  },
  {
    label: "Share",
    icon: "/assets/icons/share.svg",
    value: "share",
  },
  {
    label: "Download",
    icon: "/assets/icons/download.svg",
    value: "download",
  },
  {
    label: "Delete",
    icon: "/assets/icons/delete.svg",
    value: "delete",
  },
];

// Helper functions for URLs
const constructFileUrl = (fileId: string, action: 'view' | 'download') => {
  return `${appwriteConfig.endPointUrl}/storage/buckets/${appwriteConfig.bucketId}/files/${fileId}/${action}?project=${appwriteConfig.projectId}`;
};

interface ActionDropProps {
  file: {
    $id: string;
    bucketField: string;
    name: string;
    type: string;
    url: string;
  }
}

const ActionDrop = ({ file }: ActionDropProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [currentAction, setCurrentAction] = useState<string | null>(null)

  const handleAction = (value: string) => {
    switch (value) {
      case 'download':
        // Trigger download
        const downloadUrl = constructFileUrl(file.bucketField, 'download');
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = file.name;
        link.click();
        setIsDropdownOpen(false);
        break;
      
      case 'rename':
      case 'details':
      case 'share':
      case 'delete':
        // Open modal for these actions
        setCurrentAction(value);
        setIsModalOpen(true);
        setIsDropdownOpen(false);
        break;
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger className='text-4xl'>...</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actionsDropdownItems.map((item) => (
            <DropdownMenuItem 
              key={item.value}
              onClick={() => handleAction(item.value)}
            >
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {currentAction === 'rename' && 'Rename File'}
            {currentAction === 'details' && 'File Details'}
            {currentAction === 'share' && 'Share File'}
            {currentAction === 'delete' && 'Delete File'}
          </DialogTitle>
          <DialogDescription>
            {currentAction === 'rename' && `Rename "${file.name}"`}
            {currentAction === 'details' && (
              <div className='space-y-2 text-left'>
                <p><strong>Name:</strong> {file.name}</p>
                <p><strong>Type:</strong> {file.type}</p>
                <p><strong>File ID:</strong> {file.bucketField}</p>
                <p><strong>View URL:</strong> <a href={file.url} target='_blank' className='text-blue-500'>Open</a></p>
              </div>
            )}
            {currentAction === 'share' && `Share "${file.name}"`}
            {currentAction === 'delete' && `Are you sure you want to delete "${file.name}"?`}
          </DialogDescription>
        </DialogHeader>

        {/* Add your modal content here based on currentAction */}
        {currentAction === 'rename' && (
          <div className='space-y-4'>
            <input 
              type="text" 
              defaultValue={file.name}
              className='w-full p-2 border rounded'
            />
            <button className='w-full bg-blue-500 text-white p-2 rounded'>
              Rename
            </button>
          </div>
        )}

        {currentAction === 'delete' && (
          <div className='flex gap-2'>
            <button 
              onClick={() => setIsModalOpen(false)}
              className='flex-1 border p-2 rounded'
            >
              Cancel
            </button>
            <button className='flex-1 bg-red-500 text-white p-2 rounded'>
              Delete
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ActionDrop