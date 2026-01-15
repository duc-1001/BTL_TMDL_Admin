import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Tag, Gift, TrendingUp, Sparkles, Copy, Check } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const promotions = [
  {
    id: 1,
    title: "Giảm giá cuối tuần",
    description:
      "Giảm đến 50% cho các sản phẩm snack Hàn Quốc chính hãng. Áp dụng cho tất cả các loại snack nhập khẩu từ Hàn Quốc",
    discount: "50%",
    validUntil: "31/01/2024",
    code: "WEEKEND50",
    image: "/weekend-sale-banner.jpg",
    type: "Giảm giá",
    featured: true,
    color: "from-red-500 to-orange-500",
  },
  {
    id: 2,
    title: "Mua 2 tặng 1",
    description:
      "Áp dụng cho tất cả các loại kẹo. Mua 2 sản phẩm bất kỳ trong danh mục kẹo, tặng 1 sản phẩm có giá trị thấp nhất",
    discount: "Mua 2 tặng 1",
    validUntil: "15/02/2024",
    code: "BUY2GET1",
    image: "/buy-2-get-1-promotion.jpg",
    type: "Combo",
    featured: false,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: 3,
    title: "Miễn phí vận chuyển",
    description: "Cho đơn hàng từ 150.000đ trên toàn quốc. Giao hàng nhanh trong 2-3 ngày",
    discount: "Freeship",
    validUntil: "28/02/2024",
    code: "FREESHIP150",
    image: "/free-shipping-banner.png",
    type: "Vận chuyển",
    featured: true,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 4,
    title: "Flash Sale 12h",
    description: "Giảm sốc cho các sản phẩm hoa quả sấy cao cấp. Số lượng có hạn, nhanh tay đặt hàng",
    discount: "30%",
    validUntil: "20/01/2024",
    code: "FLASH30",
    image: "/flash-sale-banner.png",
    type: "Flash Sale",
    featured: false,
    color: "from-yellow-500 to-orange-500",
  },
  {
    id: 5,
    title: "Ưu đãi thành viên mới",
    description: "Giảm 25% cho đơn hàng đầu tiên dành cho khách hàng mới đăng ký tài khoản",
    discount: "25%",
    validUntil: "31/03/2024",
    code: "NEWMEMBER25",
    image: "/new-member-promotion.jpg",
    type: "Thành viên",
    featured: false,
    color: "from-green-500 to-emerald-500",
  },
  {
    id: 6,
    title: "Combo tiết kiệm",
    description: "Mua combo 5 sản phẩm bất kỳ, giảm ngay 100.000đ. Tự do kết hợp theo sở thích",
    discount: "100K",
    validUntil: "25/02/2024",
    code: "COMBO100K",
    image: "/combo-deal-banner.jpg",
    type: "Combo",
    featured: false,
    color: "from-indigo-500 to-purple-500",
  },
]

function PromotionCard({ promo }: { promo: (typeof promotions)[0] }) {
  return (
    <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 border-2 hover:border-primary/50">
      <CardContent className="p-0">
        {/* Image section with gradient overlay */}
        <div className="relative aspect-[16/9] overflow-hidden bg-muted">
          <Image
            src={promo.image || "/placeholder.svg"}
            alt={promo.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div
            className={`absolute inset-0 bg-gradient-to-br ${promo.color} opacity-60 group-hover:opacity-70 transition-opacity`}
          />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge className="bg-white/95 text-foreground backdrop-blur-sm shadow-lg">{promo.type}</Badge>
            {promo.featured && (
              <Badge className="bg-orange-600 text-primary-foreground shadow-lg">
                <Sparkles className="h-3 w-3 mr-1" />
                Nổi bật
              </Badge>
            )}
          </div>

          {/* Discount badge */}
          <div className="absolute top-4 right-4 bg-white rounded-full w-20 h-20 flex items-center justify-center shadow-2xl transform group-hover:rotate-12 transition-transform duration-300">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary leading-none">{promo.discount}</div>
              <div className="text-[10px] text-muted-foreground font-medium">OFF</div>
            </div>
          </div>
        </div>

        {/* Content section */}
        <div className="p-6">
          <h3 className="text-2xl font-bold mb-3 text-balance group-hover:text-primary transition-colors">
            {promo.title}
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-6 text-pretty">{promo.description}</p>

          {/* Info row */}
          <div className="flex flex-col gap-3 mb-6">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Có hiệu lực đến:</span>
              <span className="font-semibold">{promo.validUntil}</span>
            </div>

            {/* Code section */}
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Mã giảm giá:</span>
              <code className="flex-1 px-3 py-1.5 bg-muted rounded-md font-mono font-bold text-primary border-2 border-dashed border-primary/30">
                {promo.code}
              </code>
              <Button size="sm" variant="outline" className="h-8 bg-transparent">
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Action button */}
          <Button className="w-full group/btn" size="lg" asChild>
            <Link href="/products">
              <Gift className="mr-2 h-4 w-4" />
              Mua ngay
              <TrendingUp className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function PromotionsPage() {
  const featuredPromotions = promotions.filter((p) => p.featured)
  const regularPromotions = promotions.filter((p) => !p.featured)

  return (
    <div className="min-h-screen bg-background">
      <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=1200')] opacity-5" />
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 px-4 py-2 text-sm">
              <Gift className="h-4 w-4 mr-2" />
              {promotions.length} chương trình khuyến mãi đang diễn ra
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance">Ưu đãi đặc biệt</h1>
            <p className="text-xl md:text-2xl text-white/90 text-pretty leading-relaxed max-w-3xl mx-auto">
              Đừng bỏ lỡ các chương trình khuyến mãi hấp dẫn và tiết kiệm cho bạn khi mua sắm đồ ăn vặt yêu thích
            </p>
          </div>
        </div>
      </section>

      {featuredPromotions.length > 0 && (
        <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <Sparkles className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-bold">Khuyến mãi nổi bật</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredPromotions.map((promo) => (
                <PromotionCard key={promo.id} promo={promo} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <Tag className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold">Tất cả ưu đãi</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPromotions.map((promo) => (
              <PromotionCard key={promo.id} promo={promo} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-primary/5">
        <div className="container mx-auto px-4">
          <Card className="border-2 border-primary/20 overflow-hidden bg-gradient-to-br from-background to-muted/50">
            <CardContent className="p-8 md:p-16">
              <div className="max-w-3xl mx-auto text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-600/10 mb-6">
                  <Gift className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Đăng ký nhận thông báo ưu đãi</h2>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed text-pretty">
                  Không bỏ lỡ bất kỳ chương trình khuyến mãi nào. Đăng ký tài khoản để nhận thông báo về các ưu đãi mới
                  nhất qua email
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild>
                    <Link href="/signup">
                      Đăng ký ngay
                      <Check className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/products">Mua sắm ngay</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
