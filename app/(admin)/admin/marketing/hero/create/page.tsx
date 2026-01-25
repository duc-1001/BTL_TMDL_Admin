"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

export default function CreateHeroPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tạo Hero Banner</h1>
        <p className="text-muted-foreground">
          Banner sẽ hiển thị ở đầu trang chủ
        </p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tiêu đề chính</Label>
              <Input placeholder="Đồ ăn vặt ngon – ship nhanh" />
            </div>
            <div>
              <Label>Tiêu đề phụ</Label>
              <Input placeholder="Hàng trăm loại snack hấp dẫn" />
            </div>
          </div>

          <div>
            <Label>Mô tả</Label>
            <Textarea placeholder="Tươi ngon, giá tốt, giao hàng nhanh 2h..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Text nút</Label>
              <Input placeholder="Mua sắm ngay" />
            </div>
            <div>
              <Label>Link nút</Label>
              <Input placeholder="/products" />
            </div>
          </div>

          <div>
            <Label>Ảnh banner</Label>
            <Input type="file" />
            <p className="text-xs text-muted-foreground mt-1">
              Kích thước đề xuất: 1200x800
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Switch defaultChecked />
            <span className="text-sm">Hiển thị ngay</span>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline">Huỷ</Button>
            <Button>Lưu banner</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
