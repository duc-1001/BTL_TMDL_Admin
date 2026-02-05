import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price)
}

export const formatDateInput = (date?: Date) => {
  if (!date) return ""
  return date.toISOString().split("T")[0]
}

export const formatDateTimeLocal = (date?: Date) => {
  if (!date) return ""
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16)
}

export const formatDate = (date: string | Date) => {
  const d = new Date(date)
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

export const formatDateTime = (date: string | Date) => {
  const d = new Date(date)
  return d.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

export function getEventRemainingTime(
  startAt?: string | Date,
  endAt?: string | Date
): string | null {
  if (!startAt || !endAt) return null

  const now = new Date()
  const start = new Date(startAt)
  const end = new Date(endAt)

  // Chưa bắt đầu
  if (now < start) {
    return "Sắp diễn ra"
  }

  // Đã kết thúc
  if (now >= end) {
    return "Đã kết thúc"
  }

  const diffMs = end.getTime() - now.getTime()

  const minuteMs = 1000 * 60
  const hourMs = minuteMs * 60
  const dayMs = hourMs * 24
  const monthMs = dayMs * 30 // quy ước 1 tháng = 30 ngày

  // Ưu tiên đơn vị lớn nhất
  const months = Math.floor(diffMs / monthMs)
  if (months >= 1) {
    return `Còn lại: ${months} tháng`
  }

  const days = Math.floor(diffMs / dayMs)
  if (days >= 1) {
    return `Còn lại: ${days} ngày`
  }

  const hours = Math.floor(diffMs / hourMs)
  if (hours >= 1) {
    return `Còn lại: ${hours} giờ`
  }

  const minutes = Math.floor(diffMs / minuteMs)
  return `Còn lại: ${minutes} phút`
}
