"use client"

import {
    ArrowLeft,
    Search,
    XCircle,
    Filter,
    Eye
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { getMyRefunds } from '@/services/refund.service';
import { useMemo } from "react"
import { formatDateTime } from "@/lib/utils";

const REFUND_DATA = [
    { id: '1', code: 'REF7A9C3F21', order: 'ORDF2B16018', amount: 201600, status: 'pending', date: '10/03/2026', items: 'Fruity Basket (x3), Goldbears (x3)...', reason: 'Sản phẩm bị lỗi' },
    { id: '2', code: 'REF8B2D4E55', order: 'ORDF9A12005', amount: 540000, status: 'completed', date: '08/03/2026', items: 'Kẹo dẻo Sakura (x1)', reason: 'Giao sai sản phẩm' },
    { id: '3', code: 'REF1A5X8Z99', order: 'ORDF3C44099', amount: 125000, status: 'rejected', date: '05/03/2026', items: 'Bánh Gấu Mix (x2)', reason: 'Quá hạn đổi trả' },
    { id: '4', code: 'REF4K9L2M11', order: 'ORDF5E88123', amount: 89000, status: 'completed', date: '01/03/2026', items: 'Socola KitKat (x5)', reason: 'Không còn nhu cầu' },
    { id: '5', code: 'REF9P0Q1R22', order: 'ORDF7X22100', amount: 350000, status: 'pending', date: '28/02/2026', items: 'Hộp quà Tết (x1)', reason: 'Bị vỡ khi vận chuyển' },
];

const StatusBadge = ({ status }: { status: string }) => {
    const config: any = {
        pending: { label: "Đang xử lý", class: "text-amber-600 bg-amber-50" },
        completed: { label: "Thành công", class: "text-emerald-600 bg-emerald-50" },
        rejected: { label: "Từ chối", class: "text-rose-600 bg-rose-50" },
    }
    const item = config[status] || config.pending
    return (
        <span className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wider ${item.class}`}>
            {item.label}
        </span>
    )
}

export default function LuxuryRefundTable() {
    const { isAuthenticated } = useSelector((root: RootState) => root.auth)
    const { data } = useQuery({
        queryKey: ["refund-history"],
        queryFn: () => getMyRefunds(),
        enabled: isAuthenticated,
    })
    const refunds = useMemo(() => {
        if (!data) return []
        return data || []
    }, [data])
    const formatPrice = (p: number) => new Intl.NumberFormat('vi-VN').format(p) + '₫';

    if (!isAuthenticated) {
        return (
            <div className=" py-40 bg-background flex items-center justify-center px-4">
                <Card className="w-full max-w-md shadow-sm">
                    <CardContent className="p-6 text-center">
                        <XCircle className="h-16 w-16 mx-auto mb-4 text-red-500" />
                        <h3 className="text-lg font-semibold mb-2">Bạn chưa đăng nhập</h3>
                        <p className="text-sm text-muted-foreground mb-6">Vui lòng đăng nhập để xem đơn hàng của bạn</p>
                        <Button asChild className="bg-blue-500 hover:bg-blue-500/90 transition-colors duration-200">
                            <Link href="/login">Đăng nhập</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }
    return (
        <div className="min-h-screen bg-white text-slate-900 antialiased">
            <div className="max-w-7xl mx-auto px-4 py-10">

                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div className="space-y-1">
                        <div className="flex items-center text-slate-400 gap-2 text-sm mb-2 hover:text-black cursor-pointer transition-colors group">
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            <span>Quay lại cửa hàng</span>
                        </div>
                        <h1 className="text-3xl font-black tracking-tight">Lịch sử hoàn tiền</h1>
                        <p className="text-slate-500 text-sm">Quản lý và theo dõi tiến độ các yêu cầu trả hàng của bạn.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Tìm mã đơn..."
                                className="bg-slate-50 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-slate-200 outline-none w-full md:w-64 transition-all"
                            />
                        </div>
                        <Button variant="outline" className="rounded-xl border-slate-200 hover:bg-slate-50 gap-2">
                            <Filter size={16} /> Lọc
                        </Button>
                    </div>
                </div>

                {/* --- LUXURY TABLE --- */}
                <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-50">
                                    <th className="px-6 py-5">Ngày yêu cầu</th>
                                    <th className="px-6 py-5">Mã đơn hàng</th>
                                    <th className="px-6 py-5 hidden md:table-cell">Sản phẩm & Lý do</th>
                                    <th className="px-6 py-5">Trạng thái</th>
                                    <th className="px-6 py-5 text-right">Số tiền hoàn</th>
                                    <th className="px-6 py-5 w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {refunds.map((item) => (
                                    <tr key={item._id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-6 text-sm text-slate-500 whitespace-nowrap">
                                            {formatDateTime(item.createdAt)}
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="font-bold text-slate-900">{item.orderCode}</div>
                                            <div className="text-[10px] font-mono text-slate-400 tracking-tighter">{item.refundCode}</div>
                                        </td>
                                        <td className="px-6 py-6 hidden md:table-cell max-w-xs">
                                            <p className="text-sm text-slate-700 font-medium truncate">{item.items.map((i) => i.name).join(", ")}</p>
                                            <p className="text-xs text-slate-400 truncate italic">"{item.reason}"</p>
                                        </td>
                                        <td className="px-6 py-6">
                                            <StatusBadge status={item.status} />
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <span className="text-base font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                                                {formatPrice(item.totalRefund)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <Link href={`/refunds/${item.refundCode}?viewToken=${item.viewToken}`} className="text-slate-300 hover:text-slate-900 p-1">
                                                <Eye size={20} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* --- PAGINATION (Hệ thống phân trang tối giản) --- */}
                <div className="mt-8 flex items-center justify-between px-2">
                    <p className="text-xs font-bold text-slate-400 tracking-widest">
                        Trang 1 / 10
                    </p>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 text-xs font-bold border border-slate-100 rounded-lg hover:bg-slate-50 disabled:opacity-30" disabled>Trước</button>
                        <button className="px-4 py-2 text-xs font-bold border border-slate-100 rounded-lg hover:bg-slate-50">Sau</button>
                    </div>
                </div>

            </div>
        </div>
    )
}