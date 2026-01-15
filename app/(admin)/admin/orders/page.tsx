"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Eye } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import PaginationControls from "@/components/layout/pagination-controls"

const orders = [
    {
        id: "DH001234",
        customer: "Nguyễn Văn A",
        phone: "0912345678",
        amount: 250000,
        status: "completed",
        date: "10/01/2026",
        items: 3,
    },
    {
        id: "DH001233",
        customer: "Trần Thị B",
        phone: "0923456789",
        amount: 180000,
        status: "processing",
        date: "10/01/2026",
        items: 2,
    },
    {
        id: "DH001232",
        customer: "Lê Văn C",
        phone: "0934567890",
        amount: 320000,
        status: "pending",
        date: "09/01/2026",
        items: 5,
    },
    {
        id: "DH001231",
        customer: "Phạm Thị D",
        phone: "0945678901",
        amount: 150000,
        status: "completed",
        date: "09/01/2026",
        items: 2,
    },
    {
        id: "DH001230",
        customer: "Hoàng Văn E",
        phone: "0956789012",
        amount: 420000,
        status: "cancelled",
        date: "09/01/2026",
        items: 4,
    },
    {
        id: "DH001229",
        customer: "Võ Thị F",
        phone: "0967890123",
        amount: 280000,
        status: "shipping",
        date: "08/01/2026",
        items: 3,
    },
]

export default function OrdersPage() {
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const totalPages = Math.ceil(orders.length / itemsPerPage)
    
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
            shipping: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
            cancelled: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
        }
        const labels = {
            completed: "Hoàn thành",
            processing: "Đang xử lý",
            pending: "Chờ xác nhận",
            shipping: "Đang giao",
            cancelled: "Đã hủy",
        }
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
                {labels[status as keyof typeof labels]}
            </span>
        )
    }

    const filterByStatus = (status: string) => {
        if (status === "all") return orders
        return orders.filter((order) => order.status === status)
    }

    const OrderTable = ({ orders }: { orders:any}) => (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b">
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Mã đơn</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Khách hàng</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Số điện thoại</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Số tiền</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Sản phẩm</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Trạng thái</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Ngày</th>
                        <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order:any) => (
                        <tr key={order.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                            <td className="py-3 px-2">
                                <Link href={`/admin/orders/${order.id}`} className="font-medium hover:text-primary">
                                    {order.id}
                                </Link>
                            </td>
                            <td className="py-3 px-2">{order.customer}</td>
                            <td className="py-3 px-2 text-sm text-muted-foreground">{order.phone}</td>
                            <td className="py-3 px-2 font-medium">{formatPrice(order.amount)}</td>
                            <td className="py-3 px-2 text-sm">{order.items} sản phẩm</td>
                            <td className="py-3 px-2">{getStatusBadge(order.status)}</td>
                            <td className="py-3 px-2 text-sm text-muted-foreground">{order.date}</td>
                            <td className="py-3 px-2 text-right">
                                <Button variant="ghost" size="icon" asChild>
                                    <Link href={`/admin/orders/${order.id}`}>
                                        <Eye className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold mb-2">Quản lý đơn hàng</h1>
                <p className="text-muted-foreground">Theo dõi và xử lý đơn hàng của khách hàng</p>
            </div>

            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Tìm kiếm đơn hàng..." className="pl-10" />
                        </div>
                        <Button variant="outline" className="bg-transparent">
                            Xuất Excel
                        </Button>
                    </div>

                    <Tabs defaultValue="all">
                        <TabsList className="mb-6">
                            <TabsTrigger value="all">
                                Tất cả{" "}
                                <Badge className="ml-2" variant="secondary">
                                    {orders.length}
                                </Badge>
                            </TabsTrigger>
                            <TabsTrigger value="pending">
                                Chờ xác nhận{" "}
                                <Badge className="ml-2" variant="secondary">
                                    {filterByStatus("pending").length}
                                </Badge>
                            </TabsTrigger>
                            <TabsTrigger value="processing">
                                Đang xử lý{" "}
                                <Badge className="ml-2" variant="secondary">
                                    {filterByStatus("processing").length}
                                </Badge>
                            </TabsTrigger>
                            <TabsTrigger value="shipping">
                                Đang giao{" "}
                                <Badge className="ml-2" variant="secondary">
                                    {filterByStatus("shipping").length}
                                </Badge>
                            </TabsTrigger>
                            <TabsTrigger value="completed">
                                Hoàn thành{" "}
                                <Badge className="ml-2" variant="secondary">
                                    {filterByStatus("completed").length}
                                </Badge>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="all">
                            <OrderTable orders={orders} />
                        </TabsContent>
                        <TabsContent value="pending">
                            <OrderTable orders={filterByStatus("pending")} />
                        </TabsContent>
                        <TabsContent value="processing">
                            <OrderTable orders={filterByStatus("processing")} />
                        </TabsContent>
                        <TabsContent value="shipping">
                            <OrderTable orders={filterByStatus("shipping")} />
                        </TabsContent>
                        <TabsContent value="completed">
                            <OrderTable orders={filterByStatus("completed")} />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
            <PaginationControls totalPages={totalPages} currentPage={currentPage} itemsPerPage={itemsPerPage} setCurrentPage={setCurrentPage} setItemsPerPage={setItemsPerPage} totalItems={orders.length} />
        </div>
    )
}
