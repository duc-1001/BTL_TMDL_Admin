"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { getOrderShippingInfo } from "@/services/order.service"
import VerifyOrder from "@/components/order/verify-order"
import DetailOrderTab from "@/components/order/detail-order-tab"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TabsContent } from "@radix-ui/react-tabs"
import RefundSectionTab from "@/components/order/refund-section-tab"
import { queryClient } from "@/components/QueryClientProviders"

export default function OrderDetailPage({ orderCode }: { orderCode: string }) {

  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [activeTab, setActiveTab] = useState("detail")
  const [codeError, setCodeError] = useState<string | null>(null)

  const { data, isLoading, refetch, error } = useQuery({
    queryKey: ["order-detail", orderCode, token],
    queryFn: () => getOrderShippingInfo(orderCode!, token!),
    enabled: !!orderCode,
    retry: (failureCount, error: any) => {
      if (error?.status === 401) return false
      if (error?.status === 400) return false
      return failureCount < 2
    }
  })

  const handleRefundSuccess = () => {
    queryClient.setQueryData(["order-detail", orderCode, token], (oldData: any) => {
      if (!oldData) return oldData
      return {
        ...oldData,
        refundStatus: "pending",
      }
    })
  }

  useEffect(() => {
    if (error && typeof error === "object") {
      const code = (error as any)?.code
      if (code !== codeError) {
        setCodeError(code)
      }
    }
  }, [error, codeError, setCodeError])
  
  if (isLoading) {
    return <div className="min-h-screen bg-background">Loading...</div>
  }


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

  if (
    codeError === "VIEW_TOKEN_REQUIRED" ||
    codeError === "VIEW_TOKEN_INVALID" ||
    codeError === "VIEW_TOKEN_EXPIRED"
  ) {
    return (
      <div className="-translate-y-20">
        <VerifyOrder orderCode={orderCode} />
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">

        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/orders">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại danh sách đơn hàng
          </Link>
        </Button>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {(data?.status === "delivered" || data?.status === "completed") && (
            <TabsList className="w-full sticky z-10">
              <TabsTrigger value="detail">Chi tiết đơn</TabsTrigger>
              <TabsTrigger value="refund">Hoàn tiền</TabsTrigger>
            </TabsList>
          )}

          <TabsContent value="detail">
            <DetailOrderTab
              data={data!}
              refetch={refetch}
              setActiveTab={setActiveTab}
            />
          </TabsContent>

          {(data?.status === "delivered" || data?.status === "completed") && (
            <TabsContent value="refund">
              <RefundSectionTab
                order={data!}
                tab={activeTab}
                handleRefundSuccess={handleRefundSuccess}
                setCodeError={setCodeError}
                token={token!}
              />
            </TabsContent>
          )}
        </Tabs>

      </div>
    </div>
  )
}