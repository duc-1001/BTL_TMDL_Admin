"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, DollarSign, Package, ShoppingCart, Users, Download, Calendar } from "lucide-react"

export default function ReportsPage() {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const stats = [
    {
      title: "Doanh thu",
      value: formatPrice(125450000),
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Đơn hàng",
      value: "1,234",
      change: "+8.2%",
      trend: "up",
      icon: ShoppingCart,
    },
    {
      title: "Sản phẩm bán ra",
      value: "3,456",
      change: "+15.3%",
      trend: "up",
      icon: Package,
    },
    {
      title: "Khách hàng mới",
      value: "234",
      change: "-2.4%",
      trend: "down",
      icon: Users,
    },
  ]

  const topProducts = [
    { name: "Bánh Snack Oishi Vị Bò Nướng", sold: 456, revenue: 11400000 },
    { name: "Kẹo Alpenliebe Caramel", sold: 398, revenue: 13930000 },
    { name: "Hạt điều rang muối", sold: 287, revenue: 24395000 },
    { name: "Snack Lay's Kem Chua", sold: 345, revenue: 9660000 },
    { name: "Kẹo dẻo Haribo", sold: 278, revenue: 12510000 },
  ]

  const revenueByCategory = [
    { name: "Snack mặn", revenue: 45600000, percent: 36 },
    { name: "Bánh kẹo", revenue: 38200000, percent: 30 },
    { name: "Hạt dinh dưỡng", revenue: 28400000, percent: 23 },
    { name: "Đồ uống", revenue: 13250000, percent: 11 },
  ]

  const recentOrders = [
    { id: "#ORD-2345", customer: "Nguyễn Văn A", date: "14/01/2026", amount: 285000, status: "completed" },
    { id: "#ORD-2344", customer: "Trần Thị B", date: "14/01/2026", amount: 450000, status: "processing" },
    { id: "#ORD-2343", customer: "Lê Văn C", date: "13/01/2026", amount: 175000, status: "completed" },
    { id: "#ORD-2342", customer: "Phạm Thị D", date: "13/01/2026", amount: 620000, status: "completed" },
    { id: "#ORD-2341", customer: "Hoàng Văn E", date: "13/01/2026", amount: 340000, status: "cancelled" },
  ]

  const getStatusColor = (status: string) => {
    const colors = {
      completed: "text-green-600 bg-green-50",
      processing: "text-blue-600 bg-blue-50",
      cancelled: "text-red-600 bg-red-50",
    }
    return colors[status as keyof typeof colors] || "text-gray-600 bg-gray-50"
  }

  const getStatusText = (status: string) => {
    const texts = {
      completed: "Hoàn thành",
      processing: "Đang xử lý",
      cancelled: "Đã hủy",
    }
    return texts[status as keyof typeof texts] || status
  }

  return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Báo cáo & Thống kê</h1>
            <p className="text-muted-foreground">Tổng quan hiệu suất kinh doanh của cửa hàng</p>
          </div>
          <div className="flex gap-2">
            <Select defaultValue="30days">
              <SelectTrigger className="w-[180px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">7 ngày qua</SelectItem>
                <SelectItem value="30days">30 ngày qua</SelectItem>
                <SelectItem value="90days">90 ngày qua</SelectItem>
                <SelectItem value="year">Năm nay</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Xuất báo cáo
            </Button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-lg bg-orange-600/10">
                    <stat.icon className="h-5 w-5 text-orange-500" />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}
                  >
                    {stat.trend === "up" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    {stat.change}
                  </div>
                </div>
                <p className="text-2xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="products">Sản phẩm</TabsTrigger>
            <TabsTrigger value="customers">Khách hàng</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Doanh thu theo danh mục</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {revenueByCategory.map((category) => (
                      <div key={category.name} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{category.name}</span>
                          <span className="text-muted-foreground">{formatPrice(category.revenue)}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-orange-600 rounded-full transition-all"
                            style={{ width: `${category.percent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Đơn hàng gần đây</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between pb-4 border-b last:border-0 last:pb-0"
                      >
                        <div className="space-y-1">
                          <p className="font-medium">{order.id}</p>
                          <p className="text-sm text-muted-foreground">{order.customer}</p>
                          <p className="text-xs text-muted-foreground">{order.date}</p>
                        </div>
                        <div className="text-right space-y-2">
                          <p className="font-semibold">{formatPrice(order.amount)}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Top 5 sản phẩm bán chạy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={product.name} className="flex items-center gap-4 pb-4 border-b last:border-0 last:pb-0">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-600/10 text-orange-500 font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium mb-1">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.sold} sản phẩm đã bán</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">{formatPrice(product.revenue)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Khách hàng theo khu vực</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "TP. Hồ Chí Minh", count: 456, percent: 38 },
                      { name: "Hà Nội", count: 342, percent: 29 },
                      { name: "Đà Nẵng", count: 189, percent: 16 },
                      { name: "Cần Thơ", count: 134, percent: 11 },
                      { name: "Khác", count: 78, percent: 6 },
                    ].map((region) => (
                      <div key={region.name} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{region.name}</span>
                          <span className="text-muted-foreground">{region.count} khách hàng</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-orange-600 rounded-full transition-all"
                            style={{ width: `${region.percent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top khách hàng VIP</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Nguyễn Văn A", orders: 23, spent: 4560000 },
                      { name: "Trần Thị B", orders: 19, spent: 3890000 },
                      { name: "Lê Văn C", orders: 17, spent: 3450000 },
                      { name: "Phạm Thị D", orders: 15, spent: 3120000 },
                      { name: "Hoàng Văn E", orders: 14, spent: 2890000 },
                    ].map((customer, index) => (
                      <div
                        key={customer.name}
                        className="flex items-center gap-4 pb-4 border-b last:border-0 last:pb-0"
                      >
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-600/10 text-orange-500 font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium mb-1">{customer.name}</p>
                          <p className="text-sm text-muted-foreground">{customer.orders} đơn hàng</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatPrice(customer.spent)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
  )
}
