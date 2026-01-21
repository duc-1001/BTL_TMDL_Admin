'use client'
import UserLayout from '@/components/layout/user/user-layout'
import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

export default function RootLayout({ children, }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)
  const router = useRouter()
  const isUserRoute = pathname.startsWith('/account') || pathname.startsWith('/orders') || pathname.startsWith('/wishlist')
  if (!isAuthenticated && isUserRoute) {
    console.log("User is not authenticated. Redirecting to login page.")
    router.push("/")
    return null
  }
  return (
    <UserLayout>
      {children}
    </UserLayout>
  )
}




