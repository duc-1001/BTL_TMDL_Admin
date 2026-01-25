"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Copy, BarChart3 } from "lucide-react"
import Link from "next/link"

const promotions = [
    {
        id: 1,
        name: "Giảm giá 30% cho đơn hàng đầu tiên",
        code: "WELCOME30",
        discount: "30%",
        type: "percentage",
        status: "active",
        startDate: "01/01/2026",
        endDate: "31/01/2026",
        used: 234,
        limit: 1000,
    },
    {
        id: 2,
        name: "Miễn phí vận chuyển",
        code: "FREESHIP",
        discount: "30,000đ",
        type: "fixed",
        status: "active",
        startDate: "01/01/2026",
        endDate: "31/12/2026",
        used: 1456,
        limit: null,
    },
    {
        id: 3,
        name: "Tết 2026 - Giảm 50K",
        code: "TET2026",
        discount: "50,000đ",
        type: "fixed",
        status: "expired",
        startDate: "20/01/2026",
        endDate: "05/02/2026",
        used: 892,
        limit: 2000,
    },
    {
        id: 4,
        name: "Flash Sale Cuối Tuần",
        code: "WEEKEND50",
        discount: "50%",
        type: "percentage",
        status: "scheduled",
        startDate: "18/01/2026",
        endDate: "19/01/2026",
        used: 0,
        limit: 500,
    },
]

export default function PromotionsPage() {
    const getStatusBadge = (status: string) => {
        const config = {
            active: { label: "Đang áp dụng", className: "bg-green-500" },
            scheduled: { label: "Sắp diễn ra", className: "bg-blue-500" },
            expired: { label: "Đã hết hạn", className: "bg-gray-500" },
        }
        const { label, className } = config[status as keyof typeof config]
        return <Badge className={className}>{label}</Badge>
    }

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Quản lý khuyến mãi</h1>
                    <p className="text-muted-foreground">Tạo và quản lý các chương trình khuyến mãi</p>
                </div>
                <Button asChild>
                    <Link href="/admin/promotions/new">
                        <Plus className="h-4 w-4 mr-2" />
                        Tạo khuyến mãi
                    </Link>
                </Button>
            </div>

            <div className="grid gap-4">
                {promotions.map((promo) => (
                    <Card key={promo.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="text-lg font-semibold">{promo.name}</h3>
                                                {getStatusBadge(promo.status)}
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {promo.startDate} - {promo.endDate}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid sm:grid-cols-4 gap-4">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 rounded-lg bg-orange-600/10">
                                                <Copy className="h-4 w-4 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">Mã giảm giá</p>
                                                <button
                                                    onClick={() => copyCode(promo.code)}
                                                    className="font-mono font-semibold hover:text-primary transition-colors"
                                                >
                                                    {promo.code}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <div className="p-2 rounded-lg bg-green-500/10">
                                                <BarChart3 className="h-4 w-4 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">Giá trị</p>
                                                <p className="font-semibold text-primary">{promo.discount}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <div className="p-2 rounded-lg bg-blue-500/10">
                                                <BarChart3 className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">Đã sử dụng</p>
                                                <p className="font-semibold">
                                                    {promo.used} {promo.limit && `/ ${promo.limit}`}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <div className="p-2 rounded-lg bg-purple-500/10">
                                                <BarChart3 className="h-4 w-4 text-purple-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">Tỷ lệ sử dụng</p>
                                                <p className="font-semibold">
                                                    {promo.limit ? Math.round((promo.used / promo.limit) * 100) : "∞"}%
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex lg:flex-col gap-2">
                                    <Button variant="outline" size="icon" className="bg-transparent">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="bg-transparent text-destructive hover:text-destructive"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
