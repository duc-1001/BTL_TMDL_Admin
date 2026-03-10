"use client"

import React from "react"
import Image from "next/image"
import { useQuery } from "@tanstack/react-query"
import { formatPrice } from "@/lib/utils"
import { getRefundDetails } from "@/services/refund.service"
import { OrderShippingInfo } from "@/types/order"
import { RefundUserDetail } from "@/types/refund"
import { Clock, Package, Receipt, Banknote, AlertCircle } from "lucide-react"

interface RefundDetailProps {
  order: OrderShippingInfo
  viewToken: string
}

const RefundDetail = ({ order, viewToken }: RefundDetailProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["refundDetail", order.orderCode, viewToken],
    queryFn: () => getRefundDetails(order.orderCode, viewToken),
    enabled:
      order.status === "delivered" ||
      order.status === "completed" ||
      order.refundStatus !== "none",
  })

  const refund = data as RefundUserDetail | undefined

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-gray-500">
        Đang tải thông tin hoàn tiền...
      </div>
    )
  }

  if (error || !refund) {
    return (
      <div className="text-center py-10 text-gray-500">
        Không tìm thấy thông tin yêu cầu hoàn tiền
      </div>
    )
  }

  const statusColorMap: Record<string, string> = {
    pending: "text-amber-600 bg-amber-50",
    approved: "text-green-600 bg-green-50",
    rejected: "text-red-600 bg-red-50",
    processing: "text-blue-600 bg-blue-50",
    completed: "text-emerald-600 bg-emerald-50",
  }

  const statusBadgeClass =
    statusColorMap[refund.status?.toLowerCase()] ||
    "text-gray-600 bg-gray-100"

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* HEADER */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-start flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Yêu cầu hoàn tiền #{refund.orderCode}
            </h2>

            <p className="flex items-center gap-1 text-sm text-gray-500 mt-1">
              <Clock size={14} />
              {new Date(refund.createdAt).toLocaleString("vi-VN")}
            </p>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadgeClass}`}
          >
            {refund.status}
          </span>
        </div>
      </div>

      {/* BODY */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">

        {/* LEFT COLUMN */}
        <div className="space-y-6">

          {/* REASON */}
          <div className="bg-white border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle size={18} />
              <h3 className="font-semibold">Lý do hoàn tiền</h3>
            </div>

            <p className="text-gray-700">{refund.reason}</p>

            {refund.note && (
              <div className="mt-4 bg-gray-50 p-4 rounded-lg border">
                <p className="text-sm text-gray-500">Ghi chú</p>
                <p>{refund.note}</p>
              </div>
            )}
          </div>

          {/* PRODUCTS */}
          <div className="bg-white border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Package size={18} />
              <h3 className="font-semibold">Sản phẩm yêu cầu hoàn</h3>
            </div>

            <div className="space-y-4">
              {refund.items.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-4 p-4 border rounded-lg hover:bg-gray-50 transition"
                >
                  <Image
                    src={item.image?.url || "/placeholder.png"}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="rounded-md object-cover"
                  />

                  <div className="flex-1">
                    <p className="font-medium line-clamp-2">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      SL hoàn: {item.quantity}
                    </p>
                  </div>

                  <div className="font-semibold">
                    {formatPrice(item.price)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* IMAGES */}
          {refund.images?.length > 0 && (
            <div className="bg-white border rounded-xl p-6">
              <h3 className="font-semibold mb-4">Ảnh minh chứng</h3>

              <div className="grid grid-cols-4 gap-3">
                {refund.images.map((img) => (
                  <div
                    key={img.imagePublicId}
                    className="relative aspect-square rounded-md overflow-hidden border"
                  >
                    <Image
                      src={img.url}
                      alt="refund"
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">

          {/* PAYMENT */}
          <div className="bg-white border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Banknote size={18} />
              <h3 className="font-semibold">Phương thức hoàn</h3>
            </div>

            {refund.refundDestination === "bank" && refund.refundBankInfo ? (
              <div className="text-sm space-y-1">
                <p>Ngân hàng: {refund.refundBankInfo.bankName}</p>
                <p>Số TK: {refund.refundBankInfo.accountNumber}</p>
                <p>Chủ TK: {refund.refundBankInfo.accountHolder}</p>
              </div>
            ) : (
              <p className="text-sm">
                Hoàn về phương thức thanh toán ban đầu
              </p>
            )}
          </div>

          {/* MONEY */}
          <div className="bg-white border rounded-xl p-6 sticky top-32">

            <div className="flex items-center gap-2 mb-4">
              <Receipt size={18} />
              <h3 className="font-semibold">Chi tiết hoàn tiền</h3>
            </div>

            <div className="space-y-2 text-sm">

              <div className="flex justify-between">
                <span>Tiền sản phẩm</span>
                <span>
                  {formatPrice(refund.refundAmountData.itemRefund)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Phí vận chuyển</span>
                <span>
                  {formatPrice(refund.refundAmountData.shippingRefund)}
                </span>
              </div>

              <div className="border-t pt-3 flex justify-between font-bold text-green-600 text-lg">
                <span>Tổng tiền hoàn</span>
                <span>
                  {formatPrice(refund.refundAmountData.totalRefund)}
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default RefundDetail