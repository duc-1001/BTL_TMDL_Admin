import React from 'react'
import { SidebarProvider } from '@/components/ui/sidebar'
import AdminSidebar from './admin-sidebar'
import AdminHeader from './admin-header'
import { ScrollArea } from '@radix-ui/react-scroll-area'

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className='w-full'>
        <AdminHeader />
        <div className='p-4 min-h-full bg-gray-100'>
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}

export default AdminLayout
