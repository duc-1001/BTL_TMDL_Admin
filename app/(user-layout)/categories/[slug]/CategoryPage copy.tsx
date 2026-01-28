'use client'

import { useParams } from "next/navigation"
import Image from "next/image"
import { useQuery } from "@tanstack/react-query"
import { getCategoryBySlug } from "@/services/category.service"
import { getProductsByCategory } from "@/services/product.service"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

interface CategoryPageProps {
    slug: string;
}

export default function CategoryPage({ slug }: CategoryPageProps) {

  /** Lấy category */
  const { data: category, isLoading: loadingCategory } = useQuery({
    queryKey: ['category', slug],
    queryFn: () => getCategoryBySlug(slug),
    enabled: !!slug,
  })

  /** Lấy product theo category */
  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ['products-by-category', slug],
    queryFn: () => getProductsByCategory(slug),
    enabled: !!slug,
  })

  if (loadingCategory) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        Đang tải danh mục...
      </div>
    )
  }

  if (!category) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        Danh mục không tồn tại
      </div>
    )
  }

  return (
    <section className="pb-16">

      {/* ===== HERO CATEGORY ===== */}
      <div className="relative h-[240px] md:h-[300px] overflow-hidden">
        <Image
          src={category.image || "/placeholder.svg"}
          alt={category.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-white/80 max-w-xl">
              {category.description}
            </p>
          )}
        </div>
      </div>

      {/* ===== PRODUCT LIST ===== */}
      <div className="container mx-auto px-4 mt-10">
        {loadingProducts ? (
          <div className="text-center text-muted-foreground">
            Đang tải sản phẩm...
          </div>
        ) : products.length === 0 ? (
          <div className="text-center text-muted-foreground">
            Chưa có sản phẩm trong danh mục này
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <Link
                key={product._id}
                href={`/product/${product._id}`}
                className="group"
              >
                <Card className="h-full overflow-hidden hover:shadow-lg transition">
                  <div className="relative aspect-square">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-primary font-bold text-sm">
                      {product.price.toLocaleString()}₫
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

    </section>
  )
}
