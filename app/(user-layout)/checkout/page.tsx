"use client"

import type React from "react"

import { Header } from "@/components/layout/user/header"
import { Footer } from "@/components/layout/user/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Wallet, Building2, CheckCircle2, MapPin, Phone, Mail, User } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

const cartItems = [
  {
    id: 1,
    name: "Bánh Snack Oishi",
    price: 25000,
    quantity: 2,
    image: "/vietnamese-oishi-beef-snack-package.jpg",
  },
  {
    id: 2,
    name: "Kẹo Alpenliebe",
    price: 35000,
    quantity: 1,
    image: "/alpenliebe-caramel-candy-bag.jpg",
  },
]

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [step, setStep] = useState<"checkout" | "success">("checkout")

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal >= 200000 ? 0 : 30000
  const discount = 0
  const total = subtotal + shipping - discount

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Order placed with payment method:", paymentMethod)
    setStep("success")
  }

  if (step === "success") {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="container max-w-2xl px-4">
            <Card className="text-center">
              <CardContent className="py-12">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-orange-600/10 flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-primary" />
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
                <Link href="/" className="hover:text-primary">
                  Trang chủ
                </Link>
                <span>/</span>
                <Link href="/cart" className="hover:text-primary">
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
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        Thông tin giao hàng
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
                            <Input id="fullName" placeholder="Nguyễn Văn A" className="pl-10" required />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">
                            Số điện thoại <span className="text-destructive">*</span>
                          </Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="phone" type="tel" placeholder="0912 345 678" className="pl-10" required />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input id="email" type="email" placeholder="nguyenvana@email.com" className="pl-10" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">
                          Địa chỉ giao hàng <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                          id="address"
                          placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                          rows={3}
                          required
                        />
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
                        <Wallet className="h-5 w-5 text-primary" />
                        Phương thức thanh toán
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                        <div className="flex items-start space-x-3 border-2 rounded-lg p-4 hover:border-primary/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-orange-600/5">
                          <RadioGroupItem value="cod" id="cod" />
                          <Label htmlFor="cod" className="flex-1 cursor-pointer">
                            <div className="flex items-center gap-3 mb-1">
                              <div className="w-10 h-10 rounded-lg bg-orange-600/10 flex items-center justify-center">
                                <Wallet className="h-5 w-5 text-primary" />
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

                        <div className="flex items-start space-x-3 border-2 rounded-lg p-4 hover:border-primary/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-orange-600/5">
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

                        <div className="flex items-start space-x-3 border-2 rounded-lg p-4 hover:border-primary/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-orange-600/5">
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

                        <div className="flex items-start space-x-3 border-2 rounded-lg p-4 hover:border-primary/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-orange-600/5">
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
                  <Card className="sticky top-24">
                    <CardHeader>
                      <CardTitle>Đơn hàng của bạn</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex gap-3">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                              <img
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                                {item.quantity}
                              </Badge>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm line-clamp-2 mb-1">{item.name}</h4>
                              <p className="text-sm font-semibold text-primary">{formatPrice(item.price)}</p>
                            </div>
                          </div>
                        ))}
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
                        {discount > 0 && (
                          <div className="flex justify-between text-primary">
                            <span>Giảm giá</span>
                            <span>-{formatPrice(discount)}</span>
                          </div>
                        )}
                      </div>

                      <Separator />

                      <div className="flex justify-between text-lg font-bold">
                        <span>Tổng cộng</span>
                        <span className="text-primary">{formatPrice(total)}</span>
                      </div>

                      <Button type="submit" size="lg" className="w-full">
                        Đặt hàng
                      </Button>

                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="text-xs text-muted-foreground text-center leading-relaxed">
                          Bằng cách đặt hàng, bạn đồng ý với{" "}
                          <Link href="/terms" className="text-primary hover:underline">
                            Điều khoản sử dụng
                          </Link>{" "}
                          và{" "}
                          <Link href="/privacy" className="text-primary hover:underline">
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
          </div>
        </div>
      </main>
    </div>
  )
}
