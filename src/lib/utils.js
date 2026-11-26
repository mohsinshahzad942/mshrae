import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Merges Tailwind class names; Skiper UI and Vengeance UI components import this as `cn`.
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
