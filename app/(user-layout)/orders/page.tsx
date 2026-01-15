"use client"

import { useState } from "react"
import { Package, Search, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"

const orders = [
  {
    id: "ORD-2024-001",
    date: "2024-01-15",
    status: "delivered",
    statusText: "Đã giao hàng",
    total: 450000,
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
  },
  {
    id: "ORD-2024-002",
    date: "2024-01-20",
    status: "shipping",
    statusText: "Đang giao hàng",
    total: 320000,
    items: [
      {
        id: 3,
        name: "Chocolate sữa hạt dẻ",
        quantity: 1,
        price: 75000,
        image: "/hazelnut-chocolate.png",
      },
    ],
  },
  {
    id: "ORD-2024-003",
    date: "2024-01-22",
    status: "processing",
    statusText: "Đang xử lý",
    total: 280000,
    items: [
      {
        id: 4,
        name: "Snack Hàn Quốc",
        quantity: 2,
        price: 55000,
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
  },
  {
    id: "ORD-2024-004",
    date: "2024-01-10",
    status: "cancelled",
    statusText: "Đã hủy",
    total: 150000,
    items: [
      {
        id: 5,
        name: "Bánh quy bơ",
        quantity: 1,
        price: 45000,
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
  },
]

const statusColors = {
  processing: "bg-blue-100 text-blue-700",
  shipping: "bg-yellow-100 text-yellow-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
}

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredOrders = orders.filter((order) => {
    const matchesTab = activeTab === "all" || order.status === activeTab
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Đơn hàng của tôi</h1>
          <p className="text-muted-foreground">Theo dõi và quản lý đơn hàng của bạn</p>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm đơn hàng theo mã..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">Tất cả</TabsTrigger>
                <TabsTrigger value="processing">Đang xử lý</TabsTrigger>
                <TabsTrigger value="shipping">Đang giao</TabsTrigger>
                <TabsTrigger value="delivered">Đã giao</TabsTrigger>
                <TabsTrigger value="cancelled">Đã hủy</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Không tìm thấy đơn hàng</h3>
                <p className="text-muted-foreground mb-4">Bạn chưa có đơn hàng nào trong mục này</p>
                <Button asChild>
                  <Link href="/products">Khám phá sản phẩm</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-lg">{order.id}</h3>
                        <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                          {order.statusText}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Đặt ngày: {new Date(order.date).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Tổng tiền</p>
                        <p className="text-lg font-bold text-primary">{order.total.toLocaleString("vi-VN")}đ</p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/orders/${order.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          Chi tiết
                        </Link>
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-muted shrink-0">
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">Số lượng: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">{(item.price * item.quantity).toLocaleString("vi-VN")}đ</p>
                      </div>
                    ))}
                  </div>

                  {order.status === "delivered" && (
                    <div className="flex gap-3 mt-4 pt-4 border-t">
                      <Button variant="outline" className="flex-1 bg-transparent">
                        Mua lại
                      </Button>
                      <Button variant="outline" className="flex-1 bg-transparent">
                        Đánh giá
                      </Button>
                    </div>
                  )}

                  {order.status === "shipping" && (
                    <div className="mt-4 pt-4 border-t">
                      <Button className="w-full">Theo dõi đơn hàng</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
