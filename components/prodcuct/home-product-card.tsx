import { HomeProduct } from '@/types/product'
import React from 'react'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Link from 'next/link'
import { Badge } from '../ui/badge'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { Button } from '../ui/button'
import LikeButton from './like-button'

interface HomeProductCardProps {
  product: HomeProduct
}

const HomeProductCard = ({ product }: HomeProductCardProps) => {
  return (
    <Card key={product._id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 gap-2 p-2">
      <Link href={`/product/${product.slug}`}>
        <div className="relative overflow-hidden bg-muted/50">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {product.badge && <Badge className="absolute top-2 left-2 bg-orange-600">{product.badge}</Badge>}
          {product.discount && (
            <Badge className="absolute top-2 right-2 bg-destructive">-{product.discount}%</Badge>
          )}
        </div>
      </Link>

      <CardContent className="px-2 m-0">
        <Link href={`/product/${product.slug}`}>
          <div className="flex items-center gap-1 mb-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{product.rating || 0}</span>
            <span className="text-sm text-muted-foreground">({product.reviewCount || 0})</span>
          </div>
          <h3 className="font-semibold mb-1 text-balance line-clamp-1">{product.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-1">{product.shortDescription}</p>
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

      <CardFooter className="px-2 py-3 pt-0 flex items-center gap-2">
        <Button className="flex-1 cursor-pointer" onClick={() => console.log("[v0] Add to cart:", product._id)}>
          <ShoppingCart className="h-4 w-4 mr-2" />
          Thêm vào giỏ
        </Button>
        <LikeButton product={product} />
      </CardFooter>
    </Card>
  )
}

export default HomeProductCard