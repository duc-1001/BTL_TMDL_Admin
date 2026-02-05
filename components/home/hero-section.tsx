'use client'

import { Button } from "@/components/ui/button"
import { getEventRemainingTime } from "@/lib/utils"
import { getHeroBanners } from "@/services/banner.service"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { useEffect, useState } from "react"

export function HeroSection() {
  const { data } = useQuery({
    queryKey: ['hero-banners'],
    queryFn: getHeroBanners,
  })

  const banner = data?.[0]
  const isEventBanner = !!(banner?.startAt && banner?.endAt)

  const [remainingTime, setRemainingTime] = useState<string | null>(null)

  useEffect(() => {
    if (!isEventBanner) {
      setRemainingTime(null)
      return
    }

    const update = () => {
      setRemainingTime(
        getEventRemainingTime(banner!.startAt, banner!.endAt)
      )
    }

    update()
    const timer = setInterval(update, 60 * 1000)

    return () => clearInterval(timer)
  }, [isEventBanner, banner?.startAt, banner?.endAt])

  if (!banner) return null

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-secondary/30 via-background to-accent/20 py-20">
      <div className="container h-full mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* LEFT */}
          <div className="space-y-6">
            <span className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-orange-600/10 text-primary">
              {isEventBanner ? "🎁 Ưu đãi sự kiện" : "✨ Ưu đãi"}
            </span>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              {banner.title}
            </h1>

            {banner.subtitle && (
              <p className="text-lg text-muted-foreground">
                {banner.subtitle}
              </p>
            )}

            <div className="flex gap-4">
              <Button asChild size="lg">
                <Link href={banner.buttonLink || "/products"}>
                  {banner.buttonText || "Mua sắm ngay"}
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg">
                <Link href="/Discounts">Xem khuyến mãi</Link>
              </Button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-xl">
              <img
                src={banner.backgroundImage}
                alt={banner.title}
                className="h-full object-cover"
              />
            </div>

            {/* EVENT TIME */}
            {isEventBanner && remainingTime && (
              <div className="absolute -top-4 -right-4 bg-card border p-4 rounded-2xl shadow-lg">
                <div className="text-sm text-muted-foreground">
                  Thời gian sự kiện
                </div>
                <div className="text-lg font-bold text-primary text-center">
                  {remainingTime}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}
