import { Heart, Award, Truck, Shield } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-primary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Về Snack Việt</h1>
            <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
              Chúng tôi mang đến những món ăn vặt chất lượng cao, an toàn và ngon miệng cho mọi gia đình Việt Nam
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Câu chuyện của chúng tôi</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Snack Việt được thành lập vào năm 2020 với mong muốn mang đến cho người Việt những sản phẩm đồ ăn vặt
                  chất lượng, đa dạng và an toàn cho sức khỏe.
                </p>
                <p>
                  Chúng tôi tự hào là đối tác tin cậy của hàng ngàn gia đình Việt, cung cấp các sản phẩm từ những thương
                  hiệu uy tín trong và ngoài nước, được kiểm định chặt chẽ về nguồn gốc và chất lượng.
                </p>
                <p>
                  Với đội ngũ tận tâm và hệ thống giao hàng nhanh chóng, chúng tôi cam kết mang đến trải nghiệm mua sắm
                  tuyệt vời nhất cho khách hàng.
                </p>
              </div>
            </div>
            <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
              <Image src="/vietnamese-snack-store.jpg" alt="Về chúng tôi" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Giá trị cốt lõi</h2>
            <p className="text-muted-foreground leading-relaxed">
              Những giá trị mà chúng tôi theo đuổi trong mọi hoạt động kinh doanh
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-orange-600/10 flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Tận tâm</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Phục vụ khách hàng với trái tim và sự chân thành
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-orange-600/10 flex items-center justify-center mx-auto mb-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Chất lượng</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Cam kết sản phẩm chất lượng cao, an toàn
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-orange-600/10 flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Nhanh chóng</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Giao hàng nhanh, đúng hẹn trên toàn quốc
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-orange-600/10 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Uy tín</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Xây dựng niềm tin qua từng sản phẩm</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50K+</div>
              <p className="text-muted-foreground">Khách hàng hài lòng</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">200+</div>
              <p className="text-muted-foreground">Sản phẩm đa dạng</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">100K+</div>
              <p className="text-muted-foreground">Đơn hàng thành công</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">4.8/5</div>
              <p className="text-muted-foreground">Đánh giá trung bình</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
