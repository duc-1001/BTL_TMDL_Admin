'use client'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  Menu,
  X,
  LogOut,
  Tag,
  BarChart3,
  Megaphone,
  FolderTree,
  Slack,
  Landmark,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Tổng quan", href: "/admin", icon: LayoutDashboard },
  { name: "Sản phẩm", href: "/admin/products", icon: Package },
  { name: "Danh mục", href: "/admin/categories", icon: FolderTree },
  {name: "Thương hiệu", href: "/admin/brands", icon: Landmark },
  { name: "Đơn hàng", href: "/admin/orders", icon: ShoppingCart },
  { name: "Khách hàng", href: "/admin/customers", icon: Users },
  { name: "Khuyến mãi", href: "/admin/promotions", icon: Tag },
  { name: "Marketing", href: "/admin/marketing", icon: Megaphone },
  { name: "Báo cáo", href: "/admin/reports", icon: BarChart3 },
  { name: "Cài đặt", href: "/admin/settings", icon: Settings },
]
export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarHeader className="text-2xl font-bold border-b">
            <Link href="/admin" className="block px-4 py-3">
              Admin Panel
            </Link>
          </SidebarHeader>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <SidebarMenuItem key={item.name} className={cn()}>
                    <SidebarMenuButton asChild>
                      <Link href={item.href} className={cn(
                        "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-orange-600 text-primary-foreground hover:!bg-orange-600 hover:!text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}>
                        <Icon className="!h-5 !w-5" />
                        <span className="text-md">{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="mt-auto">
          <div className="p-4 border-t">
            <div className="flex items-center gap-3 mb-3 px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-orange-600/10 flex items-center justify-center font-semibold text-sm">
                AD
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-muted-foreground">admin@snackviet.vn</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full justify-start bg-transparent" asChild>
              <Link href="/">
                <LogOut className="h-4 w-4 mr-2" />
                Đăng xuất
              </Link>
            </Button>
          </div>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}