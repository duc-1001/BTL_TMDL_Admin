"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Package, MapPin, CreditCard, User, Phone, Mail, Truck } from "lucide-react"
import Link from "next/link"

const orderDetails = {
    id: "#DH001234",
    date: "10/01/2026 14:30",
    status: "processing",
    customer: {
        name: "Nguyễn Văn A",
        phone: "0912345678",
        email: "nguyenvana@email.com",
        address: "123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM",
    },
    items: [
        {
            id: 1,
            name: "Bánh Snack Oishi Vị Bò Nướng",
            price: 25000,
            quantity: 2,
            image: "/vietnamese-oishi-beef-snack-package.jpg",
        },
        {
            id: 2,
            name: "Kẹo Alpenliebe Caramel",
            price: 35000,
            quantity: 1,
            image: "/alpenliebe-caramel-candy-bag.jpg",
        },
        {
            id: 3,
            name: "Hạt điều rang muối",
            price: 85000,
            quantity: 1,
            image: "/premium-roasted-cashew-nuts-package.jpg",
        },
    ],
    payment: {
        method: "COD",
        status: "pending",
    },
    shipping: {
        method: "Giao hàng nhanh",
        fee: 30000,
    },
    note: "Giao giờ hành chính, gọi trước 15 phút",
    timeline: [
        { status: "Đơn hàng đã được tạo", time: "10/01/2026 14:30", completed: true },
        { status: "Đơn hàng đã được xác nhận", time: "10/01/2026 14:45", completed: true },
        { status: "Đang chuẩn bị hàng", time: "10/01/2026 15:00", completed: true },
        { status: "Đang giao hàng", time: "", completed: false },
        { status: "Đã giao hàng", time: "", completed: false },
    ],
}

export default function OrderDetailPage() {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price)
    }

    const subtotal = orderDetails.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const total = subtotal + orderDetails.shipping.fee

    const getStatusColor = (status: string) => {
        const colors = {
            pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
            processing: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
            shipping: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
            completed: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
            cancelled: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
        }
        return colors[status as keyof typeof colors] || colors.pending
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild className="bg-transparent">
                    <Link href="/admin/orders">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-1">Chi tiết đơn hàng {orderDetails.id}</h1>
                    <p className="text-sm text-muted-foreground">{orderDetails.date}</p>
                </div>
                <div className="flex items-center gap-3">
                    <Select defaultValue={orderDetails.status}>
                        <SelectTrigger className="w-40">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pending">Chờ xác nhận</SelectItem>
                            <SelectItem value="processing">Đang xử lý</SelectItem>
                            <SelectItem value="shipping">Đang giao</SelectItem>
                            <SelectItem value="completed">Hoàn thành</SelectItem>
                            <SelectItem value="cancelled">Đã hủy</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button>Lưu thay đổi</Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Items */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5 text-primary" />
                                Sản phẩm đã đặt
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {orderDetails.items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                            <img
                                                src={item.image || "/placeholder.svg"}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium mb-1 line-clamp-2">{item.name}</h4>
                                            <p className="text-sm text-muted-foreground mb-2">
                                                {formatPrice(item.price)} x {item.quantity}
                                            </p>
                                            <p className="font-semibold text-primary">{formatPrice(item.price * item.quantity)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Separator className="my-4" />

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Tạm tính</span>
                                    <span className="font-medium">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Phí vận chuyển</span>
                                    <span className="font-medium">{formatPrice(orderDetails.shipping.fee)}</span>
                                </div>
                            </div>

                            <Separator className="my-4" />

                            <div className="flex justify-between text-lg font-bold">
                                <span>Tổng cộng</span>
                                <span className="text-primary">{formatPrice(total)}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Order Timeline */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Truck className="h-5 w-5 text-primary" />
                                Trạng thái đơn hàng
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {orderDetails.timeline.map((event, index) => (
                                    <div key={index} className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div
                                                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${event.completed ? "bg-orange-600 text-primary-foreground" : "bg-muted text-muted-foreground"
                                                    }`}
                                            >
                                                {event.completed ? "✓" : index + 1}
                                            </div>
                                            {index < orderDetails.timeline.length - 1 && (
                                                <div className={`w-0.5 h-12 ${event.completed ? "bg-orange-600" : "bg-muted"}`} />
                                            )}
                                        </div>
                                        <div className="flex-1 pb-8">
                                            <p className={`font-medium ${event.completed ? "" : "text-muted-foreground"}`}>
                                                {event.status}
                                            </p>
                                            {event.time && <p className="text-sm text-muted-foreground mt-1">{event.time}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    {/* Customer Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5 text-primary" />
                                Thông tin khách hàng
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-orange-600/10 flex items-center justify-center font-semibold flex-shrink-0">
                                    {orderDetails.customer.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium">{orderDetails.customer.name}</p>
                                    <Button variant="link" className="h-auto p-0 text-sm text-primary">
                                        Xem hồ sơ
                                    </Button>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-3">
                                    <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                    <span>{orderDetails.customer.phone}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                    <span className="break-all">{orderDetails.customer.email}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Shipping Address */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-primary" />
                                Địa chỉ giao hàng
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm leading-relaxed">{orderDetails.customer.address}</p>
                            {orderDetails.note && (
                                <>
                                    <Separator className="my-4" />
                                    <div>
                                        <p className="text-sm font-medium mb-1">Ghi chú</p>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{orderDetails.note}</p>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Payment Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-primary" />
                                Thanh toán
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Phương thức</span>
                                <span className="font-medium">{orderDetails.payment.method}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Trạng thái</span>
                                <Badge className={getStatusColor(orderDetails.payment.status)}>
                                    {orderDetails.payment.status === "pending" ? "Chưa thanh toán" : "Đã thanh toán"}
                                </Badge>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Tổng tiền</span>
                                <span className="font-bold text-primary">{formatPrice(total)}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex gap-2">
                        <Button variant="outline" className="flex-1 bg-transparent">
                            In đơn hàng
                        </Button>
                        <Button variant="destructive" className="flex-1">
                            Hủy đơn
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
