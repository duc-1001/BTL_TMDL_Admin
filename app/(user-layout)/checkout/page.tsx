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
import { CreditCard, Wallet, Building2, CheckCircle2, MapPin, Phone, Mail, User, Tag, Copy, AlertCircle, X } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { useQuery } from "@tanstack/react-query"
import { applyDiscountToCart, calculateCartPricing, getCart, getGuestCart, removeDiscountFromCart } from "@/services/cart.service"
import { getProvinces, Province, Ward, getWardsByProvince } from "@/lib/address"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { formatPrice } from "@/lib/utils"
import { Controller, useForm } from "react-hook-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { set, z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js"
import { ScrollArea } from "@/components/ui/scroll-area"
import AddressSelection from "@/components/checkout/address-selection"
import { toast } from "sonner"
import DiscountSelection from "@/components/checkout/discount-selection"
import { queryClient } from "@/components/QueryClientProviders"

interface MoMoAccount {
  phoneNumber: string
  qrCodeUrl: string
}

interface Discount {
  code: string
  type: "percentage" | "fixed"
  value: number
  minOrderValue: number
  description: string
  maxDiscount?: number
}

interface BankAccount {
  bankName: string
  bankCode: string
  accountName: string
  accountNumber: string
  qrCodeUrl: string
}

const availableDiscounts: Discount[] = [
  {
    code: "TET30",
    type: "percentage",
    value: 30,
    minOrderValue: 0,
    description: "Giảm 30% cho khuyến mãi Tết",
    maxDiscount: 500000,
  },
  {
    code: "FREESHIP100K",
    type: "fixed",
    value: 30000,
    minOrderValue: 100000,
    description: "Miễn phí 30k phí vận chuyển",
  },
  {
    code: "WELCOME50K",
    type: "fixed",
    value: 50000,
    minOrderValue: 200000,
    description: "Giảm 50k cho khách hàng mới",
  },
  {
    code: "SNACK20",
    type: "percentage",
    value: 20,
    minOrderValue: 150000,
    description: "Giảm 20% cho tất cả snack",
    maxDiscount: 300000,
  },
]

const momoAccount: MoMoAccount = {
  phoneNumber: "0912345678",
  qrCodeUrl: "https://img.vietqr.io/image/MOMO-0912345678-compact2.png",
}

const bankAccounts: BankAccount[] = [
  {
    bankName: "Vietcombank",
    bankCode: "VCB",
    accountName: "SNACK VIET CO., LTD",
    accountNumber: "1017828282",
    qrCodeUrl: "https://img.vietqr.io/image/VCB-1017828282-compact2.png",
  },
  {
    bankName: "Techcombank",
    bankCode: "TCB",
    accountName: "SNACK VIET CO., LTD",
    accountNumber: "19035704881001",
    qrCodeUrl: "https://img.vietqr.io/image/TCB-19035704881001-compact2.png",
  },
]

const inforUserChema = z.object({
  _id: z.string().optional(),
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

type InforUserCheckout = z.infer<typeof inforUserChema>

export default function CheckoutPage() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)
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

  const { data: discountData } = useQuery({
    queryKey: ["cart-pricing"],
    queryFn: () => {
      const items = isAuthenticated ? [] : JSON.parse(localStorage.getItem("guest-cart") || "[]")
      const discounts = isAuthenticated ? [] : (JSON.parse(localStorage.getItem("guest-discounts") || "[]") as string[]);
      return calculateCartPricing(items, discounts)
    },
  })

  const [showAddressDialog, setShowAddressDialog] = useState(false)
  const [showDiscountDialog, setShowDiscountDialog] = useState(false)
  const [provinces, setProvinces] = useState<Province[]>([])
  const [wards, setWards] = useState<Ward[]>([])

  const [discountCode, setDiscountCode] = useState("")
  const [discountError, setDiscountError] = useState("")
  const [discountSuccess, setDiscountSuccess] = useState("")

  useEffect(() => {
    getProvinces().then(setProvinces)
  }, [])

  const addresses = user?.addresses || []
  const cartItems = data?.items || []
  const subtotal = discountData?.subtotal || 0
  const shipping = discountData?.shippingFee || 0
  const discountDiscount = discountData?.discountDiscount || 0
  const total = discountData?.totalPrice || 0
  const appliedDiscounts = discountData?.appliedDiscounts || []

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    resetField,
    reset,
    watch,
  } = useForm<InforUserCheckout>({
    resolver: zodResolver(inforUserChema),
    defaultValues: {
      _id: "",
      fullName: "",
      phone: "",
      email: "",
      address: "",
      province: { code: "", name: "" },
      ward: { code: "", name: "" },
      note: "",
    },
  })

  useEffect(() => {
    if (!isAuthenticated || !user) return

    const defaultAddress = user.addresses.find(address => address.isDefault) || user.addresses[0]
    if (defaultAddress) {
      reset({
        _id: defaultAddress._id,
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

  const handleApplyDiscount = async () => {
    setDiscountError("")
    setDiscountSuccess("")
    try {
      const dataItems = cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
      }))
      const res = await applyDiscountToCart(discountCode, dataItems)
      if (!isAuthenticated) {
        // Refetch user cart query
        const discounts = localStorage.getItem("guest-discounts") ? new Set(JSON.parse(localStorage.getItem("guest-discounts") || "[]")) : new Set<string>();
        discounts.add(discountCode);
        localStorage.setItem("guest-discounts", JSON.stringify(Array.from(discounts)));
      }
      queryClient.invalidateQueries({ queryKey: ["cart-pricing"] });
      setDiscountSuccess(`Áp dụng mã giảm giá thành công"`)
    } catch (error: any) {
      setDiscountError(error.message || "Mã giảm giá không hợp lệ hoặc không thể áp dụng")
    }
  }

  const handleRemoveDiscount = async (code: string) => {
    setDiscountCode("")
    setDiscountError("")
    setDiscountSuccess("")
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
    queryClient.invalidateQueries({ queryKey: ["cart-pricing"] });
  }

  const handleSelectAddress = (address: any) => {
    reset({
      _id: address._id,
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

  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [step, setStep] = useState<"checkout" | "success">("checkout")
  const [showPaymentConfirmDialog, setShowPaymentConfirmDialog] = useState(false)
  const [selectedBankIndex, setSelectedBankIndex] = useState(0)
  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault()
    if (paymentMethod !== "cod") {
      setShowPaymentConfirmDialog(true)
      return
    }

    console.log("[v0] Order placed with payment method:", paymentMethod)
    // setStep("success")
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Đã sao chép vào clipboard")
  }

  const createOrder = (status: "pending" | "confirmed" | "cancelled") => {
    console.log("[v0] Creating order with status:", status)
    setStep("success")
  }

  const handleOnlinePaymentConfirm = () => {
    if (paymentMethod === "card") {
      if (!cardData.cardNumber || !cardData.cardName || !cardData.expiryDate || !cardData.cvv) {
        alert("Vui lòng điền đầy đủ thông tin thẻ")
        return
      }
    }

    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      console.log("[v0] Payment processed for:", paymentMethod)
      createOrder("pending") // For online payments, order status is "pending" until payment is confirmed
      setIsProcessing(false)
      setShowPaymentConfirmDialog(false)
    }, 1500)
  }

  if (step === "success") {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="container max-w-2xl px-4">
            <Card className="text-center">
              <CardContent className="py-12">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-orange-600/10 flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-orange-500" />
                </div>
                <h1 className="text-3xl font-bold mb-4">Đặt hàng thành công!</h1>
                <p className="text-lg text-muted-foreground mb-2">Cảm ơn bạn đã mua hàng tại Snack Việt</p>
                <p className="text-muted-foreground mb-8">
                  Mã đơn hàng: <span className="font-mono font-semibold">#DH{Date.now().toString().slice(-8)}</span>
                </p>

                <div className="bg-muted/50 rounded-lg p-6 mb-8 text-left">
                  <h3 className="font-semibold mb-4">Thông tin đơn hàng</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tổng tiền:</span>
                      <span className="font-semibold">{formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phương thức thanh toán:</span>
                      <span className="font-semibold">
                        {paymentMethod === "cod"
                          ? "Thanh toán khi nhận hàng"
                          : paymentMethod === "momo"
                            ? "Ví MoMo"
                            : paymentMethod === "banking"
                              ? "Chuyển khoản ngân hàng"
                              : "Thẻ tín dụng"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Thời gian giao hàng dự kiến:</span>
                      <span className="font-semibold">2-3 ngày</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild variant="outline" size="lg" className="bg-transparent">
                    <Link href="/">Về trang chủ</Link>
                  </Button>
                  <Button asChild size="lg">
                    <Link href="/orders">Xem đơn hàng</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

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
                        <Textarea id="note" placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..." rows={2} />
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
                      <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
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

                        <div className="flex items-start space-x-3 border-2 rounded-lg p-4 hover:border-orange-500/50 transition-colors has-[:checked]:border-orange-500 has-[:checked]:bg-orange-600/5">
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
                        </div>

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

                        <div className="flex items-start space-x-3 border-2 rounded-lg p-4 hover:border-orange-500/50 transition-colors has-[:checked]:border-orange-500 has-[:checked]:bg-orange-600/5">
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
                        </div>
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
                      <div className="space-y-3">
                        {cartItems.map((item) => (
                          <div key={item.productId} className="flex gap-3">
                            <div className="relative w-16 h-16 rounded-lg bg-muted flex-shrink-0">
                              <img
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                className="h-full m-auto object-cover"
                              />
                              <Badge className="absolute z-10 -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                                {item.quantity}
                              </Badge>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm line-clamp-2 mb-1">{item.name}</h4>
                              <p className="text-sm font-semibold text-orange-500">{formatPrice(item.price)}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Separator />


                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Mã giảm giá..."
                            value={discountCode}
                            onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                            onKeyPress={(e) => e.key === "Enter" && handleApplyDiscount()}
                          />
                          <Button type="button" onClick={handleApplyDiscount} variant="outline" className="bg-transparent">
                            Áp dụng
                          </Button>
                        </div>
                        {discountError && <p className="text-xs text-red-500">{discountError}</p>}
                        {discountSuccess && <p className="text-xs text-green-600">{discountSuccess}</p>}
                        <Button
                          type="button"
                          onClick={() => setShowDiscountDialog(true)}
                          variant="ghost"
                          className="w-full justify-start text-muted-foreground text-xs h-8 bg-transparent"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          Xem mã khuyến mãi
                        </Button>
                      </div>

                      <Separator />

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tạm tính</span>
                          <span className="font-medium">{formatPrice(subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Phí vận chuyển</span>
                          <span className="font-medium">{shipping === 0 ? "Miễn phí" : formatPrice(shipping)}</span>
                        </div>
                        {appliedDiscounts.length > 0 && (
                          <div className="flex flex-col gap-2">
                            {appliedDiscounts.map((discount, idx) => (
                              <div
                                key={discount?.code || idx}
                                className="flex items-center justify-between rounded-xl border border-purple-200 bg-purple-50 px-3 py-2 text-sm text-purple-700 shadow-sm transition hover:shadow-md dark:border-purple-800 dark:bg-purple-950/40 dark:text-purple-300"
                              >
                                <div className="flex items-center gap-2">
                                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/50">
                                    <Tag className="h-4 w-4" />
                                  </div>

                                  <div className="flex flex-col leading-tight">
                                    <span className="font-semibold">{discount?.code}</span>
                                    <span className="text-xs text-purple-500 dark:text-purple-400">
                                      Giảm {formatPrice(discount.amount)}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3">
                                  <span className="font-semibold text-purple-700 dark:text-purple-300">
                                    -{formatPrice(discount.amount)}
                                  </span>

                                  <button
                                    type="button"
                                    onClick={() => handleRemoveDiscount(discount.code)}
                                    className="flex h-7 w-7 items-center justify-center rounded-lg text-purple-500 transition hover:bg-purple-100 hover:text-purple-700 dark:hover:bg-purple-900/40 dark:hover:text-purple-200"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                      </div>

                      <Separator />

                      <div className="flex justify-between text-lg font-bold">
                        <span>Tổng cộng</span>
                        <span className="text-orange-500">{formatPrice(total)}</span>
                      </div>


                      <Button disabled={isProcessing} type="submit" size="lg" className="w-full">
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
            <DiscountSelection
              showDiscountDialog={showDiscountDialog}
              setShowDiscountDialog={setShowDiscountDialog}
              subtotal={subtotal}
            />
            <Dialog open={showPaymentConfirmDialog} onOpenChange={setShowPaymentConfirmDialog}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Xác nhận thanh toán</DialogTitle>
                  <DialogDescription>
                    {paymentMethod === "momo" && "Quét mã QR hoặc nhập thông tin MoMo để thanh toán"}
                    {paymentMethod === "banking" && "Chuyển tiền đến tài khoản ngân hàng của Snack Việt"}
                    {paymentMethod === "card" && "Nhập thông tin thẻ tín dụng của bạn"}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Payment Info */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm font-semibold mb-2">Số tiền cần thanh toán:</p>
                    <p className="text-2xl font-bold text-primary">{formatPrice(total)}</p>
                  </div>

                  {/* MoMo Payment */}
                  {paymentMethod === "momo" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <p className="text-sm font-semibold">Quét mã QR:</p>
                        <div className="bg-white dark:bg-background rounded-lg p-4 flex justify-center">
                          <img src={momoAccount.qrCodeUrl || "/placeholder.svg"} alt="MoMo QR" className="h-40 w-40" />
                        </div>
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <p className="text-sm font-semibold">Hoặc chuyển tiền thủ công:</p>
                        <div className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
                          <span className="text-sm">Số điện thoại: {momoAccount.phoneNumber}</span>
                          <Button type="button" variant="ghost" size="sm" onClick={() => copyToClipboard(momoAccount.phoneNumber)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bank Payment */}
                  {paymentMethod === "banking" && (
                    <div className="space-y-4">
                      <RadioGroup value={selectedBankIndex.toString()} onValueChange={(v) => setSelectedBankIndex(Number(v))}>
                        {bankAccounts.map((bank, idx) => (
                          <div key={idx} className="border-2 rounded-lg p-4 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 dark:has-[:checked]:bg-blue-950/10">
                            <div className="flex items-start gap-3 mb-3">
                              <RadioGroupItem value={idx.toString()} id={`bank-${idx}`} />
                              <Label htmlFor={`bank-${idx}`} className="flex-1 cursor-pointer">
                                <div className="font-semibold">{bank.bankName}</div>
                              </Label>
                            </div>

                            <div className="space-y-3 ml-7">
                              <div className="bg-white dark:bg-background rounded-lg p-3 flex justify-center">
                                <img src={bank.qrCodeUrl || "/placeholder.svg"} alt={`${bank.bankName} QR`} className="h-32 w-32" />
                              </div>

                              <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between bg-muted/50 rounded p-2">
                                  <span className="text-xs text-muted-foreground">Tên tài khoản:</span>
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-sm">{bank.accountName}</span>
                                    <Button type="button" variant="ghost" size="sm" onClick={() => copyToClipboard(bank.accountName)}>
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between bg-muted/50 rounded p-2">
                                  <span className="text-xs text-muted-foreground">Số tài khoản:</span>
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-sm font-bold">{bank.accountNumber}</span>
                                    <Button type="button" variant="ghost" size="sm" onClick={() => copyToClipboard(bank.accountNumber)}>
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>

                      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 rounded-lg p-3 text-sm text-blue-700 dark:text-blue-400">
                        <div className="flex gap-2">
                          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <p>
                            Nội dung chuyển khoản: <span className="font-semibold">Order #{Date.now().toString().slice(-8)}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Card Payment */}
                  {paymentMethod === "card" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Số thẻ</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={cardData.cardNumber}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "").slice(0, 16)
                            const formatted = value.replace(/(\d{4})/g, "$1 ").trim()
                            setCardData({ ...cardData, cardNumber: formatted })
                          }}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cardName">Tên chủ thẻ</Label>
                        <Input
                          id="cardName"
                          placeholder="NGUYEN VAN A"
                          value={cardData.cardName}
                          onChange={(e) => setCardData({ ...cardData, cardName: e.target.value.toUpperCase() })}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Ngày hết hạn</Label>
                          <Input
                            id="expiryDate"
                            placeholder="MM/YY"
                            value={cardData.expiryDate}
                            onChange={(e) => {
                              let value = e.target.value.replace(/\D/g, "").slice(0, 4)
                              if (value.length >= 2) {
                                value = value.slice(0, 2) + "/" + value.slice(2)
                              }
                              setCardData({ ...cardData, expiryDate: value })
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            type="password"
                            value={cardData.cvv}
                            onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button type="button" variant="outline" className="flex-1 bg-transparent" onClick={() => setShowPaymentConfirmDialog(false)}>
                      Hủy
                    </Button>
                    <Button type="button" className="flex-1" onClick={handleOnlinePaymentConfirm} disabled={isProcessing}>
                      {isProcessing ? "Đang xử lý..." : "Xác nhận thanh toán"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div >
      </main >
    </div >
  )
}
