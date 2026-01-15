"use client"

import { use } from "react"
import { ArrowLeft, Package, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"

const orderDetails = {
  id: "ORD-2024-001",
  date: "2024-01-15",
  status: "delivered",
  statusText: "Đã giao hàng",
  timeline: [
    { status: "Đặt hàng thành công", date: "15/01/2024 10:30", completed: true },
    { status: "Đã xác nhận", date: "15/01/2024 11:00", completed: true },
    { status: "Đang giao hàng", date: "16/01/2024 09:15", completed: true },
    { status: "Đã giao hàng", date: "16/01/2024 14:20", completed: true },
  ],
  items: [
    {
      id: 1,
      name: "Snack khoai tây vị BBQ",
      quantity: 2,
      price: 45000,
      image: "/bbq-chips.jpg",
    },
    {
      id: 2,
      name: "Kẹo dẻo trái cây",
      quantity: 3,
      price: 35000,
      image: "/fruit-gummy-candy.jpg",
    },
  ],
  shipping: {
    name: "Nguyễn Văn A",
    phone: "0912345678",
    address: "123 Đường ABC, Phường XYZ, Quận 1, TP.HCM",
  },
  payment: {
    method: "COD",
    methodText: "Thanh toán khi nhận hàng",
  },
  summary: {
    subtotal: 195000,
    shipping: 30000,
    discount: 0,
    total: 225000,
  },
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/orders">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại danh sách đơn hàng
          </Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Đơn hàng {orderDetails.id}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Đặt ngày {new Date(orderDetails.date).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-700">{orderDetails.statusText}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {orderDetails.timeline.map((step, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`rounded-full p-2 ${step.completed ? "bg-orange-600 text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                        >
                          {step.completed ? <CheckCircle className="h-5 w-5" /> : <Package className="h-5 w-5" />}
                        </div>
                        {index < orderDetails.timeline.length - 1 && (
                          <div className={`w-0.5 h-12 ${step.completed ? "bg-orange-600" : "bg-muted"}`} />
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <p className={`font-medium ${step.completed ? "text-foreground" : "text-muted-foreground"}`}>
                          {step.status}
                        </p>
                        <p className="text-sm text-muted-foreground">{step.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Sản phẩm đã đặt</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderDetails.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-muted shrink-0">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium mb-1">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.price.toLocaleString("vi-VN")}đ x {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-lg">{(item.price * item.quantity).toLocaleString("vi-VN")}đ</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Shipping Info */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin giao hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Người nhận</p>
                  <p className="font-medium">{orderDetails.shipping.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Số điện thoại</p>
                  <p className="font-medium">{orderDetails.shipping.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Địa chỉ</p>
                  <p className="font-medium">{orderDetails.shipping.address}</p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Info */}
            <Card>
              <CardHeader>
                <CardTitle>Phương thức thanh toán</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{orderDetails.payment.methodText}</p>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Tổng quan đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tạm tính</span>
                  <span>{orderDetails.summary.subtotal.toLocaleString("vi-VN")}đ</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Phí vận chuyển</span>
                  <span>{orderDetails.summary.shipping.toLocaleString("vi-VN")}đ</span>
                </div>
                {orderDetails.summary.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Giảm giá</span>
                    <span>-{orderDetails.summary.discount.toLocaleString("vi-VN")}đ</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Tổng cộng</span>
                  <span className="text-primary">{orderDetails.summary.total.toLocaleString("vi-VN")}đ</span>
                </div>
              </CardContent>
            </Card>

            <Button className="w-full">Mua lại</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
