'use client'
import { Switch } from "@/components/ui/switch"
import { SelectItem } from "@/components/ui/select"
import { SelectContent } from "@/components/ui/select"
import { SelectValue } from "@/components/ui/select"
import { SelectTrigger } from "@/components/ui/select"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, TrendingUp, ShoppingCart, Eye, DollarSign, AlertCircle } from "lucide-react"
import Link from "next/link"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { useQuery } from "@tanstack/react-query"
import { getBatchProductStatus, getProductBasicInfo } from "@/services/product.service"
import { formatPrice } from "@/lib/utils"

// Mock data for sales metrics
const salesData = [
    { date: "1/1", sales: 45000, orders: 12, views: 324, conversion: 3.7 },
    { date: "1/2", sales: 52000, orders: 14, views: 387, conversion: 3.6 },
    { date: "1/3", sales: 48000, orders: 13, views: 356, conversion: 3.7 },
    { date: "1/4", sales: 61000, orders: 16, views: 432, conversion: 3.7 },
    { date: "1/5", sales: 55000, orders: 15, views: 401, conversion: 3.7 },
    { date: "1/6", sales: 67000, orders: 18, views: 478, conversion: 3.8 },
    { date: "1/7", sales: 72000, orders: 19, views: 521, conversion: 3.6 },
]

const topVariants = [
    { name: "Size 100g", sold: 245, revenue: 6125000 },
    { name: "Size 200g", sold: 189, revenue: 5670000 },
    { name: "Size 500g", sold: 87, revenue: 3480000 },
]
interface ProductDetailPageProps {
    id: string
}

export default function ProductDetailPage({ id }: ProductDetailPageProps) {
    const {
        data: productBasicInfo
    } = useQuery({
        queryKey: ['admin-product-basic-info', id],
        queryFn: () => getProductBasicInfo(id),
    })
    const {
        data: batchProductStatus
    } = useQuery({
        queryKey: ['admin-batch-product-status', id],
        queryFn: () => getBatchProductStatus(id),
    })
    return (
        <div>
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/products">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">{productBasicInfo?.name}</h1>
                        <p className="text-muted-foreground">Thống kê doanh số bán hàng {productBasicInfo?.sku && "-" + productBasicInfo.sku}</p>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Doanh thu tháng này</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">1,854,000 ₫</div>
                            <p className="text-xs text-muted-foreground">+12% so với tháng trước</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Số đơn hàng</CardTitle>
                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">521</div>
                            <p className="text-xs text-muted-foreground">+8% so với tháng trước</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Lượt xem</CardTitle>
                            <Eye className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">12,847</div>
                            <p className="text-xs text-muted-foreground">+15% so với tháng trước</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Tỉ lệ chuyển đổi</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">4.05%</div>
                            <p className="text-xs text-muted-foreground">+0.15% so với tháng trước</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Stock Alert */}
                <Card className="border-yellow-200 bg-yellow-50">
                    <CardContent className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-yellow-900">Cảnh báo tồn kho</h3>
                            <p className="text-sm text-yellow-800">Tồn kho hiện tại là 152 sản phẩm. Cân nhắc tạo đơn hàng mới nếu bán chạy tiếp tục.</p>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Revenue Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Doanh thu hàng ngày</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={salesData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip formatter={(value) => `${value ? value.toLocaleString() : ''} ₫`} />
                                        <Legend />
                                        <Line type="monotone" dataKey="sales" stroke="green" name="Doanh thu" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                        {/* Orders & Views */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Đơn hàng & Lượt xem</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={salesData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis yAxisId="left" />
                                        <YAxis yAxisId="right" orientation="right" />
                                        <Tooltip />
                                        <Legend />
                                        <Bar yAxisId="left" dataKey="orders" fill="#4ade80" name="Đơn hàng" />
                                        <Bar yAxisId="right" dataKey="views" fill="#818cf8" name="Lượt xem" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Hiệu suất</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-muted-foreground">Tỉ lệ tìm kiếm</p>
                                        <p className="font-medium">8.4%</p>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div className="h-full bg-primary" style={{ width: "84%" }} />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-muted-foreground">Tỉ lệ giỏ hàng</p>
                                        <p className="font-medium">6.2%</p>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500" style={{ width: "62%" }} />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-muted-foreground">Tỉ lệ yêu thích</p>
                                        <p className="font-medium">12.1%</p>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div className="h-full bg-red-500" style={{ width: "121%" }} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        {/* Product Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Thông tin sản phẩm</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">
                                <div>
                                    <p className="text-muted-foreground">SKU</p>
                                    <p className="font-medium">{productBasicInfo?.sku}</p>
                                </div>
                                <div className="border-t pt-4">
                                    <p className="text-muted-foreground">Danh mục</p>
                                    <p className="font-medium">{productBasicInfo?.category.name}</p>
                                </div>
                                <div className="border-t pt-4">
                                    <p className="text-muted-foreground">Thương hiệu</p>
                                    <p className="font-medium">{productBasicInfo?.brand.name}</p>
                                </div>
                                <div className="border-t pt-4">
                                    <p className="text-muted-foreground">Giá bán hiện tại</p>
                                    <p className="font-medium">{formatPrice(productBasicInfo?.price || 0)}</p>
                                </div>
                                <div className="border-t pt-4">
                                    <p className="text-muted-foreground">Tồn kho</p>
                                    <p className="font-medium text-yellow-600">{productBasicInfo?.stock} sản phẩm</p>
                                </div>
                                <div className="border-t pt-4 flex items-center justify-between">
                                    <p className="text-muted-foreground">Trạng thái</p>
                                    {
                                        productBasicInfo?.isActive ? (
                                            <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                                                Hoạt động
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full">
                                                Ngưng hoạt động
                                            </span>
                                        )
                                    }
                                </div>
                            </CardContent>
                        </Card>
                        {/* Batch Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Lô hàng & tồn kho</CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-4 text-sm">
                                <div className="flex items-center justify-between">
                                    <p className="text-muted-foreground">Tổng số lô</p>
                                    <p className="font-medium">{batchProductStatus?.totalBatches}</p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <p className="text-muted-foreground">Lô còn hàng</p>
                                    <p className="font-medium text-green-600">{batchProductStatus?.activeBatches}</p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <p className="text-muted-foreground">Sắp hết hạn (≤ 7 ngày)</p>
                                    <p className="font-medium text-yellow-600">{batchProductStatus?.expiringSoonBatches}</p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <p className="text-muted-foreground">Đã hết / hết hạn</p>
                                    <p className="font-medium text-red-600">{batchProductStatus?.expiredOrEmptyBatches}</p>
                                </div>

                                <div className="pt-2">
                                    <Button variant="outline" className="w-full" asChild>
                                        <Link href={`/admin/products/${id}/batches`}>
                                            Quản lý lô hàng
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <div className="flex flex-col gap-2">
                            <Button className="w-full" asChild>
                                <Link href={`/admin/products/edit/${id}`}>Chỉnh sửa sản phẩm</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
