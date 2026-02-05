"use client"

import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import Link from "next/link"
import { useCartActions } from "@/hooks/use-cart-actions"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { useQuery } from "@tanstack/react-query"
import { calculateCartPricing, getCart, getGuestCart } from "@/services/cart.service"
import { formatPrice } from "@/lib/utils"

export default function CartPage() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const cartQueryKey = isAuthenticated
    ? ["user-cart"]
    : ["guest-cart"]
  const { data, isLoading } = useQuery({
    queryKey: cartQueryKey,
    queryFn: () => {
      if (isAuthenticated) {
        return getCart()
      }
      else {
        const items = JSON.parse(localStorage.getItem("guest-cart") || "[]")
        return getGuestCart(items)
      }
    },
  })

  const { updateQuantity, removeItem } = useCartActions(isAuthenticated)

  const { data: discountData } = useQuery({
    queryKey: ["cart-pricing"],
    queryFn: () => {
      const items = isAuthenticated ? [] : JSON.parse(localStorage.getItem("guest-cart") || "[]")
      const coupons = isAuthenticated ? [] : (JSON.parse(localStorage.getItem("guest-coupons") || "[]") as string[]);
      return calculateCartPricing(items, coupons)
    },
  })

  const totalItems = data?.items.length || 0
  const subtotal = discountData?.subtotal || 0
  const discountDiscount = discountData?.discountDiscount || 0
  const total = discountData?.totalPrice || 0

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Đang tải giỏ hàng...</div>
  }

  if (totalItems === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto text-center">
            <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Giỏ hàng trống</h2>
            <p className="text-muted-foreground mb-6">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
            <Button asChild size="lg">
              <Link href="/products">Khám phá sản phẩm</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Giỏ hàng của bạn</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {data?.items.map((item) => (
              <Card key={item.productId}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="relative h-24 w-24 shrink-0 rounded-lg overflow-hidden bg-muted">
                      <img src={item.image || "/placeholder.svg"} alt={item.name}  className="object-cover h-full m-auto" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold mb-1">{item.name}</h3>
                      <p className="text-lg font-bold text-primary">{item.price.toLocaleString("vi-VN")}đ</p>

                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-transparent"
                            onClick={() => {
                              if (item.quantity > 1) {
                                updateQuantity(item.productId, item.quantity - 1)
                              }
                              else {
                                removeItem(item.productId)
                              }
                            }}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-transparent"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => removeItem(item.productId)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Xóa
                        </Button>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-lg">{(item.price * item.quantity).toLocaleString("vi-VN")}đ</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-32">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Tóm tắt đơn hàng</h2>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tạm tính</span>
                    <span>{subtotal.toLocaleString("vi-VN")}đ</span>
                  </div>
                  {/* <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Phí vận chuyển</span>
                    <span>{shipping === 0 ? "Miễn phí" : `${shipping.toLocaleString("vi-VN")}đ`}</span>
                  </div> */}
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between text-lg font-bold mb-6">
                  <span>Tổng cộng</span>
                  <span className="text-primary">{total.toLocaleString("vi-VN")}đ</span>
                </div>

                <Button asChild size="lg" className="w-full">
                  <Link href="/checkout">Thanh toán</Link>
                </Button>

              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
