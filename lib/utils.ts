'use client'

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date))
}

export function getResultColor(result: string) {
  switch (result) {
    case 'accepted':
      return 'bg-green-500'
    case 'rejected':
      return 'bg-red-500'
    case 'waitlisted':
      return 'bg-yellow-500'
    default:
      return 'bg-gray-500'
  }
}

export function getStatusColor(status: string) {
  switch (status) {
    case 'dream':
      return 'text-purple-600 bg-purple-100'
    case 'target':
      return 'text-blue-600 bg-blue-100'
    case 'safety':
      return 'text-green-600 bg-green-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}
