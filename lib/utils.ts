import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const parseStringify = (value:unknown) => {
  return JSON.parse(JSON.stringify(value));
}

export function getFileType(filename: string): { name: string; extension: string; type: string } {
  const lastDot = filename.lastIndexOf(".");
  if (lastDot === -1 || lastDot === 0) {
    return { name: filename, extension: "", type: "" };
  }
  const name = filename.substring(0, lastDot);
  const extension = filename.substring(lastDot + 1);
  let type = "";
  switch (extension.toLowerCase()) {
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "bmp":
    case "svg":
      type = "image";
      break;
    case "mp4":
    case "avi":
    case "mov":
    case "wmv":
    case "mkv":
      type = "video";
      break;
    case "mp3":
    case "wav":
    case "flac":
    case "aac":
      type = "audio";
      break;
    case "pdf":
      type = "document";
      break;
    case "doc":
    case "docx":
      type = "word";
      break;
    case "xls":
    case "xlsx":
      type = "excel";
      break;
    case "ppt":
    case "pptx":
      type = "presentation";
      break;
    case "txt":
      type = "text";
      break;
    case "zip":
    case "rar":
    case "7z":
      type = "archive";
      break;
    default:
      type = "unknown";
  }
  return { name, extension, type };
}