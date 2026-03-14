"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"

import { checkCanRefundOrder, getOrderShippingInfo } from "@/services/order.service"
import VerifyOrder from "@/components/order/verify-order"
import DetailOrderTab from "@/components/order/detail-order-tab"
import RefundSectionTab from "@/components/order/refund-section-tab"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { queryClient } from "@/components/QueryClientProviders"

export default function OrderDetailPage({ orderCode }: { orderCode: string }) {
  const pathName = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const token = searchParams.get("token")

  const initialTab =
    searchParams.get("tab") === "refund" ? "refund" : "detail"

  const [activeTab, setActiveTab] = useState(initialTab)

  useEffect(() => {
    setActiveTab(initialTab)
  }, [initialTab])

  const handleChangeTab = (tab: string) => {
    setActiveTab(tab)

    const params = new URLSearchParams(searchParams.toString())
    params.set("tab", tab)

    router.replace(`${pathName}?${params.toString()}`)
  }

  const [codeError, setCodeError] = useState<string | null>(null)

  // Order detail query
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: ["order-detail", orderCode, token],
    queryFn: () => getOrderShippingInfo(orderCode, token!),
    enabled: !!orderCode,
    retry: (failureCount, error: any) => {
      if (error?.status === 401) return false
      if (error?.status === 400) return false
      return failureCount < 2
    }
  })

  // Check refund query
  const {
    data: canRefundData,
    error: canRefundError
  } = useQuery({
    queryKey: ["can-create-refund", orderCode, token],
    queryFn: () => checkCanRefundOrder(orderCode, token!),
    enabled: !!orderCode
  })

  const handleRefundSuccess = () => {
    queryClient.setQueryData(
      ["order-detail", orderCode, token],
      (oldData: any) => {
        if (!oldData) return oldData

        return {
          ...oldData,
          refundStatus: "pending"
        }
      }
    )
  }

  // Handle error code
  useEffect(() => {
    const err: any = error || canRefundError

    if (err && typeof err === "object") {
      const code = err?.code
      if (code !== codeError) {
        setCodeError(code)
      }
    }
  }, [error, canRefundError])

  // Loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        Loading...
      </div>
    )
  }

  // Order not found
  if (codeError === "ORDER_NOT_FOUND") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <XCircle className="mx-auto mb-4 text-red-500" size={48} />

          <h2 className="text-2xl font-semibold">
            Đơn hàng không tồn tại
          </h2>

          <p className="text-muted-foreground mt-2">
            Đơn hàng bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>

          <Button variant="outline" className="mt-6" asChild>
            <Link href="/orders">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại danh sách đơn hàng
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  // Verify order
  if (
    codeError === "VIEW_TOKEN_REQUIRED" ||
    codeError === "VIEW_TOKEN_INVALID" ||
    codeError === "VIEW_TOKEN_EXPIRED"
  ) {
    return (
      <div className="-translate-y-20">
        <VerifyOrder code={orderCode} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">

        {/* Back button */}
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/orders">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại danh sách đơn hàng
          </Link>
        </Button>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={handleChangeTab}>

          <TabsList className="w-full sticky top-0 z-10">
            <TabsTrigger value="detail">
              Chi tiết đơn
            </TabsTrigger>

            <TabsTrigger value="refund">
              Hoàn tiền
            </TabsTrigger>
          </TabsList>

          {/* Detail tab */}
          <TabsContent value="detail">
            <DetailOrderTab
              data={data!}
              refetch={refetch}
              setActiveTab={setActiveTab}
            />
          </TabsContent>

          {/* Refund tab */}
          <TabsContent value="refund">
            <RefundSectionTab
              codeError={codeError}
              order={data!}
              canCreateRefund={canRefundData?.canRefund || false}
              tab={activeTab}
              handleRefundSuccess={handleRefundSuccess}
              setCodeError={setCodeError}
              token={token!}
            />
          </TabsContent>

        </Tabs>
      </div>
    </div>
  )
}