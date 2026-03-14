"use client"

import { useState, useMemo, useEffect } from "react"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Eye,
  MoreVertical
} from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { adminGetRefunds } from "@/services/refund.service"
import useDebounce from "@/hooks/use-debounce"
import { useRouter } from "next/navigation"
import { ReasonCode, RefundAdminListItem, RefundStatus } from "@/types/refund"
import { formatTimeAgo } from "@/lib/time"
import { REFUND_REASONS } from "@/components/refund/refund-form"
import DetailAdminRefundSheet from "@/components/refund/detail-admin-refund-sheet"

export const statusLabels: Record<RefundStatus, string> = {
  pending: "Chờ xử lý",
  processing: "Đang xử lý",
  completed: "Hoàn tất",
  rejected: "Từ chối",
  cancelled: "Đã hủy",
}

export const statusColors: Record<RefundStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-800",
}


export default function RefundsPage() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<RefundStatus | "all">("all")
  const [reasonFilter, setReasonFilter] = useState<ReasonCode | "all">("all")
  const [page, setPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20)

  const q = useDebounce(search, 500)

  const { data, error } = useQuery({
    queryKey: ["adminRefunds", q, statusFilter, reasonFilter, page, itemsPerPage],
    queryFn: async () => adminGetRefunds(q, statusFilter, reasonFilter, page, itemsPerPage),
  })

  useEffect(() => {
    if (error) {
      const errCode = (error as any)?.code
      if (errCode === "UNAUTHORIZED" || errCode === "PERMISSION_DENIED") {
        router.push("/login")
      }
    }
  }, [error])

  // Filtering & Pagination

  const totalPages = useMemo(() => {
    if (!data) return 1
    return data.pagination.totalPages
  }, [data])

  const totalItems = useMemo(() => {
    if (!data) return 0
    return data.pagination.total
  }, [data])

  const refunds = useMemo(() => {
    if (!data) return []
    return data.data
  }, [data])

  const [selected, setSelected] = useState<string | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const [confirmAction, setConfirmAction] = useState<{
    type: "process" | "reject" | "complete"
    refundId: string
  } | null>(null)

  const formatVND = (num: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(num)

  // Stats
  const stats = useMemo(() => {
    if (!data) return { total: 0, pending: 0, completed: 0, totalAmount: 0 }
    const total = data.pagination.total
    const pending = data.data.filter((r) => r.status === "pending").length
    const completed = data.data.filter((r) => r.status === "completed").length
    const totalAmount = data.data.reduce((sum, r) => sum + r.totalRefund, 0)
    return { total, pending, completed, totalAmount }
  }, [data])

  // Status Actions
  const updateStatus = (id: string, newStatus: RefundStatus) => {
    if (!confirmAction) return
    if(newStatus === "processing") handleProcess(id)
    setConfirmAction(null)
  }

  const handleProcess = (id: string) => updateStatus(id, "processing")
  const handleComplete = (id: string) => updateStatus(id, "completed")
  const handleReject = (id: string) => updateStatus(id, "rejected")

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Quản lý hoàn tiền</h1>
          <p className="mt-1 text-muted-foreground">
            Theo dõi và xử lý các yêu cầu hoàn tiền từ khách hàng
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Tổng yêu cầu" value={stats.total} />
          <StatCard title="Chờ xử lý" value={stats.pending} color="text-yellow-600" />
          <StatCard title="Hoàn tất" value={stats.completed} color="text-green-600" />
          <StatCard title="Tổng tiền" value={formatVND(stats.totalAmount)} color="text-orange-500" />
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <Input
                placeholder="Tìm mã hoàn tiền, đơn hàng, tên, số điện thoại..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                className="md:max-w-sm"
              />
              <Select
                value={statusFilter}
                onValueChange={(v) => {
                  setStatusFilter(v as any)
                  setPage(1)
                }}
              >
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={4}>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="pending">Chờ xử lý</SelectItem>
                  <SelectItem value="processing">Đang xử lý</SelectItem>
                  <SelectItem value="completed">Hoàn tất</SelectItem>
                  <SelectItem value="rejected">Từ chối</SelectItem>
                  <SelectItem value="cancelled">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={reasonFilter}
                onValueChange={(v) => {
                  setReasonFilter(v as any)
                  setPage(1)
                }}
              >
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Lý do" />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={4}>
                  <SelectItem value="all">Tất cả lý do</SelectItem>
                  {REFUND_REASONS.map((r) => (
                    <SelectItem key={r.code} value={r.code}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/60">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Mã HT</th>
                  <th className="px-4 py-3 text-left font-medium">Đơn hàng</th>
                  <th className="px-4 py-3 text-left font-medium">Khách hàng</th>
                  <th className="px-4 py-3 text-left font-medium">Lý do</th>
                  <th className="px-4 py-3 text-right font-medium">Số tiền</th>
                  <th className="px-4 py-3 text-left font-medium">Trạng thái</th>
                  <th className="px-4 py-3 text-left font-medium">Ngày tạo</th>
                  <th className="px-4 py-3 text-center font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {refunds.map((refund) => (
                  <tr key={refund._id} className="border-b hover:bg-muted/40 transition-colors">
                    <td className="px-4 py-3 font-medium">{refund.refundCode}</td>
                    <td className="px-4 py-3">{refund.orderCode}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{refund.customer?.fullName}</div>
                      <div className="text-xs text-muted-foreground">{refund.customer?.phone}</div>
                    </td>
                    <td className="px-4 py-3">{refund.reason}</td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {formatVND(refund.totalRefund)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={statusColors[refund.status]}>
                        {statusLabels[refund.status]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatTimeAgo(refund.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelected(refund._id)
                              setSheetOpen(true)
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />

                          {refund.status === "pending" && (
                            <>
                              <DropdownMenuItem onClick={() => setConfirmAction({ type: "process", refundId: refund._id })}>
                                Bắt đầu xử lý
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                                onClick={() => setConfirmAction({ type: "reject", refundId: refund._id })}
                              >
                                Từ chối
                              </DropdownMenuItem>
                            </>
                          )}

                          {refund.status === "processing" && (
                            <>
                              <DropdownMenuItem onClick={() => setConfirmAction({ type: "complete", refundId: refund._id })}>
                                Hoàn tất hoàn tiền
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                                onClick={() => setConfirmAction({ type: "reject", refundId: refund._id })}
                              >
                                Từ chối
                              </DropdownMenuItem>
                            </>
                          )}

                          {(refund.status === "completed" || refund.status === "rejected") && (
                            <DropdownMenuItem disabled>
                              Đã {refund.status === "completed" ? "hoàn tất" : "từ chối"}
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
        </Card>

        {/* Detail Sheet */}
        <DetailAdminRefundSheet
          refundId={selected}
          sheetOpen={sheetOpen}
          setSheetOpen={setSheetOpen}
          setConfirmAction={setConfirmAction}
        />

        {/* Confirmation Dialog */}
        <AlertDialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {confirmAction?.type === "process" && "Xác nhận bắt đầu xử lý?"}
                {confirmAction?.type === "reject" && "Xác nhận từ chối?"}
                {confirmAction?.type === "complete" && "Xác nhận hoàn tất hoàn tiền?"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                Hành động này sẽ thay đổi trạng thái yêu cầu hoàn tiền.
                {confirmAction?.type === "reject" && " Khách hàng sẽ nhận thông báo từ chối."}
                {confirmAction?.type === "complete" && " Số tiền sẽ được hoàn theo phương thức đã chọn."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (!confirmAction) return
                  const { type, refundId } = confirmAction
                  if (type === "process") handleProcess(refundId)
                  else if (type === "reject") handleReject(refundId)
                  else if (type === "complete") handleComplete(refundId)
                }}
                className={confirmAction?.type === "reject" ? "bg-red-600 hover:bg-red-700" : ""}
              >
                {confirmAction?.type === "process" && "Xử lý"}
                {confirmAction?.type === "reject" && "Từ chối"}
                {confirmAction?.type === "complete" && "Hoàn tất"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

// Helper component
function StatCard({
  title,
  value,
  color = "text-foreground",
}: {
  title: string
  value: string | number
  color?: string
}) {
  return (
    <Card className="shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="p-6">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className={`mt-2 text-2xl font-bold ${color}`}>
          {typeof value === "number" ? value.toLocaleString("vi-VN") : value}
        </p>
      </CardContent>
    </Card>
  )
}