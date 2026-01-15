"use client"

import { useState } from "react"
import { Search, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"

const categories = [
  { id: "snacks", name: "Snack giòn", count: 45 },
  { id: "candy", name: "Kẹo", count: 38 },
  { id: "dried-fruit", name: "Hoa quả sấy", count: 28 },
  { id: "nuts", name: "Hạt dinh dưỡng", count: 32 },
  { id: "chocolate", name: "Socola", count: 25 },
  { id: "cookies", name: "Bánh quy", count: 41 },
]

const priceRanges = [
  { id: "under-50k", label: "Dưới 50.000đ", min: 0, max: 50000 },
  { id: "50-100k", label: "50.000đ - 100.000đ", min: 50000, max: 100000 },
  { id: "100-200k", label: "100.000đ - 200.000đ", min: 100000, max: 200000 },
  { id: "over-200k", label: "Trên 200.000đ", min: 200000, max: Number.POSITIVE_INFINITY },
]

const products = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  name: `Snack Hàn Quốc ${i + 1}`,
  price: Math.floor(Math.random() * 150000) + 30000,
  originalPrice: Math.floor(Math.random() * 200000) + 50000,
  image: `/placeholder.svg?height=300&width=300&query=vietnamese snack ${i + 1}`,
  rating: 4 + Math.random(),
  sold: Math.floor(Math.random() * 1000),
  discount: Math.floor(Math.random() * 50) + 10,
  category: categories[Math.floor(Math.random() * categories.length)].id,
}))

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("")
  const [sortBy, setSortBy] = useState("popular")

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category)

    let matchesPrice = true
    if (selectedPriceRange) {
      const range = priceRanges.find((r) => r.id === selectedPriceRange)
      if (range) {
        matchesPrice = product.price >= range.min && product.price <= range.max
      }
    }

    return matchesSearch && matchesCategory && matchesPrice
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price
      case "price-desc":
        return b.price - a.price
      case "newest":
        return b.id - a.id
      case "popular":
      default:
        return b.sold - a.sold
    }
  })

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-4">Danh mục</h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.id}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => toggleCategory(category.id)}
              />
              <Label htmlFor={category.id} className="text-sm font-normal cursor-pointer flex-1">
                {category.name}
                <span className="text-muted-foreground ml-1">({category.count})</span>
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Khoảng giá</h3>
        <RadioGroup value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
          {priceRanges.map((range) => (
            <div key={range.id} className="flex items-center space-x-2">
              <RadioGroupItem value={range.id} id={range.id} />
              <Label htmlFor={range.id} className="text-sm font-normal cursor-pointer">
                {range.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <Button
        variant="outline"
        className="w-full bg-transparent"
        onClick={() => {
          setSelectedCategories([])
          setSelectedPriceRange("")
        }}
      >
        Xóa bộ lọc
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Tất cả sản phẩm</h1>
          <p className="text-muted-foreground">Khám phá {products.length} sản phẩm đồ ăn vặt chất lượng</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Phổ biến nhất</SelectItem>
                <SelectItem value="newest">Mới nhất</SelectItem>
                <SelectItem value="price-asc">Giá: Thấp đến cao</SelectItem>
                <SelectItem value="price-desc">Giá: Cao đến thấp</SelectItem>
              </SelectContent>
            </Select>

            {/* Mobile Filter */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden bg-transparent">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Lọc
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Bộ lọc</SheetTitle>
                  <SheetDescription>Tùy chỉnh kết quả tìm kiếm của bạn</SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block w-64 shrink-0">
            <Card>
              <CardContent className="p-6">
                <h2 className="font-semibold mb-4">Bộ lọc</h2>
                <FilterContent />
              </CardContent>
            </Card>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Hiển thị {sortedProducts.length} sản phẩm</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {sortedProducts.map((product) => (
                <Link key={product.id} href={`/product/${product.id}`}>
                  <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-0">
                      <div className="relative aspect-square overflow-hidden bg-muted">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {product.discount > 0 && (
                          <Badge className="absolute top-2 right-2 bg-red-500">-{product.discount}%</Badge>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-1 mb-2">
                          <div className="flex text-yellow-400">
                            {"★".repeat(Math.floor(product.rating))}
                            {"☆".repeat(5 - Math.floor(product.rating))}
                          </div>
                          <span className="text-xs text-muted-foreground">({product.sold})</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-primary">
                            {product.price.toLocaleString("vi-VN")}đ
                          </span>
                          <span className="text-xs text-muted-foreground line-through">
                            {product.originalPrice.toLocaleString("vi-VN")}đ
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {sortedProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Không tìm thấy sản phẩm nào</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
