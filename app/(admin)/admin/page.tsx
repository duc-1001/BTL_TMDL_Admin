"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, DollarSign, Users, TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const stats = [
  {
    title: "Tổng doanh thu",
    value: "125.5M",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/20",
  },
  {
    title: "Đơn hàng",
    value: "1,234",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingCart,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/20",
  },
  {
    title: "Sản phẩm",
    value: "542",
    change: "+4",
    trend: "up",
    icon: Package,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-900/20",
  },
  {
    title: "Khách hàng",
    value: "8,432",
    change: "-2.4%",
    trend: "down",
    icon: Users,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-100 dark:bg-orange-900/20",
  },
]

const recentOrders = [
  { id: "#DH001234", customer: "Nguyễn Văn A", amount: 250000, status: "completed", date: "10/01/2026" },
  { id: "#DH001233", customer: "Trần Thị B", amount: 180000, status: "processing", date: "10/01/2026" },
  { id: "#DH001232", customer: "Lê Văn C", amount: 320000, status: "pending", date: "09/01/2026" },
  { id: "#DH001231", customer: "Phạm Thị D", amount: 150000, status: "completed", date: "09/01/2026" },
  { id: "#DH001230", customer: "Hoàng Văn E", amount: 420000, status: "cancelled", date: "09/01/2026" },
]

const topProducts = [
  { name: "Bánh Snack Oishi", sold: 234, revenue: 5850000, image: "/vietnamese-oishi-beef-snack-package.jpg" },
  { name: "Kẹo Alpenliebe", sold: 198, revenue: 6930000, image: "/alpenliebe-caramel-candy-bag.jpg" },
  { name: "Hạt điều rang muối", sold: 145, revenue: 12325000, image: "/premium-roasted-cashew-nuts-package.jpg" },
  { name: "Snack Lay's", sold: 189, revenue: 5292000, image: "/lays-sour-cream-onion-chips.jpg" },
]

export default function AdminDashboard() {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
      processing: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
      pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
      cancelled: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
    }
    const labels = {
      completed: "Hoàn thành",
      processing: "Đang xử lý",
      pending: "Chờ xác nhận",
      cancelled: "Đã hủy",
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Tổng quan</h1>
        <p className="text-muted-foreground">Chào mừng trở lại! Đây là thống kê của cửa hàng bạn.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm font-medium ${stat.trend === "up" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                  >
                    <TrendIcon className="h-4 w-4" />
                    {stat.change}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Đơn hàng gần đây</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/orders">
                Xem tất cả
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Mã đơn</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Khách hàng</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Số tiền</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Trạng thái</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Ngày</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-2">
                        <Link href={`/admin/orders/${order.id}`} className="font-medium hover:text-primary">
                          {order.id}
                        </Link>
                      </td>
                      <td className="py-3 px-2">{order.customer}</td>
                      <td className="py-3 px-2 font-medium">{formatPrice(order.amount)}</td>
                      <td className="py-3 px-2">{getStatusBadge(order.status)}</td>
                      <td className="py-3 px-2 text-sm text-muted-foreground">{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Sản phẩm bán chạy</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/products">
                Xem tất cả
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm line-clamp-1">{product.name}</p>
                    <p className="text-xs text-muted-foreground">Đã bán: {product.sold}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm text-primary">{formatPrice(product.revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
