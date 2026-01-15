"use client"

import { useState } from "react"
import { Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    storeName: "Snack Việt",
    storeEmail: "support@snackviet.com",
    storePhone: "1900-1234",
    storeAddress: "123 Đường Nguyễn Huệ, Quận 1, TP.HCM",
    storeDescription: "Cửa hàng đồ ăn vặt chất lượng cao",
    currency: "VND",
    freeShippingThreshold: "200000",
    shippingFee: "30000",
    enableNotifications: true,
    enableEmailMarketing: true,
    maintenanceMode: false,
  })

  const updateSetting = (key: string, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    console.log("[v0] Saving settings:", settings)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Cài đặt hệ thống</h1>
          <p className="text-muted-foreground">Quản lý cấu hình và thiết lập cho cửa hàng</p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">Cài đặt chung</TabsTrigger>
            <TabsTrigger value="shipping">Vận chuyển</TabsTrigger>
            <TabsTrigger value="notifications">Thông báo</TabsTrigger>
            <TabsTrigger value="advanced">Nâng cao</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cửa hàng</CardTitle>
                <CardDescription>Cập nhật thông tin cơ bản về cửa hàng của bạn</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="storeName">Tên cửa hàng</Label>
                    <Input
                      id="storeName"
                      value={settings.storeName}
                      onChange={(e) => updateSetting("storeName", e.target.value)}
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="storeEmail">Email</Label>
                      <Input
                        id="storeEmail"
                        type="email"
                        value={settings.storeEmail}
                        onChange={(e) => updateSetting("storeEmail", e.target.value)}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="storePhone">Số điện thoại</Label>
                      <Input
                        id="storePhone"
                        value={settings.storePhone}
                        onChange={(e) => updateSetting("storePhone", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="storeAddress">Địa chỉ</Label>
                    <Input
                      id="storeAddress"
                      value={settings.storeAddress}
                      onChange={(e) => updateSetting("storeAddress", e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="storeDescription">Mô tả</Label>
                    <Textarea
                      id="storeDescription"
                      rows={3}
                      value={settings.storeDescription}
                      onChange={(e) => updateSetting("storeDescription", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shipping">
            <Card>
              <CardHeader>
                <CardTitle>Cài đặt vận chuyển</CardTitle>
                <CardDescription>Cấu hình phí vận chuyển và điều kiện miễn phí</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="shippingFee">Phí vận chuyển (VND)</Label>
                    <Input
                      id="shippingFee"
                      type="number"
                      value={settings.shippingFee}
                      onChange={(e) => updateSetting("shippingFee", e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">Phí vận chuyển mặc định cho mỗi đơn hàng</p>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="freeShippingThreshold">Giá trị đơn hàng miễn phí vận chuyển (VND)</Label>
                    <Input
                      id="freeShippingThreshold"
                      type="number"
                      value={settings.freeShippingThreshold}
                      onChange={(e) => updateSetting("freeShippingThreshold", e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Đơn hàng từ giá trị này trở lên sẽ được miễn phí vận chuyển
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Thông báo</CardTitle>
                <CardDescription>Quản lý cài đặt thông báo và email</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Thông báo đơn hàng</Label>
                    <p className="text-sm text-muted-foreground">Nhận thông báo khi có đơn hàng mới</p>
                  </div>
                  <Switch
                    checked={settings.enableNotifications}
                    onCheckedChange={(checked) => updateSetting("enableNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Marketing</Label>
                    <p className="text-sm text-muted-foreground">Gửi email khuyến mãi và cập nhật cho khách hàng</p>
                  </div>
                  <Switch
                    checked={settings.enableEmailMarketing}
                    onCheckedChange={(checked) => updateSetting("enableEmailMarketing", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced">
            <Card>
              <CardHeader>
                <CardTitle>Cài đặt nâng cao</CardTitle>
                <CardDescription>Các tùy chọn cấu hình nâng cao cho hệ thống</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Chế độ bảo trì</Label>
                    <p className="text-sm text-muted-foreground">Tạm khóa website để bảo trì hoặc cập nhật</p>
                  </div>
                  <Switch
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => updateSetting("maintenanceMode", checked)}
                  />
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    Cảnh báo: Khi bật chế độ bảo trì, khách hàng sẽ không thể truy cập vào website
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-6">
          <Button onClick={handleSave} size="lg">
            <Save className="h-4 w-4 mr-2" />
            Lưu thay đổi
          </Button>
        </div>
      </div>
    </div>
  )
}
