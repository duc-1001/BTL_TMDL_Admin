"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, ShoppingCart, Heart, Minus, Plus, Share2, Truck, Shield, RefreshCw } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

// Mock product data
const product = {
  id: 1,
  name: "Bánh Snack Oishi Vị Bò Nướng",
  description: "Snack khoai tây vị bò nướng thơm ngon, giòn tan với hương vị đặc trưng",
  price: 25000,
  originalPrice: 30000,
  rating: 4.5,
  reviews: 128,
  sold: 1234,
  stock: 500,
  images: [
    "/vietnamese-oishi-beef-snack-package.jpg",
    "/vietnamese-oishi-beef-snack-package.jpg",
    "/vietnamese-oishi-beef-snack-package.jpg",
  ],
  badge: "Bán chạy",
  discount: 17,
  category: "Snack mặn",
  brand: "Oishi",
  weight: "40g",
  origin: "Việt Nam",
  expiry: "6 tháng",
}

const relatedProducts = [
  {
    id: 2,
    name: "Snack Lay's Kem Chua",
    price: 28000,
    image: "/lays-sour-cream-onion-chips.jpg",
    rating: 4.6,
  },
  {
    id: 4,
    name: "Kẹo Alpenliebe",
    price: 35000,
    image: "/alpenliebe-caramel-candy-bag.jpg",
    rating: 4.8,
  },
  {
    id: 3,
    name: "Hạt điều rang muối",
    price: 85000,
    image: "/premium-roasted-cashew-nuts-package.jpg",
    rating: 4.9,
  },
  {
    id: 6,
    name: "Bánh quy Cosy",
    price: 32000,
    image: "/cosy-butter-cookies-package.jpg",
    rating: 4.4,
  },
]

export default function ProductPage() {
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const handleAddToCart = () => {
    console.log("[v0] Add to cart:", { productId: product.id, quantity })
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-primary">
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-primary">
              Sản phẩm
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>

          {/* Product Details */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Images */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted border-2">
                <img
                  src={product.images[selectedImage] || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.badge && (
                  <Badge className="absolute top-4 left-4 bg-orange-600 text-base px-4 py-1">{product.badge}</Badge>
                )}
                {product.discount && (
                  <Badge className="absolute top-4 right-4 bg-destructive text-base px-4 py-1">
                    -{product.discount}%
                  </Badge>
                )}
              </div>
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? "border-primary" : "border-muted hover:border-primary/50"
                    }`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{product.category}</Badge>
                  <Badge variant="outline">{product.brand}</Badge>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-balance">{product.name}</h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-medium">{product.rating}</span>
                  <span className="text-muted-foreground">({product.reviews} đánh giá)</span>
                  <span className="text-muted-foreground">• Đã bán {product.sold}</span>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">{product.description}</p>
              </div>

              <Card className="bg-orange-600/5 border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-4xl font-bold text-primary">{formatPrice(product.price)}</span>
                    {product.originalPrice && (
                      <span className="text-xl text-muted-foreground line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">Còn {product.stock} sản phẩm</p>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Số lượng</label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border-2 rounded-lg">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-16 text-center font-medium">{quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        disabled={quantity >= product.stock}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <span className="text-sm text-muted-foreground">Tổng: {formatPrice(product.price * quantity)}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button size="lg" className="flex-1 text-base" onClick={handleAddToCart}>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Thêm vào giỏ
                  </Button>
                  <Button size="lg" variant="outline" className="bg-transparent">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button size="lg" variant="outline" className="bg-transparent">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>

                <Button variant="default" size="lg" className="w-full text-base bg-orange-600 hover:bg-orange-600/90">
                  Mua ngay
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-4 border-t">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-orange-600/10 flex items-center justify-center">
                    <Truck className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-sm font-medium">Giao hàng nhanh</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-orange-600/10 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-sm font-medium">Hàng chính hãng</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-orange-600/10 flex items-center justify-center">
                    <RefreshCw className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-sm font-medium">Đổi trả dễ dàng</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <Card className="mb-12">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                <TabsTrigger
                  value="description"
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                >
                  Mô tả sản phẩm
                </TabsTrigger>
                <TabsTrigger
                  value="specs"
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                >
                  Thông số
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                >
                  Đánh giá ({product.reviews})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="p-6">
                <div className="prose max-w-none">
                  <h3 className="text-xl font-semibold mb-4">Về sản phẩm</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {product.name} là dòng sản phẩm snack được yêu thích nhất tại Việt Nam với hương vị bò nướng đặc
                    trưng, giòn tan và thơm ngon. Sản phẩm được làm từ khoai tây tươi ngon, qua quy trình chế biến hiện
                    đại, đảm bảo an toàn vệ sinh thực phẩm.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Thích hợp cho những buổi họp mặt bạn bè, gia đình hoặc làm món ăn vặt khi xem phim, làm việc. Đóng
                    gói tiện lợi, dễ dàng mang theo.
                  </p>
                  <h4 className="font-semibold mb-2">Ưu điểm nổi bật:</h4>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Hương vị bò nướng đậm đà, hấp dẫn</li>
                    <li>Giòn tan, không ngấy</li>
                    <li>Nguyên liệu tự nhiên, an toàn</li>
                    <li>Bao bì tiện lợi, bảo quản tốt</li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="specs" className="p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex justify-between py-3 border-b">
                    <span className="font-medium">Thương hiệu</span>
                    <span className="text-muted-foreground">{product.brand}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b">
                    <span className="font-medium">Khối lượng</span>
                    <span className="text-muted-foreground">{product.weight}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b">
                    <span className="font-medium">Xuất xứ</span>
                    <span className="text-muted-foreground">{product.origin}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b">
                    <span className="font-medium">Hạn sử dụng</span>
                    <span className="text-muted-foreground">{product.expiry}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b">
                    <span className="font-medium">Danh mục</span>
                    <span className="text-muted-foreground">{product.category}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b">
                    <span className="font-medium">Bảo quản</span>
                    <span className="text-muted-foreground">Nơi khô ráo, thoáng mát</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-primary mb-2">{product.rating}</div>
                      <div className="flex items-center gap-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.floor(product.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-muted text-muted"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground">{product.reviews} đánh giá</div>
                    </div>
                    <div className="flex-1 space-y-2">
                      {[5, 4, 3, 2, 1].map((stars) => (
                        <div key={stars} className="flex items-center gap-3">
                          <span className="text-sm w-12">{stars} sao</span>
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-yellow-400"
                              style={{ width: `${stars === 5 ? 70 : stars === 4 ? 20 : stars === 3 ? 8 : 2}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-12 text-right">
                            {stars === 5 ? 90 : stars === 4 ? 26 : stars === 3 ? 10 : 2}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 pt-6 border-t">
                    {[1, 2, 3].map((i) => (
                      <Card key={i}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-orange-600/10 flex items-center justify-center font-semibold">
                              N{i}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">Nguyễn Văn {i === 1 ? "A" : i === 2 ? "B" : "C"}</span>
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, j) => (
                                    <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  ))}
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                Sản phẩm rất ngon, giòn tan và hương vị đậm đà. Giao hàng nhanh, đóng gói cẩn thận. Sẽ
                                ủng hộ shop tiếp!
                              </p>
                              <span className="text-xs text-muted-foreground">
                                {i === 1 ? "Hôm nay" : i === 2 ? "2 ngày trước" : "1 tuần trước"}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>

          {/* Related Products */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Sản phẩm liên quan</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((item) => (
                <Link key={item.id} href={`/product/${item.id}`}>
                  <Card className="group hover:shadow-lg transition-all duration-300">
                    <div className="relative aspect-square bg-muted rounded-t-lg overflow-hidden">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-2 line-clamp-2 text-balance">{item.name}</h3>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-primary">{formatPrice(item.price)}</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{item.rating}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
