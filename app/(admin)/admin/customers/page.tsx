"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Eye } from "lucide-react"
import Link from "next/link"
import PaginationControls from "@/components/layout/pagination-controls-admin"
import { useState } from "react"

const customers = [
    {
        id: 1,
        name: "Nguyễn Văn A",
        email: "nguyenvana@email.com",
        phone: "0912345678",
        orders: 15,
        spent: 3750000,
        joinDate: "15/09/2025",
        status: "active",
    },
    {
        id: 2,
        name: "Trần Thị B",
        email: "tranthib@email.com",
        phone: "0923456789",
        orders: 8,
        spent: 1980000,
        joinDate: "20/10/2025",
        status: "active",
    },
    {
        id: 3,
        name: "Lê Văn C",
        email: "levanc@email.com",
        phone: "0934567890",
        orders: 23,
        spent: 5640000,
        joinDate: "05/08/2025",
        status: "vip",
    },
    {
        id: 4,
        name: "Phạm Thị D",
        email: "phamthid@email.com",
        phone: "0945678901",
        orders: 3,
        spent: 450000,
        joinDate: "12/12/2025",
        status: "active",
    },
    {
        id: 5,
        name: "Hoàng Văn E",
        email: "hoangvane@email.com",
        phone: "0956789012",
        orders: 0,
        spent: 0,
        joinDate: "08/01/2026",
        status: "new",
    },
]

export default function CustomersPage() {
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const totalPages = Math.ceil(customers.length / itemsPerPage)

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price)
    }

    const getStatusBadge = (status: string) => {
        const styles = {
            vip: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
            active: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
            new: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
        }
        const labels = {
            vip: "VIP",
            active: "Hoạt động",
            new: "Mới",
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
                <h1 className="text-3xl font-bold mb-2">Quản lý khách hàng</h1>
                <p className="text-muted-foreground">Theo dõi và quản lý thông tin khách hàng</p>
            </div>

            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Tìm kiếm khách hàng..." className="pl-10" />
                        </div>
                        <Button variant="outline" className="bg-transparent">
                            Lọc
                        </Button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Khách hàng</th>
                                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Email</th>
                                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Số điện thoại</th>
                                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Đơn hàng</th>
                                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Tổng chi tiêu</th>
                                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Trạng thái</th>
                                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Ngày tham gia</th>
                                    <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.map((customer) => (
                                    <tr key={customer.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                                        <td className="py-3 px-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-orange-600/10 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                                                    {customer.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{customer.name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-2 text-sm">{customer.email}</td>
                                        <td className="py-3 px-2 text-sm">{customer.phone}</td>
                                        <td className="py-3 px-2 text-sm">{customer.orders}</td>
                                        <td className="py-3 px-2 font-medium">{formatPrice(customer.spent)}</td>
                                        <td className="py-3 px-2">{getStatusBadge(customer.status)}</td>
                                        <td className="py-3 px-2 text-sm text-muted-foreground">{customer.joinDate}</td>
                                        <td className="py-3 px-2 text-right">
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/admin/customers/${customer.id}`}>
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
            <PaginationControls totalPages={totalPages} currentPage={currentPage} itemsPerPage={itemsPerPage} setCurrentPage={setCurrentPage} setItemsPerPage={setItemsPerPage} totalItems={customers.length} />
        </div>
    )
}