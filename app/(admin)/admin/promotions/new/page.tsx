"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Percent, DollarSign } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function NewPromotionPage() {
  const [discountType, setDiscountType] = useState("percentage")

  return (
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/promotions">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Tạo khuyến mãi mới</h1>
            <p className="text-muted-foreground">Thiết lập chương trình khuyến mãi cho khách hàng</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cơ bản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên chương trình</Label>
                  <Input id="name" placeholder="VD: Giảm giá 30% cho đơn hàng đầu tiên" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea id="description" rows={3} placeholder="Mô tả chi tiết về chương trình khuyến mãi..." />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code">Mã giảm giá</Label>
                  <Input id="code" placeholder="VD: WELCOME30" className="font-mono uppercase" />
                  <p className="text-xs text-muted-foreground">Khách hàng sẽ nhập mã này khi thanh toán</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Giá trị giảm giá</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Loại giảm giá</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setDiscountType("percentage")}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        discountType === "percentage"
                          ? "border-primary bg-orange-600/5"
                          : "border-muted hover:border-muted-foreground/25"
                      }`}
                    >
                      <Percent className="h-6 w-6 mx-auto mb-2" />
                      <p className="font-medium">Phần trăm</p>
                    </button>
                    <button
                      onClick={() => setDiscountType("fixed")}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        discountType === "fixed"
                          ? "border-primary bg-orange-600/5"
                          : "border-muted hover:border-muted-foreground/25"
                      }`}
                    >
                      <DollarSign className="h-6 w-6 mx-auto mb-2" />
                      <p className="font-medium">Cố định</p>
                    </button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="value">{discountType === "percentage" ? "Phần trăm giảm" : "Số tiền giảm"}</Label>
                    <Input id="value" type="number" placeholder={discountType === "percentage" ? "30" : "50000"} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="minOrder">Giá trị đơn tối thiểu</Label>
                    <Input id="minOrder" type="number" placeholder="100000" />
                  </div>
                </div>

                {discountType === "percentage" && (
                  <div className="space-y-2">
                    <Label htmlFor="maxDiscount">Giảm tối đa</Label>
                    <Input id="maxDiscount" type="number" placeholder="100000" />
                    <p className="text-xs text-muted-foreground">Số tiền giảm tối đa cho đơn hàng</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Điều kiện áp dụng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="applyTo">Áp dụng cho</Label>
                  <Select defaultValue="all">
                    <SelectTrigger id="applyTo">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả sản phẩm</SelectItem>
                      <SelectItem value="category">Danh mục cụ thể</SelectItem>
                      <SelectItem value="product">Sản phẩm cụ thể</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customer">Khách hàng</Label>
                  <Select defaultValue="all">
                    <SelectTrigger id="customer">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả khách hàng</SelectItem>
                      <SelectItem value="new">Khách hàng mới</SelectItem>
                      <SelectItem value="vip">Khách hàng VIP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Ngày bắt đầu</Label>
                    <Input id="startDate" type="date" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">Ngày kết thúc</Label>
                    <Input id="endDate" type="date" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cài đặt</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="usageLimit">Giới hạn sử dụng</Label>
                  <Input id="usageLimit" type="number" placeholder="Không giới hạn" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="perCustomer">Giới hạn mỗi khách</Label>
                  <Input id="perCustomer" type="number" placeholder="1" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="active">Kích hoạt ngay</Label>
                    <p className="text-xs text-muted-foreground">Áp dụng khuyến mãi</p>
                  </div>
                  <Switch id="active" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="combinable">Kết hợp khuyến mãi</Label>
                    <p className="text-xs text-muted-foreground">Dùng chung với KM khác</p>
                  </div>
                  <Switch id="combinable" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-orange-600/5">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">Xem trước mã</h4>
                <div className="bg-background rounded-lg p-4 border-2 border-dashed">
                  <p className="text-xs text-muted-foreground mb-1">Mã giảm giá</p>
                  <p className="font-mono font-bold text-lg">WELCOME30</p>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3">
              <Button className="w-full">Tạo khuyến mãi</Button>
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/admin/promotions">Hủy</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
  )
}
