import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

const categories = [
  {
    id: 1,
    name: "Bánh kẹo",
    icon: "🍬",
    count: 120,
    color: "from-pink-500/20 to-purple-500/20",
  },
  {
    id: 2,
    name: "Snack mặn",
    icon: "🥨",
    count: 85,
    color: "from-orange-500/20 to-red-500/20",
  },
  {
    id: 3,
    name: "Đồ uống",
    icon: "🥤",
    count: 65,
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    id: 4,
    name: "Hạt dinh dưỡng",
    icon: "🥜",
    count: 45,
    color: "from-yellow-500/20 to-orange-500/20",
  },
  {
    id: 5,
    name: "Kẹo cao su",
    icon: "🍡",
    count: 30,
    color: "from-green-500/20 to-emerald-500/20",
  },
  {
    id: 6,
    name: "Sô-cô-la",
    icon: "🍫",
    count: 55,
    color: "from-amber-500/20 to-yellow-500/20",
  },
]

export function CategoryGrid() {
  return (
    <section className="py-16 md:py-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Danh mục sản phẩm</h2>
          <p className="text-muted-foreground text-lg text-pretty">Khám phá các loại snack yêu thích của bạn</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link key={category.id} href={`/category/${category.id}`}>
              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-primary/50">
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center text-4xl group-hover:scale-110 transition-transform`}
                  >
                    {category.icon}
                  </div>
                  <h3 className="font-semibold mb-1 text-balance">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.count} sản phẩm</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
