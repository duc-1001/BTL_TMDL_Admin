"use client"

import { useEffect, useState } from "react"
import { User, Package, Heart, MapPin, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
export default function AccountPage() {
  const [user, setUser] = useState({
    name: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    phone: "0912345678",
    avatar: "",
  })

  const [addresses] = useState([
    {
      id: 1,
      name: "Nhà riêng",
      fullName: "Nguyễn Văn A",
      phone: "0912345678",
      address: "123 Đường ABC, Phường XYZ, Quận 1, TP.HCM",
      isDefault: true,
    },
    {
      id: 2,
      name: "Văn phòng",
      fullName: "Nguyễn Văn A",
      phone: "0912345678",
      address: "456 Đường DEF, Phường MNO, Quận 3, TP.HCM",
      isDefault: false,
    },
  ])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <Card className="lg:col-span-1 h-fit">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center mb-6">
                <Avatar className="h-20 w-20 mb-3">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-orange-600 text-primary-foreground text-2xl">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>

              <Separator className="my-4" />

              <nav className="space-y-1">
                <Link
                  href="/account"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg bg-orange-600/10 text-primary font-medium"
                >
                  <User className="h-4 w-4" />
                  Thông tin cá nhân
                </Link>
                <Link
                  href="/orders"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <Package className="h-4 w-4" />
                  Đơn hàng của tôi
                </Link>
                <Link
                  href="/wishlist"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <Heart className="h-4 w-4" />
                  Sản phẩm yêu thích
                </Link>
                <Link
                  href="/account"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <MapPin className="h-4 w-4" />
                  Địa chỉ
                </Link>
                <Link
                  href="/account"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  Cài đặt
                </Link>
              </nav>

              <Separator className="my-4" />

              <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
                <LogOut className="h-4 w-4 mr-2" />
                Đăng xuất
              </Button>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-flex">
                <TabsTrigger value="profile">Thông tin cá nhân</TabsTrigger>
                <TabsTrigger value="addresses">Địa chỉ giao hàng</TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Thông tin cá nhân</CardTitle>
                    <CardDescription>Cập nhật thông tin tài khoản của bạn</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Họ và tên</Label>
                        <Input
                          id="name"
                          value={user.name}
                          onChange={(e) => setUser({ ...user, name: e.target.value })}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={user.email}
                          onChange={(e) => setUser({ ...user, email: e.target.value })}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="phone">Số điện thoại</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={user.phone}
                          onChange={(e) => setUser({ ...user, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold mb-3">Đổi mật khẩu</h4>
                      <div className="grid gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
                          <Input id="current-password" type="password" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="new-password">Mật khẩu mới</Label>
                          <Input id="new-password" type="password" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
                          <Input id="confirm-password" type="password" />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3">
                      <Button variant="outline">Hủy</Button>
                      <Button>Lưu thay đổi</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="addresses">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Địa chỉ giao hàng</CardTitle>
                        <CardDescription>Quản lý địa chỉ nhận hàng của bạn</CardDescription>
                      </div>
                      <Button>Thêm địa chỉ mới</Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {addresses.map((address) => (
                      <Card key={address.id} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold">{address.name}</h4>
                                {address.isDefault && (
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-orange-600/10 text-primary font-medium">
                                    Mặc định
                                  </span>
                                )}
                              </div>
                              <p className="text-sm">
                                {address.fullName} | {address.phone}
                              </p>
                              <p className="text-sm text-muted-foreground">{address.address}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                Sửa
                              </Button>
                              {!address.isDefault && (
                                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                                  Xóa
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
