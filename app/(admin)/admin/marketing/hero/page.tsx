"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Pencil, Trash2 } from "lucide-react"
import HeroPreviewModal from "@/components/marketting/hero/hero-preview-modal"

export default function HeroListPage() {
  const [previewHero, setPreviewHero] = useState<any>(null)

  const heroes = [
    {
      id: "1",
      title: "Đồ ăn vặt ngon – ship nhanh",
      subtitle: "Hàng trăm loại snack hấp dẫn",
      image: "/colorful-assortment-of-vietnamese-snacks-and-treat.jpg",
      active: true,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Hero / Banner</h1>
        <Button asChild>
          <Link href="/admin/marketing/hero/create">+ Tạo banner</Link>
        </Button>
      </div>

      {heroes.map((hero) => (
        <Card key={hero.id}>
          <CardContent className="p-4 flex items-center gap-4">
            <img
              src={hero.image}
              className="w-32 h-20 rounded-lg object-cover border cursor-pointer"
              onClick={() => setPreviewHero(hero)}
            />

            <div className="flex-1">
              <p className="font-semibold">{hero.title}</p>
              <p className="text-sm text-muted-foreground">
                {hero.subtitle}
              </p>
            </div>

            <Badge className={hero.active ? "bg-green-600" : ""}>
              {hero.active ? "Đang hiển thị" : "Đã tắt"}
            </Badge>

            <Switch checked={hero.active} />

            <Button size="icon" variant="outline" asChild>
              <Link href={`/admin/marketing/hero/${hero.id}`}>
                <Pencil className="h-4 w-4" />
              </Link>
            </Button>

            <Button size="icon" variant="destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ))}

      {previewHero && (
        <HeroPreviewModal
          hero={previewHero}
          onClose={() => setPreviewHero(null)}
        />
      )}
    </div>
  )
}
