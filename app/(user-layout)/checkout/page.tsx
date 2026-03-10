"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Wallet, Building2, MapPin, Phone, Mail, User, Tag, } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { useQuery } from "@tanstack/react-query"
import { calculateCartPricing, getCart, getGuestCart, removeDiscountFromCart } from "@/services/cart.service"
import { getProvinces, Province, Ward, getWardsByProvince } from "@/lib/address"
import { formatPrice } from "@/lib/utils"
import { Controller, useForm } from "react-hook-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js"
import { ScrollArea } from "@/components/ui/scroll-area"
import AddressSelection from "@/components/checkout/address-selection"
import { toast } from "sonner"
import DiscountSelection from "@/components/checkout/discount-selection"
import { queryClient } from "@/components/QueryClientProviders"
import ApplyDiscountCard from "@/components/checkout/apply-discount-card"
import { OrderPayload } from "@/types/order"
import { createOrder } from "@/services/order.service"
import { useCartActions } from "@/hooks/use-cart-actions"
import { useRouter } from "next/navigation"

const inforUserChema = z.object({
  fullName: z.string().min(2, "Họ và tên phải có ít nhất 2 ký tự"),
  phone: z.string().min(10, "Số điện thoại không hợp lệ"),
  email: z.string().email("Email không hợp lệ").optional(),
  address: z.string().min(5, "Địa chỉ giao hàng phải có ít nhất 5 ký tự"),
  province: z.object({
    code: z.string().min(1, "Vui lòng chọn tỉnh/thành phố"),
    name: z.string(),
  }),
  ward: z.object({
    code: z.string().min(1, "Vui lòng chọn phường/xã"),
    name: z.string(),
  }),
  note: z.string().optional(),
})

export type InforUserCheckout = z.infer<typeof inforUserChema>

export default function CheckoutPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)
  const { clearCartAction } = useCartActions(isAuthenticated)
  const cartQueryKey = isAuthenticated ? ['user-cart'] : ['guest-cart']
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

  const [showAddressDialog, setShowAddressDialog] = useState(false)
  const [showDiscountDialog, setShowDiscountDialog] = useState(false)
  const [provinces, setProvinces] = useState<Province[]>([])
  const [wards, setWards] = useState<Ward[]>([])


  useEffect(() => {
    getProvinces().then(setProvinces)
  }, [])

  const {
    register,
    control,
    formState: { errors },
    resetField,
    reset,
    watch,
  } = useForm<InforUserCheckout>({
    resolver: zodResolver(inforUserChema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      address: "",
      province: { code: "", name: "" },
      ward: { code: "", name: "" },
      note: "",
    },
  })
  const provinceCode = Number(watch("province")?.code) || 0
  const wardCode = Number(watch("ward")?.code) || 0

  const { data: discountData, isLoading: isLoadingDiscount } = useQuery({
    queryKey: ["cart-pricing", wardCode],
    queryFn: () => {
      const items = isAuthenticated ? [] : JSON.parse(localStorage.getItem("guest-cart") || "[]")
      const discounts = isAuthenticated ? [] : (JSON.parse(localStorage.getItem("guest-discounts") || "[]") as string[]);
      return calculateCartPricing(items, discounts, { provinceCode: Number(provinceCode), wardCode: Number(wardCode) })
    },
  })

  const addresses = user?.addresses || []
  const cartItems = data?.items || []
  const subtotal = discountData?.subtotal || 0
  const total = discountData?.totalPrice || 0
  const appliedDiscounts = discountData?.appliedDiscounts || []
  const shipping = (discountData?.shippingFee || 0) - (discountData?.shippingDiscount || 0)

  useEffect(() => {
    if (!isAuthenticated || !user) return

    const defaultAddress = user.addresses.find(address => address.isDefault) || user.addresses[0]
    if (defaultAddress) {
      reset({
        fullName: defaultAddress.receiver,
        phone: defaultAddress.phone,
        email: user?.email || "",
        address: defaultAddress.street,
        province: defaultAddress.province,
        ward: defaultAddress.ward,
        note: "",
      })
      getWardsByProvince(Number(defaultAddress.province.code)).then(setWards)
    }
  }, [addresses, reset])

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
      })))
    }
    queryClient.invalidateQueries({ queryKey: ["cart-pricing"], exact: false });
  }

  const handleSelectAddress = (address: any) => {
    reset({
      fullName: address.receiver,
      phone: address.phone,
      email: user?.email || "",
      address: address.street,
      province: address.province,
      ward: address.ward,
      note: "",
    })
    getWardsByProvince(Number(address.province.code)).then(setWards)
    setShowAddressDialog(false)
  }
  const [paymentMethod, setPaymentMethod] = useState<"banking" | "cod" | "momo">("cod")
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload: OrderPayload = {
      items: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      couponCodes: appliedDiscounts.map((discount) => discount.code),
      shippingAddress: {
        fullName: watch("fullName"),
        phone: watch("phone"),
        email: watch("email"),
        address: watch("address"),
        province: watch("province"),
        ward: watch("ward"),
        note: watch("note"),
      },
      paymentMethod: paymentMethod,
    }

    try {
      setIsProcessing(true)
      const response = await createOrder(payload)

      if (!response?.orderCode) {
        toast.error("Đặt hàng thất bại. Không lấy được mã đơn hàng.")
        return
      }

      const orderCode = response.orderCode
      toast.success("Đặt hàng thành công!")
      router.push(`/order-success/${orderCode}`)
      await clearCartAction()

    } catch (error: any) {
      if (error?.code) {
        toast.error(error?.message || `Đặt hàng thất bại với mã lỗi: ${error.code}`)
        await handleRemoveDiscount(error.code)
        return
      }
      toast.error(error?.message || "Đặt hàng thất bại. Vui lòng thử lại sau.")
    }
    finally {
      setIsProcessing(false)
    }
  }

  const hasInvalidItem = cartItems.some(
    item => item.isOutOfStock || item.quantity > item.availableStock
  )

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Thanh toán</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/" className="hover:text-orange-500">
                  Trang chủ
                </Link>
                <span>/</span>
                <Link href="/cart" className="hover:text-orange-500">
                  Giỏ hàng
                </Link>
                <span>/</span>
                <span className="text-foreground">Thanh toán</span>
              </div>
            </div>

            <form onSubmit={handlePlaceOrder}>
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  {/* Shipping Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-orange-500" />
                          Thông tin giao hàng
                        </div>
                        {
                          isAuthenticated &&
                          <div onClick={() => {
                            if (!isAuthenticated) return
                            setShowAddressDialog(true)
                          }} className="text-sm text-orange-600 underline cursor-pointer">
                            Sử dụng địa chỉ đã lưu
                          </div>
                        }
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">
                            Họ và tên <span className="text-destructive">*</span>
                          </Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="fullName" placeholder="Nguyễn Văn A" className="pl-10" required {...register("fullName")} />
                            {errors.fullName && (<p className="text-xs font-medium text-red-500 mt-1">{errors.fullName.message}</p>)}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">
                            Số điện thoại <span className="text-destructive">*</span>
                          </Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="phone" type="tel" placeholder="0912 345 678" className="pl-10" required {...register("phone")} />
                            {errors.phone && (<p className="text-xs font-medium text-red-500 mt-1">{errors.phone.message}</p>)}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input id="email" type="email" placeholder="nguyenvana@email.com" className="pl-10" {...register("email")} />
                          {errors.email && (<p className="text-xs font-medium text-red-500 mt-1">{errors.email.message}</p>)}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">

                        {/* Province */}
                        <div>
                          <Label className="mb-3">Tỉnh / Thành phố <span className="text-destructive">*</span></Label>
                          <Controller
                            control={control}
                            name="province"
                            render={({ field }) => (
                              <Select
                                value={field.value?.code ? String(field.value.code) : undefined}
                                onValueChange={(value) => {
                                  const p = provinces.find(province => province.code === Number(value));
                                  console.log(p);

                                  if (p) {
                                    field.onChange({ code: String(p.code), name: p.name });
                                    getWardsByProvince(Number(p.code)).then(setWards);
                                    resetField("ward");
                                  }
                                }}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Chọn tỉnh / thành phố" />
                                </SelectTrigger>
                                <SelectContent position="popper" sideOffset={4}>
                                  <ScrollArea className="h-48">
                                    {provinces.map((p) => (
                                      <SelectItem key={p.code} value={String(p.code)}>
                                        {p.name}
                                      </SelectItem>
                                    ))}
                                  </ScrollArea>
                                </SelectContent>
                              </Select>
                            )}
                          />
                          {errors.province?.code?.message && (<p className="text-xs font-medium text-red-500 mt-1">{errors.province.code.message}</p>)}
                        </div>


                        {/* Ward */}
                        <div>
                          <Label className="mb-3">Phường / Xã <span className="text-destructive">*</span></Label>
                          <Controller
                            control={control}
                            name="ward"
                            render={({ field }) => (
                              <Select
                                value={field.value?.code ? String(field.value.code) : undefined}
                                onValueChange={(value) => {
                                  const w = wards.find(ward => ward.code === Number(value));
                                  if (w) {
                                    field.onChange({ code: String(w.code), name: w.name });
                                  }
                                }}
                                disabled={!wards.length}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Chọn phường / xã" />
                                </SelectTrigger>
                                <SelectContent position="popper" sideOffset={4}>
                                  <ScrollArea className="h-48">
                                    {wards.map((w) => (
                                      <SelectItem key={w.code} value={String(w.code)}>
                                        {w.name}
                                      </SelectItem>
                                    ))}
                                  </ScrollArea>
                                </SelectContent>
                              </Select>
                            )}
                          />
                          {errors.ward?.code?.message && (<p className="text-xs font-medium text-red-500 mt-1">{errors.ward.code.message}</p>)}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">
                          Địa chỉ giao hàng <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="address"
                          placeholder="Số nhà, tên đường"
                          required
                          {...register("address")}
                        />
                        {errors.address && (<p className="text-xs font-medium text-red-500 mt-1">{errors.address.message}</p>)}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="note">Ghi chú đơn hàng (tùy chọn)</Label>
                        <Textarea {...register("note")} id="note" placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..." rows={2} />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Payment Method */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Wallet className="h-5 w-5 text-orange-500" />
                        Phương thức thanh toán
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as "banking" | "cod" | "momo")} className="space-y-3">
                        <div className="flex items-start space-x-3 border-2 rounded-lg p-4 hover:border-orange-500/50 transition-colors has-[:checked]:border-orange-500 has-[:checked]:bg-orange-600/5">
                          <RadioGroupItem value="cod" id="cod" />
                          <Label htmlFor="cod" className="flex-1 cursor-pointer">
                            <div className="flex items-center gap-3 mb-1">
                              <div className="w-10 h-10 rounded-lg bg-orange-600/10 flex items-center justify-center">
                                <Wallet className="h-5 w-5 text-orange-500" />
                              </div>
                              <div>
                                <div className="font-semibold">Thanh toán khi nhận hàng (COD)</div>
                                <div className="text-sm text-muted-foreground">
                                  Thanh toán bằng tiền mặt khi nhận hàng
                                </div>
                              </div>
                            </div>
                          </Label>
                        </div>

                        {/* <div className="flex items-start space-x-3 border-2 rounded-lg p-4 hover:border-orange-500/50 transition-colors has-[:checked]:border-orange-500 has-[:checked]:bg-orange-600/5">
                          <RadioGroupItem value="momo" id="momo" />
                          <Label htmlFor="momo" className="flex-1 cursor-pointer">
                            <div className="flex items-center gap-3 mb-1">
                              <div className="w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-900/20 flex items-center justify-center">
                                <span className="text-xl">💰</span>
                              </div>
                              <div>
                                <div className="font-semibold">Ví MoMo</div>
                                <div className="text-sm text-muted-foreground">Thanh toán qua ví điện tử MoMo</div>
                              </div>
                            </div>
                          </Label>
                        </div> */}

                        <div className="flex items-start space-x-3 border-2 rounded-lg p-4 hover:border-orange-500/50 transition-colors has-[:checked]:border-orange-500 has-[:checked]:bg-orange-600/5">
                          <RadioGroupItem value="banking" id="banking" />
                          <Label htmlFor="banking" className="flex-1 cursor-pointer">
                            <div className="flex items-center gap-3 mb-1">
                              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                                <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div>
                                <div className="font-semibold">Chuyển khoản ngân hàng</div>
                                <div className="text-sm text-muted-foreground">Chuyển khoản qua Internet Banking</div>
                              </div>
                            </div>
                          </Label>
                        </div>

                        {/* <div className="flex items-start space-x-3 border-2 rounded-lg p-4 hover:border-orange-500/50 transition-colors has-[:checked]:border-orange-500 has-[:checked]:bg-orange-600/5">
                          <RadioGroupItem value="card" id="card" />
                          <Label htmlFor="card" className="flex-1 cursor-pointer">
                            <div className="flex items-center gap-3 mb-1">
                              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                                <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                              </div>
                              <div>
                                <div className="font-semibold">Thẻ tín dụng/ghi nợ</div>
                                <div className="text-sm text-muted-foreground">
                                  Visa, Mastercard, JCB, American Express
                                </div>
                              </div>
                            </div>
                          </Label>
                        </div> */}
                      </RadioGroup>
                    </CardContent>
                  </Card>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <Card className="sticky top-32 lg:max-w-[420px] w-full">
                    <CardHeader>
                      <CardTitle>Đơn hàng của bạn</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className=" max-h-64 overflow-y-auto -mx-2 px-2 space-y-3">
                        {cartItems.map((item) => {
                          const isOutOfStock = item.isOutOfStock
                          const insufficient = item.quantity > item.availableStock

                          return (
                            <div
                              key={item.productId}
                              className={`flex gap-3 p-2 rounded-lg transition ${isOutOfStock
                                ? "bg-red-50 border border-red-200"
                                : insufficient
                                  ? "bg-yellow-50 border border-yellow-200"
                                  : ""
                                }`}
                            >
                              {/* IMAGE */}
                              <div className="relative w-16 h-16 rounded-lg flex-shrink-0 ">
                                <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden">
                                  <img
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.name}
                                    className={`h-full m-auto object-cover ${isOutOfStock ? "opacity-50 grayscale" : ""
                                      }`}
                                  />
                                </div>

                                <Badge className="absolute z-20 -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                                  {item.quantity}
                                </Badge>

                                {isOutOfStock && (
                                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-[10px] text-white font-semibold">
                                    Hết
                                  </div>
                                )}
                              </div>

                              {/* INFO */}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm line-clamp-2 mb-1">
                                  {item.name}
                                </h4>

                                <p className="text-sm font-semibold text-orange-500">
                                  {formatPrice(item.price)}
                                </p>

                                {/* STOCK STATUS */}
                                {isOutOfStock && (
                                  <p className="text-xs text-red-600 mt-1">
                                    Sản phẩm đã hết hàng
                                  </p>
                                )}

                                {!isOutOfStock && insufficient && (
                                  <p className="text-xs text-yellow-600 mt-1">
                                    Chỉ còn {item.availableStock} sản phẩm
                                  </p>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      <Separator />

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
                          provinceCode={Number(provinceCode)}
                          wardCode={Number(wardCode)}
                        />
                      </div>

                      <Separator />

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tạm tính</span>
                          {isLoadingDiscount ? (
                            <span className="font-medium">----</span>
                          ) :
                            <span className="font-medium">{formatPrice(subtotal)}</span>
                          }
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Phí vận chuyển</span>
                          {
                            isLoadingDiscount ? (
                              <span className="font-medium">----</span>
                            ) :
                              <span className="font-medium">{shipping === 0 ? "Miễn phí" : formatPrice(Number(shipping))}</span>
                          }
                        </div>
                        {appliedDiscounts.length > 0 && (
                          <div className="flex flex-col gap-2">
                            {appliedDiscounts.map((discount, idx) => (
                              <ApplyDiscountCard key={discount.code || idx} discount={discount} handleRemoveDiscount={handleRemoveDiscount} />
                            ))}
                          </div>
                        )}

                      </div>

                      <Separator />

                      <div className="flex justify-between text-lg font-bold">
                        <span>Tổng cộng</span>
                        {isLoadingDiscount ? (
                          <span className="font-medium text-orange-500">----</span>
                        ) :
                          <span className="text-orange-500">{formatPrice(total)}</span>}
                      </div>


                      <Button disabled={isProcessing || hasInvalidItem} type="submit" size="lg" className="w-full">
                        {paymentMethod === "cod" ?
                          "Xác nhận đặt hàng"
                          :
                          "Tiếp tục thanh toán"
                        }
                      </Button>

                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="text-xs text-muted-foreground text-center leading-relaxed">
                          Bằng cách đặt hàng, bạn đồng ý với{" "}
                          <Link href="/terms" className="text-orange-500 hover:underline">
                            Điều khoản sử dụng
                          </Link>{" "}
                          và{" "}
                          <Link href="/privacy" className="text-orange-500 hover:underline">
                            Chính sách bảo mật
                          </Link>{" "}
                          của chúng tôi
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </form>
            <AddressSelection
              addresses={addresses}
              handleSelectAddress={handleSelectAddress}
              showAddressDialog={showAddressDialog}
              setShowAddressDialog={setShowAddressDialog}
            />
          </div>
        </div >
      </main >
    </div >
  )
}
