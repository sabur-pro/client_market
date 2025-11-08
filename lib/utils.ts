import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function getImageUrl(imageUrl: string | null | undefined): string {
  if (!imageUrl) {
    return '/placeholder.png';
  }

  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  if (imageUrl.startsWith('/uploads/')) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://135.125.182.46:3000';
    return `${apiUrl}${imageUrl}`;
  }

  return imageUrl;
}
