import React from 'react'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import AdminSidebar from './admin-sidebar'
import AdminHeader from './admin-header'

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <AdminHeader />
        <div className='p-4 min-h-full bg-gray-100'>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default AdminLayout
