'use client'
import { HeroSection } from "@/components/home/hero-section"
import { CategoryGrid } from "@/components/home/category-grid"
import { ProductGrid } from "@/components/home/product-grid"
import { Features } from "@/components/features"
import UserLayout from "@/components/layout/user/user-layout"
import MergeCartNotify from "@/components/home/merge-cart-notify"
import { useEffect } from "react"
import { toast } from "sonner"

export default function Home() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const loginSuccess = params.get("login")

    if (loginSuccess === "success") {
      toast.success("Đăng nhập thành công! Chào mừng bạn đã quay lại.")
      params.delete("login")
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, '', newUrl);
    }
  }, [])
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
