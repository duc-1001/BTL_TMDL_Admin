import { HeroSection } from "@/components/hero-section"
import { CategoryGrid } from "@/components/category-grid"
import { ProductGrid } from "@/components/product-grid"
import { Features } from "@/components/features"
import UserLayout from "@/components/layout/user/user-layout"

export default function Home() {
  return (
    <UserLayout>
      <main className="flex-1">
        <HeroSection />
        <CategoryGrid />
        <ProductGrid />
        <Features />
      </main>
    </UserLayout>
  )
}
