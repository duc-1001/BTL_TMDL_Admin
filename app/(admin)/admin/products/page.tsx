"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, MoreVertical, Pencil, Trash2, Eye } from "lucide-react"
import Link from "next/link"
import PaginationControls from "@/components/layout/pagination-controls"
import { useState } from "react"

const products = [
    {
        id: 1,
        name: "Bánh Snack Oishi Vị Bò Nướng",
        category: "Snack mặn",
        price: 25000,
        stock: 500,
        sold: 234,
        status: "active",
        image: "/vietnamese-oishi-beef-snack-package.jpg",
    },
    {
        id: 2,
        name: "Kẹo Alpenliebe Caramel",
        category: "Bánh kẹo",
        price: 35000,
        stock: 320,
        sold: 198,
        status: "active",
        image: "/alpenliebe-caramel-candy-bag.jpg",
    },
    {
        id: 3,
        name: "Hạt điều rang muối",
        category: "Hạt dinh dưỡng",
        price: 85000,
        stock: 150,
        sold: 145,
        status: "active",
        image: "/premium-roasted-cashew-nuts-package.jpg",
    },
    {
        id: 4,
        name: "Snack Lay's Kem Chua",
        category: "Snack mặn",
        price: 28000,
        stock: 0,
        sold: 189,
        status: "out_of_stock",
        image: "/lays-sour-cream-onion-chips.jpg",
    },
    {
        id: 5,
        name: "Kẹo dẻo Haribo",
        category: "Bánh kẹo",
        price: 45000,
        stock: 280,
        sold: 167,
        status: "active",
        image: "/haribo-tropical-gummy-bears.jpg",
    },
]

export default function ProductsPage() {
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    //
    const totalPages = Math.ceil(products.length / itemsPerPage)

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price)
    }

    const getStatusBadge = (status: string, stock: number) => {
        if (status === "out_of_stock" || stock === 0) {
            return <Badge variant="destructive">Hết hàng</Badge>
        }
        if (stock < 50) {
            return <Badge className="bg-yellow-500">Sắp hết</Badge>
        }
        return <Badge className="bg-green-500">Còn hàng</Badge>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Quản lý sản phẩm</h1>
                    <p className="text-muted-foreground">Quản lý danh sách sản phẩm của cửa hàng</p>
                </div>
                <Button asChild>
                    <Link href="/admin/products/new">
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm sản phẩm
                    </Link>
                </Button>
            </div>

            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Tìm kiếm sản phẩm..." className="pl-10" />
                        </div>
                        <Button variant="outline" className="bg-transparent">
                            Lọc
                        </Button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Sản phẩm</th>
                                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Danh mục</th>
                                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Giá</th>
                                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Tồn kho</th>
                                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Đã bán</th>
                                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Trạng thái</th>
                                    <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                                        <td className="py-3 px-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                                    <img
                                                        src={product.image || "/placeholder.svg"}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium line-clamp-1">{product.name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-2 text-sm">{product.category}</td>
                                        <td className="py-3 px-2 font-medium">{formatPrice(product.price)}</td>
                                        <td className="py-3 px-2 text-sm">{product.stock}</td>
                                        <td className="py-3 px-2 text-sm">{product.sold}</td>
                                        <td className="py-3 px-2">{getStatusBadge(product.status, product.stock)}</td>
                                        <td className="py-3 px-2 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        Xem chi tiết
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Pencil className="h-4 w-4 mr-2" />
                                                        Chỉnh sửa
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive">
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Xóa
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </CardContent>
            </Card>
            <PaginationControls totalPages={totalPages} currentPage={currentPage} itemsPerPage={itemsPerPage} setCurrentPage={setCurrentPage} setItemsPerPage={setItemsPerPage} totalItems={products.length} />
        </div>
    )
}
