"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Trash2, Edit2, Plus, Copy, Eye, EyeOff } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import useDebounce from "@/hooks/use-debounce"
import { useQuery } from "@tanstack/react-query"
import { getCouponsAdmin } from "@/services/coupon.service"
import CreateNewCoupon from "@/components/forms/coupon/create-new-coupon"
import { Coupon } from "@/types/coupon"
import EditCoupon from "@/components/forms/coupon/edit-coupon"
import { toast } from "sonner"
import DeleteCoupon from "@/components/forms/coupon/delete-coupon"

export default function CouponPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [statusFilter, setStatusFilter] = useState("all")
  const q = useDebounce(searchTerm, 300)
  const { data, isLoading } = useQuery({
    queryKey: ['coupons-admin', q, currentPage, itemsPerPage, statusFilter],
    queryFn: () => getCouponsAdmin(q, currentPage, itemsPerPage, statusFilter)
  })

  console.log(data);

  const coupons = data?.data || []
  const totalPages = data?.totalPages || 1
  const totalItems = data?.totalItems || 0

  const [openDialog, setOpenDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openDeleteDialog, setDeleteDialogOpen] = useState(false)
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null)
  const [viewDetail, setViewDetail] = useState<Coupon | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleAddCoupon = () => {
    setSelectedCoupon(null)
    setOpenDialog(true)
  }

  const handleEditCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon)
    setOpenEditDialog(true)
  }


  const handleDeleteCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon)
    setDeleteDialogOpen(true)
  }

  const handleToggleActive = (id: string) => {
  }

  const handleToggleShowOnWebsite = (id: string) => {
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedId(code)
    setTimeout(() => setCopiedId(null), 2000)
    toast.success("Đã sao chép mã giảm giá vào clipboard!")
  }


  const getDiscountDisplay = (coupon: Coupon) => {
    if (coupon.type === "percentage") {
      return `Giảm ${coupon.value}%`
    } else {
      return `Giảm ${coupon.value.toLocaleString("vi-VN")}đ`
    }
  }

  const activeCoupons = coupons.filter((c) => c.isActive).length
  const totalUsage = coupons.reduce((sum, c) => sum + c.usageCount, 0)

  return (
    <div>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Mã giảm giá</h1>
            <p className="text-muted-foreground">Tạo và quản lý mã coupon cho khách hàng</p>
          </div>
          <Button onClick={handleAddCoupon} className="bg-orange-600 hover:bg-orange-700">
            <Plus className="h-4 w-4 mr-2" />
            Thêm mã giảm giá
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tổng mã</p>
                  <p className="text-3xl font-bold">{coupons.length}</p>
                </div>
                <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                  <Plus className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Đang hoạt động</p>
                  <p className="text-3xl font-bold">{activeCoupons}</p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Lượt sử dụng</p>
                  <p className="text-3xl font-bold">{totalUsage.toLocaleString("vi-VN")}</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Copy className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coupons Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-6 py-3 text-left font-medium">Mã</th>
                    <th className="px-6 py-3 text-left font-medium">Mô tả</th>
                    <th className="px-6 py-3 text-left font-medium">Giảm giá</th>
                    <th className="px-6 py-3 text-left font-medium">Hạn mức</th>
                    <th className="px-6 py-3 text-left font-medium">Sử dụng</th>
                    <th className="px-6 py-3 text-left font-medium">Trạng thái</th>
                    <th className="px-6 py-3 text-right font-medium">Hành động</th>
                  </tr>
                </thead>

                <tbody>
                  {coupons.map((coupon) => {
                    const isActive = coupon.isActive

                    return (
                      <tr
                        key={coupon._id}
                        className="border-b transition-colors hover:bg-muted/50"
                      >
                        {/* CODE */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <code className="rounded bg-gray-100 px-3 py-1 font-mono font-semibold dark:bg-gray-900">
                              {coupon.code}
                            </code>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Sao chép mã"
                              onClick={() => handleCopyCode(coupon.code)}
                              className="h-8 w-8"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>

                        {/* DESCRIPTION */}
                        <td className="px-6 py-4">
                          <p className="line-clamp-2 text-muted-foreground">
                            {coupon.description || "—"}
                          </p>
                        </td>

                        {/* DISCOUNT */}
                        <td className="px-6 py-4 font-medium">
                          {getDiscountDisplay(coupon)}
                        </td>

                        {/* MIN ORDER */}
                        <td className="px-6 py-4">
                          {coupon.minOrderValue > 0
                            ? `Từ ${coupon.minOrderValue.toLocaleString("vi-VN")}đ`
                            : "—"}
                        </td>

                        {/* USAGE */}
                        <td className="px-6 py-4">
                          <span className="font-medium">{coupon.usageCount}</span>
                          <span className="text-muted-foreground">
                            /{coupon.maxUsageCount || "∞"}
                          </span>
                        </td>

                        {/* STATUS */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Badge
                              className={
                                isActive
                                  ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                                  : "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400"
                              }
                            >
                              {isActive ? "Hoạt động" : "Tắt"}
                            </Badge>

                            {isActive && (
                              <Badge variant="outline">Hiển thị</Badge>
                            )}
                          </div>
                        </td>

                        {/* ACTIONS */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              title={isActive ? "Ẩn mã" : "Hiển thị mã"}
                              onClick={() => handleToggleActive(coupon._id)}
                            >
                              {isActive ? (
                                <Eye className="h-4 w-4" />
                              ) : (
                                <EyeOff className="h-4 w-4" />
                              )}
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              title="Chỉnh sửa"
                              onClick={() => handleEditCoupon(coupon)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              title="Xoá"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDeleteCoupon(coupon)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Add/Edit Dialog */}
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <CreateNewCoupon setOpenDialog={setOpenDialog} />
        </Dialog>

        <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
          {selectedCoupon && (
            <EditCoupon coupon={selectedCoupon} setOpenEditDialog={setOpenEditDialog} />
          )}
        </Dialog>
        <Dialog open={openDeleteDialog} onOpenChange={setDeleteDialogOpen}>
          {selectedCoupon && (
            <DeleteCoupon selectedCoupon={selectedCoupon} setDeleteDialogOpen={setDeleteDialogOpen} />
          )}
        </Dialog>
      </div>
    </div>
  )
}
