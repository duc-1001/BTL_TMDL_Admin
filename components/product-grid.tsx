"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Heart, Star } from "lucide-react"
import Link from "next/link"

const products = [
  {
    id: 1,
    name: "Bánh Snack Oishi",
    description: "Vị bò nướng thơm ngon",
    price: 25000,
    originalPrice: 30000,
    rating: 4.5,
    reviews: 128,
    image: "/vietnamese-oishi-beef-snack-package.jpg",
    badge: "Bán chạy",
    discount: 17,
  },
  {
    id: 2,
    name: "Kẹo Alpenliebe",
    description: "Hương vị caramel sữa",
    price: 35000,
    rating: 4.8,
    reviews: 256,
    image: "/alpenliebe-caramel-candy-bag.jpg",
    badge: "Mới",
  },
  {
    id: 3,
    name: "Hạt điều rang muối",
    description: "Hạt điều Bình Phước cao cấp",
    price: 85000,
    originalPrice: 100000,
    rating: 4.9,
    reviews: 89,
    image: "/premium-roasted-cashew-nuts-package.jpg",
    discount: 15,
  },
  {
    id: 4,
    name: "Snack Lay's",
    description: "Vị kem chua hành tây",
    price: 28000,
    rating: 4.6,
    reviews: 342,
    image: "/lays-sour-cream-onion-chips.jpg",
    badge: "Hot",
  },
  {
    id: 5,
    name: "Kẹo dẻo Haribo",
    description: "Mix trái cây nhiệt đới",
    price: 45000,
    rating: 4.7,
    reviews: 198,
    image: "/haribo-tropical-gummy-bears.jpg",
  },
  {
    id: 6,
    name: "Bánh quy Cosy",
    description: "Vị bơ sữa thơm ngon",
    price: 32000,
    originalPrice: 38000,
    rating: 4.4,
    reviews: 156,
    image: "/cosy-butter-cookies-package.jpg",
    discount: 16,
  },
  {
    id: 7,
    name: "Xúc xích khô",
    description: "Cay nhẹ kiểu Thái",
    price: 55000,
    rating: 4.6,
    reviews: 211,
    image: "/thai-style-spicy-dried-sausage.jpg",
    badge: "Mới",
  },
  {
    id: 8,
    name: "Kẹo sữa Milkita",
    description: "Vị sữa nguyên chất",
    price: 22000,
    rating: 4.8,
    reviews: 445,
    image: "/milkita-milk-candy-wrapper.jpg",
    badge: "Bán chạy",
  },
]

export function ProductGrid() {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  return (
    <section className="py-16 md:py-10 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Sản phẩm nổi bật</h2>
            <p className="text-muted-foreground text-lg">Được khách hàng yêu thích nhất</p>
          </div>
          <Button asChild variant="outline" className="hidden sm:flex bg-transparent">
            <Link href="/products">Xem tất cả</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300">
              <Link href={`/product/${product.id}`}>
                <div className="relative overflow-hidden bg-muted/50">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {product.badge && <Badge className="absolute top-3 left-3 bg-orange-600">{product.badge}</Badge>}
                  {product.discount && (
                    <Badge className="absolute top-3 right-3 bg-destructive">-{product.discount}%</Badge>
                  )}
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.preventDefault()
                      console.log("[v0] Add to wishlist:", product.id)
                    }}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </Link>

              <CardContent className="p-4">
                <Link href={`/product/${product.id}`}>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{product.rating}</span>
                    <span className="text-sm text-muted-foreground">({product.reviews})</span>
                  </div>
                  <h3 className="font-semibold mb-1 text-balance line-clamp-1">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-1">{product.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </Link>
              </CardContent>

              <CardFooter className="p-4 pt-0">
                <Button className="w-full" onClick={() => console.log("[v0] Add to cart:", product.id)}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Thêm vào giỏ
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8 sm:hidden">
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
            <Link href="/products">Xem tất cả sản phẩm</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
