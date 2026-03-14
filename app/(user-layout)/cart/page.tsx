"use client"

import { Trash2, Plus, Minus, ShoppingBag, Tag, X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import Link from "next/link"
import { useCartActions } from "@/hooks/use-cart-actions"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { useQuery } from "@tanstack/react-query"
import { applyDiscountToCart, calculateCartPricing, getCart, getGuestCart, removeDiscountFromCart } from "@/services/cart.service"
import { formatPrice } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useState } from "react"
import DiscountSelection from "@/components/checkout/discount-selection"
import { Input } from "@/components/ui/input"
import { queryClient } from "@/components/QueryClientProviders"
import ApplyDiscountCard from "@/components/checkout/apply-discount-card"
import { Badge } from "@/components/ui/badge"

export default function CartPage() {
  const [showDiscountDialog, setShowDiscountDialog] = useState(false);
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
      const discounts = isAuthenticated ? [] : (JSON.parse(localStorage.getItem("guest-discounts") || "[]") as string[]);
      return calculateCartPricing(items, discounts, { provinceCode: 0, wardCode: 0 })
    },
  })

  const cartItems = data?.items || []
  const totalItems = data?.items.length || 0
  const subtotal = discountData?.subtotal || 0
  const total = discountData?.totalPrice || 0
  const appliedDiscounts = discountData?.appliedDiscounts || []

  const handleRemoveDiscount = async (code: string) => {
    if (!isAuthenticated) {
      const discounts = localStorage.getItem("guest-discounts") ? new Set(JSON.parse(localStorage.getItem("guest-discounts") || "[]")) : new Set<string>();
      discounts.delete(code);
      localStorage.setItem("guest-discounts", JSON.stringify(Array.from(discounts)));
    }
    else {
      await removeDiscountFromCart(code, cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,

      })));
    }
    queryClient.invalidateQueries({ queryKey: ["cart-pricing"], exact: false });
  }

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
              <Link href="/products" className="text-white">Khám phá sản phẩm</Link>
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
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card
                key={item.productId}
                className={`transition ${item.isOutOfStock
                    ? "border-red-300 bg-red-50/40"
                    : "hover:shadow-md"
                  }`}
              >
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-semibold">{item.name}</h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.productId)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>

                      <p className="font-bold text-orange-500 mt-1">
                        {formatPrice(item.price)}
                      </p>

                      {/* STOCK STATUS */}
                      {item.isOutOfStock ? (
                        <Badge variant="destructive" className="mt-2">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Hết hàng
                        </Badge>
                      ) : (
                        <p className="text-xs text-muted-foreground mt-2">
                          Còn {item.availableStock} sản phẩm
                        </p>
                      )}

                      {/* QUANTITY */}
                      <div className="flex items-center gap-2 mt-3">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            item.quantity > 1
                              ? updateQuantity(
                                item.productId,
                                item.quantity - 1
                              )
                              : removeItem(item.productId)
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>

                        <span className="w-8 text-center">
                          {item.quantity}
                        </span>

                        <Button
                          variant="outline"
                          size="icon"
                          disabled={
                            item.isOutOfStock ||
                            item.quantity >= item.availableStock
                          }
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.quantity + 1
                            )
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="text-right font-bold">
                      {formatPrice(item.price * item.quantity)}
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

              <div className="space-y-2">
                <Button
                  type="button"
                  onClick={() => setShowDiscountDialog(true)}
                  variant="ghost"
                  className="w-full justify-start text-muted-foreground text-xs h-8 bg-transparent"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  Xem mã khuyến mãi
                </Button>
                <DiscountSelection
                  showDiscountDialog={showDiscountDialog}
                  setShowDiscountDialog={setShowDiscountDialog}
                  subtotal={subtotal}
                  provinceCode={0}
                  wardCode={0}
                />
              </div>
              <Separator className="my-4" />

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tạm tính</span>
                  <span>{subtotal.toLocaleString("vi-VN")}đ</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Phí vận chuyển</span>
                  <span>----</span>
                </div>
                {appliedDiscounts.length > 0 && (
                  <div className="flex flex-col gap-2">
                    {appliedDiscounts.map((discount, idx) => (
                      <ApplyDiscountCard key={discount.code || idx} discount={discount} handleRemoveDiscount={handleRemoveDiscount} />
                    ))}
                  </div>
                )}
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between text-lg font-bold mb-6">
                <span>Tổng cộng</span>
                <span className="text-orange-500">{total.toLocaleString("vi-VN")}đ</span>
              </div>

              <Button asChild size="lg" className="w-full text-white">
                <Link href="/checkout">Thanh toán</Link>
              </Button>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </div >
  )
}
