import { Footer } from '@/components/layout/user/footer'
import UserLayout from '@/components/layout/user/user-layout'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='w-full'>
      {children}
      {/* <Footer/> */}
    </div>
  )
}




