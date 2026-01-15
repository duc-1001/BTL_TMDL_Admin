"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Send } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function NewCampaignPage() {
  const [campaignType, setCampaignType] = useState("email")

  return (
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild className="bg-transparent">
            <Link href="/admin/marketing/campaigns">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold mb-2">Tạo chiến dịch mới</h1>
            <p className="text-muted-foreground">Thiết lập chiến dịch marketing qua email hoặc SMS</p>
          </div>
        </div>

        <Tabs defaultValue="setup" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-200">
            <TabsTrigger value="setup">Cài đặt</TabsTrigger>
            <TabsTrigger value="content">Nội dung</TabsTrigger>
            <TabsTrigger value="schedule">Lên lịch</TabsTrigger>
          </TabsList>

          <TabsContent value="setup" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin chiến dịch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="campaign-name">Tên chiến dịch *</Label>
                  <Input id="campaign-name" placeholder="VD: Email Chào Mừng Khách Hàng Mới" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="campaign-type">Loại chiến dịch *</Label>
                  <Select value={campaignType} onValueChange={setCampaignType}>
                    <SelectTrigger id="campaign-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email Marketing</SelectItem>
                      <SelectItem value="sms">SMS Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="campaign-goal">Mục tiêu chiến dịch</Label>
                  <Select>
                    <SelectTrigger id="campaign-goal">
                      <SelectValue placeholder="Chọn mục tiêu" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="awareness">Tăng nhận diện thương hiệu</SelectItem>
                      <SelectItem value="engagement">Tăng tương tác</SelectItem>
                      <SelectItem value="conversion">Tăng chuyển đổi</SelectItem>
                      <SelectItem value="retention">Giữ chân khách hàng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Đối tượng nhận</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="audience">Nhóm khách hàng *</Label>
                  <Select>
                    <SelectTrigger id="audience">
                      <SelectValue placeholder="Chọn nhóm khách hàng" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả khách hàng</SelectItem>
                      <SelectItem value="new">Khách hàng mới</SelectItem>
                      <SelectItem value="active">Khách hàng đang hoạt động</SelectItem>
                      <SelectItem value="inactive">Khách hàng không hoạt động</SelectItem>
                      <SelectItem value="vip">Khách hàng VIP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="segment">Phân khúc bổ sung (tùy chọn)</Label>
                  <Select>
                    <SelectTrigger id="segment">
                      <SelectValue placeholder="Chọn phân khúc" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="location-hcm">TP. Hồ Chí Minh</SelectItem>
                      <SelectItem value="location-hn">Hà Nội</SelectItem>
                      <SelectItem value="age-18-25">18-25 tuổi</SelectItem>
                      <SelectItem value="age-26-35">26-35 tuổi</SelectItem>
                      <SelectItem value="high-value">Giá trị cao</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-1">Ước tính tiếp cận</p>
                  <p className="text-2xl font-bold text-primary">~2,458 khách hàng</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            {campaignType === "email" ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Nội dung Email</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-subject">Tiêu đề email *</Label>
                      <Input id="email-subject" placeholder="VD: Chào mừng bạn đến với cửa hàng!" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email-preview">Preview text</Label>
                      <Input id="email-preview" placeholder="Văn bản hiển thị trong inbox trước khi mở email" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email-from">Tên người gửi *</Label>
                      <Input id="email-from" defaultValue="Snack Shop" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email-reply">Email Reply-To</Label>
                      <Input id="email-reply" type="email" placeholder="support@snackshop.vn" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Thiết kế Email</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-template">Template</Label>
                      <Select>
                        <SelectTrigger id="email-template">
                          <SelectValue placeholder="Chọn template" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="welcome">Welcome Email</SelectItem>
                          <SelectItem value="promotion">Promotion</SelectItem>
                          <SelectItem value="newsletter">Newsletter</SelectItem>
                          <SelectItem value="abandoned-cart">Abandoned Cart</SelectItem>
                          <SelectItem value="custom">Custom HTML</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email-body">Nội dung email *</Label>
                      <Textarea
                        id="email-body"
                        placeholder="Nhập nội dung email của bạn..."
                        className="min-h-[200px]"
                      />
                      <p className="text-xs text-muted-foreground">
                        Hỗ trợ HTML. Sử dụng biến: {"{{"} name {"}}"}, {"{{"} discount_code {"}}"}, {"{{"} product_name{" "}
                        {"}}"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Nội dung SMS</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="sms-sender">Tên người gửi *</Label>
                    <Input id="sms-sender" placeholder="SNACKSHOP" maxLength={11} />
                    <p className="text-xs text-muted-foreground">Tối đa 11 ký tự, không dấu</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sms-content">Nội dung SMS *</Label>
                      <span className="text-xs text-muted-foreground">0/160 ký tự</span>
                    </div>
                    <Textarea
                      id="sms-content"
                      placeholder="Nhập nội dung tin nhắn..."
                      maxLength={160}
                      className="min-h-[120px]"
                    />
                    <p className="text-xs text-muted-foreground">
                      Sử dụng biến: {"{{"} name {"}}"}, {"{{"} code {"}}"}, {"{{"} link {"}}"}
                    </p>
                  </div>

                  <div className="p-4 bg-muted rounded-lg space-y-2">
                    <p className="text-sm font-medium">Xem trước SMS</p>
                    <div className="p-3 bg-background rounded border">
                      <p className="text-sm">
                        [SNACKSHOP] Chào {"{{name}}"} ! Sử dụng mã {"{{code}}"} để được giảm 20%. Link: {"{{link}}"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Lên lịch gửi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">Gửi ngay</p>
                      <p className="text-sm text-muted-foreground">Chiến dịch sẽ được gửi ngay lập tức</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">Lên lịch</p>
                      <p className="text-sm text-muted-foreground">Chọn thời gian gửi cụ thể</p>
                    </div>
                    <Switch />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="schedule-date">Ngày gửi</Label>
                    <Input id="schedule-date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="schedule-time">Giờ gửi</Label>
                    <Input id="schedule-time" type="time" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Múi giờ</Label>
                  <Select defaultValue="utc+7">
                    <SelectTrigger id="timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc+7">Việt Nam (UTC+7)</SelectItem>
                      <SelectItem value="utc+8">Singapore (UTC+8)</SelectItem>
                      <SelectItem value="utc+9">Japan (UTC+9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tùy chọn nâng cao</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">A/B Testing</p>
                    <p className="text-sm text-muted-foreground">Kiểm tra nhiều biến thể để tối ưu hiệu quả</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">Theo dõi chuyển đổi</p>
                    <p className="text-sm text-muted-foreground">Đo lường ROI và hiệu quả chiến dịch</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">Tự động gửi lại</p>
                    <p className="text-sm text-muted-foreground">Gửi lại cho người chưa mở email sau 3 ngày</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex gap-3 justify-end border-t pt-6">
          <Button variant="outline" asChild className="bg-transparent">
            <Link href="/admin/marketing/campaigns">Hủy</Link>
          </Button>
          <Button variant="outline" className="bg-transparent">
            Lưu nháp
          </Button>
          <Button>
            <Send className="h-4 w-4 mr-2" />
            Tạo chiến dịch
          </Button>
        </div>
      </div>
  )
}
