import React from 'react'
import { Footer } from './footer'
import { Header } from './header'
import { SidebarProvider } from '@/components/ui/sidebar'
import UserSidebar from './sidebar'

const UserLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <SidebarProvider className='w-full'>
            <div className='md:hidden block'>
                <UserSidebar />
            </div>
            <div className='w-full'>
                <Header />
                <div className='p-4 bg-gray-100'>
                    {children}
                </div>
                <Footer />
            </div>
        </SidebarProvider>
    )
}

export default UserLayout