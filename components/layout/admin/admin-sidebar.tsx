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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"

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
  { name: "Thương hiệu", href: "/admin/brands", icon: Landmark },

  { name: "Đơn hàng", href: "/admin/orders", icon: ShoppingCart },
  { name: "Khách hàng", href: "/admin/customers", icon: Users },

  {
    name: "Marketing",
    children:
      [
        { name: "Hero / Banner", href: "/admin/marketing/hero" },
        { name: "Khuyến mãi", href: "/admin/marketing/promotions" },
        { name: "Email Marketing", href: "/admin/marketing/email" },
        { name: "Social khuyến mãi", href: "/admin/marketing/social" },
        { name: "Coupon", href: "/admin/marketing/coupons" },
      ]
    , icon: Megaphone
  },

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
                const hasChildren = !!item.children
                const isChildActive =
                  hasChildren && item.children.some((c) => pathname.startsWith(c.href))
                const isActive = pathname === item.href || isChildActive

                if (hasChildren) {
                  return (
                    <Collapsible
                      key={item.name}
                      defaultOpen={isChildActive}
                      className="group"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <button
                            className={cn(
                              "flex w-full items-center justify-between px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                              isActive
                                ? "bg-orange-600 text-primary-foreground"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground",
                            )}
                          >
                            <span className="flex items-center gap-3">
                              <Icon className="h-5 w-5" />
                              {item.name}
                            </span>
                            <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                          </button>
                        </CollapsibleTrigger>

                        <CollapsibleContent className="mt-1 ml-9 space-y-1">
                          {item.children.map((child) => {
                            const active = pathname === child.href
                            return (
                              <Link
                                key={child.name}
                                href={child.href}
                                className={cn(
                                  "block rounded-md px-3 py-1.5 text-sm transition-colors",
                                  active
                                    ? "bg-orange-500/20 text-orange-600 font-medium"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                )}
                              >
                                {child.name}
                              </Link>
                            )
                          })}
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  )
                }

                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.href!}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                          isActive
                            ? "bg-orange-600 text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        {item.name}
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