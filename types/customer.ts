import { UserAddress } from "./user_address"

export type CustomerStatus = "active" | "new" | "blocked"

export interface Customer {
  _id: string
  name: string
  email: string
  phone: string
  orders: number
  spent: number
  joinDate: string | null
  lastLogin: string | null
  status: CustomerStatus
  avatar?: string
}

export interface CustomerSummary {
   "totalCustomers": number
   "activeCustomers": number
   "newCustomers": number
   "inactiveCustomers": number
}

export interface CustomerQuickView {
  _id: string
  name: string
  avatar?: string
  email: string
  phone: string
  orders: number
  spent: number
  status: CustomerStatus
  joinDate: string | null
  lastLogin: string | null
  addresses: UserAddress[]
}
