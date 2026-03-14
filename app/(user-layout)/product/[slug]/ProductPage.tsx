"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Minus, Plus, Share2, Truck, Shield, RefreshCw } from "lucide-react"
import { useRef, useState } from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { getProductBySlug, getSimilarProducts } from "@/services/product.service"
import { Product } from "@/types/product"
import { useRouter } from "next/navigation"
import SimilarProductCard from "@/components/prodcuct/similar-product-card"
import { toast } from "sonner"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { queryClient } from "@/components/QueryClientProviders"
import { addToWishlist, removeFromWishlist } from "@/services/wishlist.service"
import LikeButton from "@/components/prodcuct/like-button"
import AddToCartButton from "@/components/prodcuct/add-to-card-button"
import { useCartActions } from "@/hooks/use-cart-actions"
import ProductReviewSection from "@/components/prodcuct/review-section"
import StarRating from "@/components/prodcuct/star-rating"

const Spec = ({ label, value }: { label: string; value?: string }) => (
  <div className="flex justify-between border-b border-gray-100 pb-2">
    <span className="text-gray-500">{label}</span>
    <span className="text-gray-800 font-medium text-right">
      {value || "-"}
    </span>
  </div>
)

interface ProductPageProps {
  slug: string
}

export default function ProductPage({ slug }: ProductPageProps) {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)
  const router = useRouter()
  const { data: product, isLoading: isLoadingProduct, isError } = useQuery({
    queryKey: ["product-details", slug],
    queryFn: () => getProductBySlug(slug),
    enabled: !!slug,
  })

  const { data: similarProducts } = useQuery({
    queryKey: ["similar-products", product?._id],
    queryFn: () => product ? getSimilarProducts(product._id, 5) : Promise.resolve([]),
    enabled: !!product?._id,
  })

  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const reviewSectionRef = useRef<HTMLDivElement>(null)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }
  const { addItem } = useCartActions(isAuthenticated)


  if (isLoadingProduct) {
    return <div>Loading...</div>
  }

  if (isError || !product) {
    router.replace("/not-found")
    return null
  }


  const handleCopyLink = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    toast.success("Sao chép liên kết thành công!")
  }

  const onToggleLikeProduct = async (productId: string) => {
    if (!product) return
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để sử dụng tính năng này!")
      return
    }

    const isLiked = product.isLiked
    queryClient.setQueryData<Product>(["product-details", slug], old => {
      if (!old) return old
      return {
        ...old,
        isLiked: !isLiked
      }
    })

    try {
      if (isLiked) {
        toast.success("Đã bỏ thích sản phẩm!")
        await removeFromWishlist(productId)
      } else {
        toast.success("Đã thích sản phẩm!")
        await addToWishlist(productId)
      }
    } catch (err) {
      queryClient.setQueryData<Product>(["product-details", slug], old => {
        if (!old) return old
        return {
          ...old,
          isLiked: isLiked
        }
      })
    }
  }

  const handleUpdateRating = (oldRating: number, newRating: number) => {
    queryClient.setQueryData<Product>(["product-details", slug], old => {
      if (!old) return old

      const currentAvg = old.ratingAvg || 0
      const count = old.ratingCount || 0

      const totalScore = currentAvg * count
      const newTotalScore = totalScore - oldRating + newRating
      const newAvg = count === 0 ? 0 : newTotalScore / count

      return {
        ...old,
        ratingAvg: newAvg,
        ratingBreakdown: {
          ...old.ratingBreakdown,
          [oldRating]: Math.max((old.ratingBreakdown?.[oldRating] || 1) - 1, 0),
          [newRating]: (old.ratingBreakdown?.[newRating] || 0) + 1
        }
      }
    })
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 ">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-orange-500">
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-orange-500">
              Sản phẩm
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>

          {/* Product Details */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Images */}
            <div className="space-y-4 flex flex-col md:flex-row gap-3">
              <div className="flex order-1 md:order-0 md:flex-col gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square p-2 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index ? "border-orange-400" : "border-muted hover:border-orange-500/50"
                      }`}
                  >
                    <img
                      src={image.url || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      className="h-full max-w-[80px] m-auto object-cover"
                    />
                  </button>
                ))}
              </div>
              <div className="relative w-full max-h-[620px] rounded-lg overflow-hidden border-2 p-2 bg-white">
                <img
                  src={product.images[selectedImage].url || "/placeholder.svg"}
                  alt={product.name}
                  className="h-full max-h-[620px] m-auto  object-cover"
                />
                {product.badge && (
                  <Badge className="absolute top-4 left-4 bg-orange-600 text-base text-white px-4 py-1">{product.badge}</Badge>
                )}
                {product.discount > 0 && (
                  <Badge className="absolute top-4 right-4 bg-destructive text-base text-white px-4 py-1">
                    -{String(product.discount)}%
                  </Badge>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="space-y-2">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{product.category?.name}</Badge>
                  <Badge variant="outline">{product.brand?.name}</Badge>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2 text-balance">{product.name}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <StarRating rating={product?.ratingAvg || 0} />
                  <span className="text-lg font-medium">{product?.ratingAvg || 0}</span>
                  <span className="text-muted-foreground">({product?.ratingCount || 0} đánh giá)</span>
                  <span className="text-muted-foreground">• Đã bán {product.soldQuantity || 0}</span>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">{product.shortDescription}</p>
              </div>

              <Card className="bg-orange-600/5 border-orange-500/20">
                <CardContent className="p-6 py-3">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-4xl font-bold text-orange-500">{formatPrice(product.price)}</span>
                    {product.originalPrice && product.price < product.originalPrice && (
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
                        className="cursor-pointer"
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-16 text-center font-medium">{quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="cursor-pointer"
                        disabled={quantity >= product.stock}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <span className="text-sm text-muted-foreground">Tổng: {formatPrice(product.price * quantity)}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <AddToCartButton productId={product._id} quantity={quantity} />
                  <LikeButton product={product} onToggleLike={onToggleLikeProduct} />
                  <Button onClick={handleCopyLink} size="lg" variant="outline" className="bg-transparent cursor-pointer">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>

                <Button onClick={() => {
                  addItem(product._id, quantity)
                  router.push('/checkout')
                }} variant="default" size="lg" className="w-full text-white text-base cursor-pointer bg-orange-600 hover:bg-orange-600/90">
                  Mua ngay
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-4 border-t">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-orange-600/10 flex items-center justify-center">
                    <Truck className="h-6 w-6 text-orange-500" />
                  </div>
                  <span className="text-sm font-medium">Giao hàng nhanh</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-orange-600/10 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-orange-500" />
                  </div>
                  <span className="text-sm font-medium">Hàng chính hãng</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-orange-600/10 flex items-center justify-center">
                    <RefreshCw className="h-6 w-6 text-orange-500" />
                  </div>
                  <span className="text-sm font-medium">Đổi trả dễ dàng</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}

          <Card className="p-6 mb-5">
            {product.description && (
              <div className="">
                <h3 className="text-xl font-semibold mb-3">Về sản phẩm</h3>
                <p className="text-gray-600 leading-relaxed w-full whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {product.highlights?.length > 0 && (
              <div className="">
                <h3 className="text-xl font-semibold mb-3">Điểm nổi bật</h3>
                <ul className="space-y-2 text-gray-600">
                  {product.highlights.map((h, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-orange-500 shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.ingredient && (
              <div className="">
                <h3 className="text-xl font-semibold mb-3">Thành phần</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {product.ingredient}
                </p>
              </div>
            )}

            {product.allergens && product.allergens?.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-3">Chất gây dị ứng</h3>
                <div className="flex flex-wrap gap-2">
                  {product.allergens.map((a, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded-full"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {
              product.tags && product.tags.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, i) => (
                      <Badge key={i} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )
            }
          </Card>

          <Card className="p-6 mb-5">
            <h3 className="text-xl font-semibold mb-6">Thông tin chi tiết</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4 text-sm">
              <Spec label="Thương hiệu" value={product.brand?.name} />
              <Spec label="Khối lượng" value={`${product.weight} ${product.unit}`} />
              <Spec label="Xuất xứ" value={product.origin} />
              <Spec label="Hạn sử dụng" value="12 tháng kể từ ngày sản xuất" />
              <Spec label="Danh mục" value={product.category?.name} />
              <Spec label="Bảo quản" value={product.storageInstruction} />
            </div>
          </Card>

          <Card ref={reviewSectionRef} className="p-6 mb-5">
            <ProductReviewSection product={product} reviewSectionRef={reviewSectionRef} handleUpdateRating={handleUpdateRating} />
          </Card>

          {/* Related Products */}
          {
            similarProducts && similarProducts.length > 0 && (
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-6">Sản phẩm liên quan</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {similarProducts?.map((item) => (
                    <Link key={item._id} href={`/product/${item.slug}`}>
                      <SimilarProductCard product={item} />
                    </Link>
                  ))}
                </div>
              </div>
            )
          }
        </div>
      </main>
    </div>
  )
}
