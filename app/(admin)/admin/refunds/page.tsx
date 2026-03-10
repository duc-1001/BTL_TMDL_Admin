"use client"

import { useState, useMemo } from "react"
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
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
import { Separator } from "@/components/ui/separator"
import {
  Eye,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  User,
  Phone,
  Mail,
  Package,
  Calendar,
} from "lucide-react"

// ────────────────────────────────────────────────
// TYPES
// ────────────────────────────────────────────────

type RefundStatus = "pending" | "processing" | "completed" | "rejected"
type RefundReason = "customer_request" | "defective" | "not_received" | "wrong_item" | "changed_mind"

interface RefundItem {
  name: string
  qty: number
  price: number
}

interface Refund {
  id: string
  orderId: string
  customer: string
  phone: string
  email: string
  amount: number
  reason: RefundReason
  status: RefundStatus
  createdAt: Date
  processedAt?: Date
  items: RefundItem[]
  notes: string
  refundMethod: "original" | "wallet" | "bank"
}

// ────────────────────────────────────────────────
// LABELS & MOCK DATA
// ────────────────────────────────────────────────

const reasonLabels: Record<RefundReason, string> = {
  customer_request: "Yêu cầu từ khách",
  defective: "Sản phẩm hư hỏng",
  not_received: "Chưa nhận được hàng",
  wrong_item: "Gửi nhầm sản phẩm",
  changed_mind: "Đổi ý",
}

const statusLabels: Record<RefundStatus, string> = {
  pending: "Chờ xử lý",
  processing: "Đang xử lý",
  completed: "Hoàn tất",
  rejected: "Từ chối",
}

const statusColors: Record<RefundStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
}

const refundMethodLabels: Record<string, string> = {
  original: "Hoàn nguyên",
  wallet: "Ví điện tử",
  bank: "Chuyển khoản",
}

function generateMockRefunds(): Refund[] {
  const reasons: RefundReason[] = ["customer_request", "defective", "not_received", "wrong_item", "changed_mind"]
  const statuses: RefundStatus[] = ["pending", "processing", "completed", "rejected"]
  const customers = ["Nguyễn Văn A", "Trần Thị B", "Phạm Văn C", "Hoàng Thị D", "Lê Văn E"]
  const methods = ["original", "wallet", "bank"] as const

  return Array.from({ length: 20 }, (_, i) => {
    const createdAt = new Date()
    createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 30))

    return {
      id: `REF${String(i + 1).padStart(5, "0")}`,
      orderId: `ORD-2024-${String(i + 1).padStart(3, "0")}`,
      customer: customers[Math.floor(Math.random() * customers.length)],
      phone: `09${Math.floor(10000000 + Math.random() * 90000000)}`,
      email: `khach${i + 1}@example.com`,
      amount: Math.floor(50000 + Math.random() * 2000000),
      reason: reasons[Math.floor(Math.random() * reasons.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      createdAt,
      processedAt: Math.random() > 0.5 ? new Date(createdAt.getTime() + Math.random() * 5 * 86400000) : undefined,
      items: [
        { name: "Snack khoai tây BBQ", qty: 1, price: 45000 },
        { name: "Kẹo dẻo trái cây", qty: 2, price: 35000 },
      ],
      notes: i % 4 === 0 ? "Sản phẩm lỗi bao bì" : "",
      refundMethod: methods[Math.floor(Math.random() * methods.length)],
    }
  })
}

// ────────────────────────────────────────────────
// MAIN COMPONENT
// ────────────────────────────────────────────────

export default function RefundsPage() {
  const [refunds, setRefunds] = useState<Refund[]>(generateMockRefunds())
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<RefundStatus | "all">("all")
  const [reasonFilter, setReasonFilter] = useState<RefundReason | "all">("all")

  const [selected, setSelected] = useState<Refund | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const [confirmAction, setConfirmAction] = useState<{
    type: "process" | "reject" | "complete"
    refundId: string
  } | null>(null)

  const [page, setPage] = useState(1)
  const itemsPerPage = 10

  const formatVND = (num: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(num)

  // Filtering & Pagination
  const filtered = useMemo(() => {
    return refunds.filter((r) => {
      const matchSearch =
        r.id.toLowerCase().includes(search.toLowerCase()) ||
        r.orderId.toLowerCase().includes(search.toLowerCase()) ||
        r.customer.toLowerCase().includes(search.toLowerCase()) ||
        r.phone.includes(search)

      const matchStatus = statusFilter === "all" || r.status === statusFilter
      const matchReason = reasonFilter === "all" || r.reason === reasonFilter

      return matchSearch && matchStatus && matchReason
    })
  }, [refunds, search, statusFilter, reasonFilter])

  const paginated = useMemo(() => {
    const start = (page - 1) * itemsPerPage
    return filtered.slice(start, start + itemsPerPage)
  }, [filtered, page])

  const totalPages = Math.ceil(filtered.length / itemsPerPage)

  // Stats
  const stats = useMemo(() => ({
    total: refunds.length,
    pending: refunds.filter((r) => r.status === "pending").length,
    completed: refunds.filter((r) => r.status === "completed").length,
    totalAmount: refunds.reduce((sum, r) => sum + r.amount, 0),
  }), [refunds])

  // Status Actions
  const updateStatus = (id: string, newStatus: RefundStatus) => {
    setRefunds((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: newStatus, processedAt: new Date() }
          : r
      )
    )
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
          <StatCard title="Tổng tiền" value={formatVND(stats.totalAmount)} color="text-primary" />
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
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  {Object.keys(statusLabels).map((s) => (
                    <SelectItem key={s} value={s}>
                      {statusLabels[s as RefundStatus]}
                    </SelectItem>
                  ))}
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
                <SelectContent>
                  <SelectItem value="all">Tất cả lý do</SelectItem>
                  {Object.keys(reasonLabels).map((r) => (
                    <SelectItem key={r} value={r}>
                      {reasonLabels[r as RefundReason]}
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
                {paginated.map((refund) => (
                  <tr key={refund.id} className="border-b hover:bg-muted/40 transition-colors">
                    <td className="px-4 py-3 font-medium">{refund.id}</td>
                    <td className="px-4 py-3">{refund.orderId}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{refund.customer}</div>
                      <div className="text-xs text-muted-foreground">{refund.phone}</div>
                    </td>
                    <td className="px-4 py-3">{reasonLabels[refund.reason]}</td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {formatVND(refund.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={statusColors[refund.status]}>
                        {statusLabels[refund.status]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {refund.createdAt.toLocaleDateString("vi-VN")}
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
                              setSelected(refund)
                              setSheetOpen(true)
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />

                          {refund.status === "pending" && (
                            <>
                              <DropdownMenuItem onClick={() => setConfirmAction({ type: "process", refundId: refund.id })}>
                                Bắt đầu xử lý
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                                onClick={() => setConfirmAction({ type: "reject", refundId: refund.id })}
                              >
                                Từ chối
                              </DropdownMenuItem>
                            </>
                          )}

                          {refund.status === "processing" && (
                            <>
                              <DropdownMenuItem onClick={() => setConfirmAction({ type: "complete", refundId: refund.id })}>
                                Hoàn tất hoàn tiền
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                                onClick={() => setConfirmAction({ type: "reject", refundId: refund.id })}
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
          {filtered.length > 0 && (
            <div className="flex items-center justify-between border-t px-4 py-3">
              <p className="text-sm text-muted-foreground">
                Hiển thị {(page - 1) * itemsPerPage + 1} – {Math.min(page * itemsPerPage, filtered.length)} / {filtered.length}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" /> Trước
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Tiếp <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Detail Sheet */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent className="w-full sm:max-w-2xl lg:max-w-3xl overflow-y-auto">
            {selected && (
              <>
                <SheetHeader className="mb-6">
                  <SheetTitle className="text-2xl">{selected.id}</SheetTitle>
                  <SheetDescription>Chi tiết yêu cầu hoàn tiền</SheetDescription>
                </SheetHeader>

                <div className="space-y-6">
                  {/* Status & Quick Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <Badge className={`${statusColors[selected.status]} px-4 py-1 text-base`}>
                      {statusLabels[selected.status]}
                    </Badge>

                    <div className="flex flex-wrap gap-2">
                      {selected.status === "pending" && (
                        <>
                          <Button
                            variant="outline"
                            className="border-red-200 text-red-700 hover:bg-red-50"
                            onClick={() => setConfirmAction({ type: "reject", refundId: selected.id })}
                          >
                            Từ chối
                          </Button>
                          <Button onClick={() => setConfirmAction({ type: "process", refundId: selected.id })}>
                            Bắt đầu xử lý
                          </Button>
                        </>
                      )}

                      {selected.status === "processing" && (
                        <>
                          <Button
                            variant="outline"
                            className="border-red-200 text-red-700 hover:bg-red-50"
                            onClick={() => setConfirmAction({ type: "reject", refundId: selected.id })}
                          >
                            Từ chối
                          </Button>
                          <Button onClick={() => setConfirmAction({ type: "complete", refundId: selected.id })}>
                            Hoàn tất
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Basic Info */}
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Mã đơn hàng</p>
                      <p className="font-semibold">{selected.orderId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Lý do</p>
                      <p className="font-semibold">{reasonLabels[selected.reason]}</p>
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" /> Khách hàng
                    </p>
                    <div className="rounded-lg bg-muted/40 p-4 text-sm space-y-2">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {selected.phone}
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {selected.email}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Items */}
                  <div>
                    <p className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                      <Package className="h-4 w-4" /> Sản phẩm
                    </p>
                    <div className="space-y-3">
                      {selected.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded-lg bg-muted/30 p-3"
                        >
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-xs text-muted-foreground">×{item.qty}</p>
                          </div>
                          <p className="font-semibold">{formatVND(item.price * item.qty)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 p-5">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-muted-foreground">Số tiền hoàn</span>
                      <span className="text-2xl font-bold text-primary">
                        {formatVND(selected.amount)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Phương thức</span>
                      <Badge variant="outline">{refundMethodLabels[selected.refundMethod]}</Badge>
                    </div>
                  </div>

                  {selected.notes && (
                    <>
                      <Separator />
                      <div>
                        <p className="mb-2 text-sm text-muted-foreground">Ghi chú</p>
                        <p className="rounded-lg bg-muted/50 p-3 text-sm">{selected.notes}</p>
                      </div>
                    </>
                  )}

                  <Separator />

                  {/* Timeline */}
                  <div>
                    <p className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" /> Lịch sử
                    </p>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between rounded-lg bg-muted/30 p-3">
                        <span>Tạo yêu cầu</span>
                        <span className="text-muted-foreground">
                          {selected.createdAt.toLocaleString("vi-VN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>
                      </div>
                      {selected.processedAt && (
                        <div className="flex justify-between rounded-lg bg-muted/30 p-3">
                          <span>Cập nhật trạng thái</span>
                          <span className="text-muted-foreground">
                            {selected.processedAt.toLocaleString("vi-VN", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>

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