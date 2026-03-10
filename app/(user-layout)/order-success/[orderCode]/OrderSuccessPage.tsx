"use client"

import React from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

import {
  CheckCircle2,
  CreditCard,
  Truck,
  Copy,
  ArrowRight,
  Wallet,
} from "lucide-react"

import { getOrderSuccessByCode } from "@/services/order.service"
import { formatDateTime } from "@/lib/utils"
import { OrderItemRow } from "@/components/order/order-item-row"

/* ================= utils ================= */

const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price)

/* ================= types ================= */

interface OrderSuccessPageProps {
  orderCode: string
}

/* ================= page ================= */

const OrderSuccessPage = ({ orderCode }: OrderSuccessPageProps) => {
  const { data } = useQuery({
    queryKey: ["order", orderCode],
    queryFn: () => getOrderSuccessByCode(orderCode),
    enabled: !!orderCode,
    refetchInterval: 10_000, // auto check payment mỗi 10s
  })

  if (!data) return null

  const { orderCode: code, totalAmount, payment, shippingAddress, createdAt, items } = data

  /* ---------- payment state ---------- */
  const isCOD = payment.method === "cod"
  const isOnline = payment.method === "banking" || payment.method === "momo"
  const isPaid = payment.status === "paid"
  const isUnpaidOnline = isOnline && !isPaid

  const paymentMethodLabel = {
    cod: "Thanh toán khi nhận hàng",
    banking: "Chuyển khoản ngân hàng",
    momo: "Ví MoMo",
  }[payment.method]

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Đã sao chép")
  }

  /* ================= render ================= */

  return (
    <div className="min-h-screen bg-muted/30 py-10 sm:py-16">
      <div className="container m-auto max-w-3xl px-4">
        <Card className="overflow-hidden shadow-lg border">
          <CardContent className="p-0">
            {/* ================= Header ================= */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 sm:px-10 py-10 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                <CheckCircle2 className="h-9 w-9" />
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                Đặt hàng thành công
              </h1>

              <p className="text-white/90 text-sm sm:text-base">
                Cảm ơn bạn đã mua hàng tại <b>Snack Việt</b>
              </p>

              <div className="mt-4 inline-flex items-center gap-2 bg-white/15 px-4 py-2 rounded-xl">
                <span className="text-sm">Mã đơn:</span>
                <span className="font-mono font-semibold break-all">
                  #{code}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-white"
                  onClick={() => copyToClipboard(code)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* ================= Body ================= */}
            <div className="p-6 sm:p-10 space-y-8">
              {/* ================= Payment status ================= */}
              <div
                className={`rounded-xl px-5 py-4 border ${isCOD || isPaid
                    ? "bg-green-50 border-green-200"
                    : "bg-yellow-50 border-yellow-200"
                  }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-orange-500" />
                    <p className="font-semibold">Thanh toán</p>
                  </div>

                  <Badge
                    variant="outline"
                    className={`font-semibold ${isCOD || isPaid
                        ? "border-green-400 text-green-600"
                        : "border-yellow-400 text-yellow-600"
                      }`}
                  >
                    {isCOD
                      ? "Thanh toán khi nhận hàng"
                      : isPaid
                        ? "Đã thanh toán"
                        : "Chờ thanh toán"}
                  </Badge>
                </div>

                {/* ===== Online unpaid message ===== */}
                {isUnpaidOnline && (
                  <div className="mt-3 text-sm text-muted-foreground">
                    Vui lòng hoàn tất thanh toán để đơn hàng được xử lý.
                  </div>
                )}
              </div>

              {/* ================= QR PAYMENT ================= */}
              {isUnpaidOnline && payment.qrBase64 && (
                <div className="border rounded-xl p-5 bg-white space-y-4">
                  <h3 className="font-semibold flex items-center gap-2 text-orange-600">
                    <Wallet className="h-5 w-5" />
                    Hướng dẫn thanh toán
                  </h3>

                  <div className="flex flex-col sm:flex-row gap-6 items-center">
                    <img
                      src={`data:image/png;base64,${payment.qrBase64}`}
                      alt="QR thanh toán"
                      className="w-44 h-44 border rounded-lg"
                    />

                    <div className="text-sm space-y-3">
                      <p className="text-muted-foreground">
                        Quét mã QR bằng ứng dụng ngân hàng / MoMo để thanh toán.
                      </p>

                      <div className="bg-muted/40 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground">
                          Nội dung chuyển khoản
                        </p>
                        <p className="font-mono font-semibold break-all">
                          {payment.qrPayload}
                        </p>
                      </div>

                      <p className="text-xs text-orange-600">
                        ⚠️ Chuyển đúng số tiền & nội dung để hệ thống tự động xác
                        nhận.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= Order info ================= */}
              <div className="border rounded-xl p-5 bg-white shadow-sm space-y-5">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Truck className="h-5 w-5 text-orange-500" />
                  Thông tin đơn hàng
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <InfoRow label="Tổng tiền">
                    <span className="font-bold text-orange-500">
                      {formatPrice(totalAmount)}
                    </span>
                  </InfoRow>

                  <InfoRow label="Phương thức">
                    {paymentMethodLabel}
                  </InfoRow>

                  <InfoRow label="Khách hàng">
                    {shippingAddress.fullName}
                  </InfoRow>

                  <InfoRow label="Số điện thoại">
                    {shippingAddress.phone}
                  </InfoRow>
                </div>

                <Separator />

                <div className="text-sm space-y-1">
                  <p className="text-muted-foreground">Địa chỉ giao hàng</p>
                  <p className="font-semibold break-words">
                    {shippingAddress.address + ", " + shippingAddress.ward?.name + ", " + shippingAddress.province?.name}
                  </p>
                </div>

                <Separator />

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Thời gian đặt</span>
                  <span className="font-semibold">
                    {formatDateTime(createdAt)}
                  </span>
                </div>
              </div>

              {/* ================= Order items ================= */}
              <div className="border rounded-xl p-5 bg-white shadow-sm space-y-4">
                <h2 className="text-lg font-semibold">
                  Sản phẩm đã mua
                </h2>

                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {items.map((item) => (
                    <OrderItemRow
                      key={item.productId}
                      item={item}
                    />
                  ))}
                </div>
              </div>


              {/* ================= Actions ================= */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild variant="outline" size="lg">
                  <Link href="/">Về trang chủ</Link>
                </Button>

                <Button asChild size="lg">
                  <Link href={`/orders/${code}?token=${data.viewToken}`}>
                    Xem đơn hàng
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Cần hỗ trợ? Vui lòng liên hệ hotline hoặc fanpage Snack Việt.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

/* ================= sub component ================= */

const InfoRow = ({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) => (
  <div className="flex justify-between bg-muted/40 rounded-lg px-4 py-3">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-semibold text-right break-words">{children}</span>
  </div>
)

export default OrderSuccessPage
