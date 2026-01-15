'use client'
import UserLayout from '@/components/layout/user/user-layout'
import { useEffect } from 'react'
import useAuth from '../../hooks/use-auth'
import { usePathname, useRouter } from 'next/navigation'

export default function RootLayout({ children, }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const isUserRoute = pathname.startsWith('/account') || pathname.startsWith('/orders') || pathname.startsWith('/wishlist')
  if (!isAuthenticated && isUserRoute) {
    console.log("User is not authenticated. Redirecting to login page.")
    router.push("/login")
    return null
  }
  return (
    <UserLayout>
      {children}
    </UserLayout>
  )
}




