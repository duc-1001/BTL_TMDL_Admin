  import { Button } from "@/components/ui/button"
  import Link from "next/link"

  export function HeroSection() {
    return (
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary/30 via-background to-accent/20 py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-orange-600/10 text-primary rounded-full text-sm font-medium">
                🎁 Ưu đãi mới
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-balance leading-tight">
                Đồ ăn vặt ngon, ship nhanh đến tận nhà
              </h1>
              <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
                Hàng trăm loại snack đa dạng từ Việt Nam và quốc tế. Tươi ngon, giá tốt, giao hàng nhanh chóng.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="text-base">
                  <Link href="/products">Mua sắm ngay</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-base bg-transparent">
                  <Link href="/promotions">Xem khuyến mãi</Link>
                </Button>
              </div>
              <div className="flex gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-primary">500+</div>
                  <div className="text-sm text-muted-foreground">Sản phẩm</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">10K+</div>
                  <div className="text-sm text-muted-foreground">Khách hàng</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">4.8★</div>
                  <div className="text-sm text-muted-foreground">Đánh giá</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
                <img src="/colorful-assortment-of-vietnamese-snacks-and-treat.jpg" alt="Snack Collection" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-card p-4 rounded-2xl shadow-lg border">
                <div className="text-sm text-muted-foreground">Giảm giá đến</div>
                <div className="text-2xl font-bold text-primary">30%</div>
              </div>
              <div className="absolute -top-4 -right-4 bg-card p-4 rounded-2xl shadow-lg border">
                <div className="text-sm text-muted-foreground">Miễn phí ship</div>
                <div className="text-lg font-bold">🚚 2h</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
