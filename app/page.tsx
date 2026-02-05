'use client'
import { HeroSection } from "@/components/home/hero-section"
import { CategoryGrid } from "@/components/home/category-grid"
import { ProductGrid } from "@/components/home/product-grid"
import { Features } from "@/components/features"
import UserLayout from "@/components/layout/user/user-layout"
import MergeCartNotify from "@/components/home/merge-cart-notify"

export default function Home() {
  return (
    <UserLayout>
      <main className="flex-1">
        <HeroSection />
        <CategoryGrid />
        <ProductGrid />
        <Features />
        <MergeCartNotify />
      </main>
    </UserLayout>
  )
}
