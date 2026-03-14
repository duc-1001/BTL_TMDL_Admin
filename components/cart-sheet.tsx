"use client"

import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Plus, Minus, X, ShoppingBag, Circle, CircleAlert } from "lucide-react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { calculateCartPricing, getCart, getGuestCart } from "@/services/cart.service"
import { formatPrice } from "@/lib/utils"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { useCartActions } from "@/hooks/use-cart-actions"
import { useRouter } from "next/navigation"

export function CartSheet() {
  const router = useRouter();
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

  const { data: discountData } = useQuery({
    queryKey: ["cart-pricing"],
    queryFn: () => {
      const items = isAuthenticated ? [] : JSON.parse(localStorage.getItem("guest-cart") || "[]")
      const discounts = isAuthenticated ? [] : (JSON.parse(localStorage.getItem("guest-discounts") || "[]") as string[]);
      return calculateCartPricing(items, discounts, { provinceCode: 0, wardCode: 0 })
    },
  })

  const { updateQuantity, removeItem } = useCartActions(isAuthenticated)

  const subtotal = discountData?.subtotal || 0
  const totalItems = data?.items.length || 0

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-1 text-white -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col p-2">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Giỏ hàng ({totalItems} sản phẩm)
          </SheetTitle>
        </SheetHeader>

        {data?.items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Giỏ hàng trống</h3>
              <p className="text-sm text-muted-foreground">Thêm sản phẩm vào giỏ để tiếp tục mua sắm</p>
            </div>
            <Button asChild>
              <Link className={'text-white'} href="/products">Khám phá sản phẩm</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto -mx-6 px-6">
              <div className="space-y-4 py-4">
                {data?.items.map((item) => {
                  const isOutOfStock = item.isOutOfStock || item.availableStock === 0
                  const exceedStock = item.quantity > item.availableStock

                  return (
                    <div
                      key={item.productId}
                      className={`flex gap-4 p-3 rounded-xl border transition ${isOutOfStock
                          ? "bg-red-50 border-red-200"
                          : exceedStock
                            ? "bg-yellow-50 border-yellow-200"
                            : "bg-white"
                        }`}
                    >
                      {/* IMAGE */}
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0 relative">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className={`h-full m-auto object-cover ${isOutOfStock ? "opacity-50 grayscale" : ""
                            }`}
                        />

                        {isOutOfStock && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-semibold">
                            Hết hàng
                          </div>
                        )}
                      </div>

                      {/* INFO */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-medium line-clamp-2">
                            {item.name}
                          </h4>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 flex-shrink-0"
                            onClick={() => removeItem(item.productId)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-orange-500">
                            {formatPrice(item.price)}
                          </span>

                          {/* QUANTITY CONTROL */}
                          <div className="flex items-center border rounded-lg">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              disabled={isOutOfStock}
                              onClick={() => {
                                if (item.quantity > 1) {
                                  updateQuantity(item.productId, item.quantity - 1)
                                } else {
                                  removeItem(item.productId)
                                }
                              }}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>

                            <span className="w-10 text-center text-sm font-medium">
                              {item.quantity}
                            </span>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              disabled={
                                isOutOfStock ||
                                item.quantity >= item.availableStock
                              }
                              onClick={() => {
                                updateQuantity(item.productId, item.quantity + 1)
                              }}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        {/* STOCK WARNING */}
                        {!isOutOfStock && item.availableStock <= 5 && (
                          <p className="text-xs text-yellow-600 mt-2 flex items-center gap-1">
                            <CircleAlert className="h-3 w-3" />
                            Chỉ còn {item.availableStock} sản phẩm
                          </p>
                        )}

                        {exceedStock && (
                          <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                            <CircleAlert className="h-3 w-3" />
                            Số lượng vượt quá tồn kho
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Tạm tính</span>
                <span className="text-orange-500">{formatPrice(subtotal)}</span>
              </div>

              <div className="flex gap-2">
                <SheetClose asChild>
                  <Button variant="outline" asChild className="flex-1 bg-transparent">
                    <Link href="/products">Tiếp tục mua</Link>
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button asChild className="flex-1">
                    <Link href="/checkout" className={"text-white"}>Thanh toán</Link>
                  </Button>
                </SheetClose>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
