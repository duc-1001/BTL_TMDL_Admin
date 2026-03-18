import Link from "next/link"
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
  return (
    <footer className="bg-card border-t mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center text-orange-500-foreground font-bold text-lg">
                🍿
              </div>
              <span className="font-bold text-xl">Snack Việt</span>
            </div>
            <p className="text-muted-foreground mb-4 text-pretty leading-relaxed">
              Cửa hàng đồ ăn vặt uy tín, chất lượng cao với hàng trăm sản phẩm đa dạng.
            </p>
            <div className="flex gap-2">
              <Button size="icon" variant="outline">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-orange-500 transition-colors">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-orange-500 transition-colors">
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link href="/discounts" className="hover:text-orange-500 transition-colors">
                  Khuyến mãi
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-orange-500 transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Hỗ trợ khách hàng</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="/faq" className="hover:text-orange-500 transition-colors">
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-orange-500 transition-colors">
                  Chính sách vận chuyển
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-orange-500 transition-colors">
                  Đổi trả hàng
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-orange-500 transition-colors">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Liên hệ</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0 text-orange-500" />
                <span className="text-pretty leading-relaxed">123 Nguyễn Huệ, Q.1, TP.HCM</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 flex-shrink-0 text-orange-500" />
                <span>1900 1234</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 flex-shrink-0 text-orange-500" />
                <span>hotro@snackviet.vn</span>
              </li>
            </ul>
          </div>
        </div>

        {/* <div className="border-t pt-8 pb-8">
          <div className="max-w-md mx-auto text-center">
            <h3 className="font-semibold mb-2">Đăng ký nhận tin</h3>
            <p className="text-sm text-muted-foreground mb-4">Nhận thông tin khuyến mãi và sản phẩm mới nhất</p>
            <div className="flex gap-2">
              <Input type="email" placeholder="Email của bạn" />
              <Button>Đăng ký</Button>
            </div>
          </div>
        </div> */}

        <div className="border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 Snack Việt. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  )
}
