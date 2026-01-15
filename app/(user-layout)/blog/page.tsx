import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, User, ArrowRight, Search, TrendingUp } from "lucide-react"
import { BlogFilter } from "@/components/blog-filter"

const blogPosts = [
  {
    id: 1,
    title: "10 loại snack healthy giúp bạn giữ dáng hiệu quả",
    excerpt:
      "Khám phá những loại đồ ăn vặt lành mạnh giúp bạn vừa thỏa mãn cơn thèm vừa không lo tăng cân trong mùa hè này.",
    image: "/healthy-snacks.jpg",
    category: "Sức khỏe",
    author: "Minh Anh",
    date: "15/01/2026",
    readTime: "5 phút đọc",
    featured: true,
  },
  {
    id: 2,
    title: "Cách bảo quản snack để giữ được độ giòn lâu nhất",
    excerpt: "Mẹo hay để bảo quản đồ ăn vặt luôn giòn ngon như mới mua, tránh lãng phí và tiết kiệm chi phí.",
    image: "/crispy-snacks.jpg",
    category: "Mẹo hay",
    author: "Thu Hương",
    date: "12/01/2026",
    readTime: "4 phút đọc",
    featured: true,
  },
  {
    id: 3,
    title: "Top 5 món snack Việt Nam được yêu thích nhất 2026",
    excerpt: "Những món ăn vặt truyền thống Việt Nam đang làm mưa làm gió trên thị trường và được giới trẻ săn đón.",
    image: "/vietnamese-snacks.jpg",
    category: "Xu hướng",
    author: "Quang Huy",
    date: "10/01/2026",
    readTime: "6 phút đọc",
    featured: false,
  },
  {
    id: 4,
    title: "Snack cho trẻ em: Chọn gì để vừa ngon vừa bổ dưỡng?",
    excerpt: "Hướng dẫn phụ huynh lựa chọn đồ ăn vặt an toàn, bổ dưỡng cho bé yêu thích và phát triển khỏe mạnh.",
    image: "/kids-snacks.jpg",
    category: "Gia đình",
    author: "Lan Phương",
    date: "08/01/2026",
    readTime: "5 phút đọc",
    featured: false,
  },
  {
    id: 5,
    title: "Snack Hàn Quốc vs Snack Nhật Bản: Đâu là lựa chọn của bạn?",
    excerpt: "So sánh chi tiết về hương vị, đóng gói và giá cả giữa hai dòng snack Đông Á được ưa chuộng nhất.",
    image: "/asian-snacks.jpg",
    category: "Review",
    author: "Hoàng Nam",
    date: "05/01/2026",
    readTime: "7 phút đọc",
    featured: false,
  },
  {
    id: 6,
    title: "Cách kết hợp snack với đồ uống để tăng hương vị",
    excerpt: "Khám phá những cách kết hợp thú vị giữa snack và đồ uống để tận hưởng trọn vẹn hương vị tuyệt hảo.",
    image: "/snack-drinks.jpg",
    category: "Mẹo hay",
    author: "Mai Linh",
    date: "02/01/2026",
    readTime: "4 phút đọc",
    featured: false,
  },
]

const categories = ["Tất cả", "Sức khỏe", "Mẹo hay", "Xu hướng", "Gia đình", "Review"]

export default function BlogPage() {
  const featuredPosts = blogPosts.filter((post) => post.featured)
  const regularPosts = blogPosts.filter((post) => !post.featured)

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Blog Snack Việt</h1>
            <p className="text-lg text-muted-foreground text-balance leading-relaxed mb-8">
              Khám phá thế giới đồ ăn vặt với những bài viết hữu ích, mẹo hay và xu hướng mới nhất
            </p>
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input placeholder="Tìm kiếm bài viết..." className="pl-10" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <BlogFilter />

        {featuredPosts.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">Bài viết nổi bật</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-4 left-4">{post.category}</Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2 text-balance">
                      <Link href={`/blog/${post.id}`}>{post.title}</Link>
                    </h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2 text-pretty leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{post.date}</span>
                        </div>
                      </div>
                      <span>{post.readTime}</span>
                    </div>
                    <Button asChild variant="link" className="mt-4 px-0">
                      <Link href={`/blog/${post.id}`}>
                        Đọc thêm <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold mb-6">Tất cả bài viết</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 left-4">{post.category}</Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2 text-balance">
                    <Link href={`/blog/${post.id}`}>{post.title}</Link>
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2 text-pretty leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{post.date}</span>
                    </div>
                  </div>
                  <Button asChild variant="link" size="sm" className="px-0">
                    <Link href={`/blog/${post.id}`}>
                      Đọc thêm <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <Button variant="outline" size="lg">
            Xem thêm bài viết
          </Button>
        </div>
      </div>
    </div>
  )
}
