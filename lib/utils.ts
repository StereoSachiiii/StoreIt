import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { appwriteConfig } from "./appwrite/config"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const parseStringify = (value:unknown) => {
  return JSON.parse(JSON.stringify(value));
}

// utils.ts - Simplified getFileType
export function getFileType(filename: string): { 
  name: string; 
  extension: string; 
  fileType: string 
} {
  const lastDot = filename.lastIndexOf(".");
  
  if (lastDot === -1 || lastDot === 0) {
    return { name: filename, extension: "", fileType: "other" };
  }
  
  const name = filename.substring(0, lastDot);
  const extension = filename.substring(lastDot + 1);
  const ext = extension.toLowerCase();
  
  let fileType = "other";
  
  // Images
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'ico'].includes(ext)) {
    fileType = "image";
  }
  // Documents
  else if (['pdf', 'txt', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(ext)) {
    fileType = "document";
  }
  // Media (video + audio)
  else if (['mp4', 'avi', 'mov', 'wmv', 'mkv', 'mp3', 'wav', 'flac', 'aac', 'ogg', 'webm'].includes(ext)) {
    fileType = "media";
  }
  
  return { name, extension, fileType };
}



export const constructDownloadUrl = (fileId: string) =>
  `${appwriteConfig.endPointUrl}/storage/buckets/${appwriteConfig.bucketId}/files/${fileId}/download?project=${appwriteConfig.projectId}`;