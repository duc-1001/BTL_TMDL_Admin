"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Bell, Send, Users, TrendingUp, Clock, CheckCircle2, Plus, Eye, Trash2 } from "lucide-react"
import { useState } from "react"

export default function PushNotificationsPage() {
  const [open, setOpen] = useState(false)

  const stats = [
    {
      label: "Tổng subscribers",
      value: "5,432",
      change: "+234",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      label: "Đã gửi hôm nay",
      value: "1,234",
      change: "+12%",
      icon: Send,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      label: "Click rate",
      value: "18.5%",
      change: "+2.3%",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      label: "Đang chờ gửi",
      value: "3",
      change: "Scheduled",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
    },
  ]

  const notifications = [
    {
      id: 1,
      title: "Flash Sale 50% - Chỉ Hôm Nay!",
      message: "Giảm giá cực sốc cho tất cả snack. Mua ngay!",
      audience: "Tất cả khách hàng",
      sent: 5432,
      clicked: 1006,
      status: "sent",
      date: "14/01/2026 10:30",
    },
    {
      id: 2,
      title: "Sản Phẩm Mới Vừa Ra Mắt",
      message: "Khám phá bộ sưu tập snack mới nhất từ Nhật Bản",
      audience: "Khách hàng thân thiết",
      sent: 2156,
      clicked: 389,
      status: "sent",
      date: "13/01/2026 15:00",
    },
    {
      id: 3,
      title: "Đơn Hàng Của Bạn Đã Được Giao",
      message: "Đơn #ORD-12345 đã được giao thành công",
      audience: "1 người dùng",
      sent: 1,
      clicked: 1,
      status: "sent",
      date: "14/01/2026 14:20",
    },
    {
      id: 4,
      title: "Cuối Tuần Vui Vẻ - Giảm 30%",
      message: "Mã WEEKEND30 cho tất cả đơn hàng cuối tuần",
      audience: "Tất cả khách hàng",
      sent: 0,
      clicked: 0,
      status: "scheduled",
      date: "18/01/2026 08:00",
    },
  ]

  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Push Notifications</h1>
            <p className="text-muted-foreground">Gửi thông báo đẩy đến khách hàng</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Tạo thông báo mới
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Tạo Push Notification Mới</DialogTitle>
                <DialogDescription>Tạo và gửi thông báo đẩy đến khách hàng của bạn</DialogDescription>
              </DialogHeader>
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Tiêu đề thông báo *</Label>
                  <Input id="title" placeholder="VD: Flash Sale 50% - Chỉ Hôm Nay!" maxLength={50} />
                  <p className="text-xs text-muted-foreground">Tối đa 50 ký tự</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Nội dung *</Label>
                  <Textarea
                    id="message"
                    placeholder="VD: Giảm giá cực sốc cho tất cả snack. Mua ngay!"
                    rows={3}
                    maxLength={120}
                  />
                  <p className="text-xs text-muted-foreground">Tối đa 120 ký tự</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="icon">Icon URL (tùy chọn)</Label>
                  <Input id="icon" type="url" placeholder="https://example.com/icon.png" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="link">Link khi click *</Label>
                  <Input id="link" type="url" placeholder="https://snackshop.com/flash-sale" />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="audience">Đối tượng nhận *</Label>
                    <Select defaultValue="all">
                      <SelectTrigger id="audience">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả khách hàng</SelectItem>
                        <SelectItem value="vip">Khách hàng thân thiết</SelectItem>
                        <SelectItem value="new">Khách hàng mới</SelectItem>
                        <SelectItem value="inactive">Khách hàng chưa mua lâu</SelectItem>
                        <SelectItem value="custom">Tùy chỉnh</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="schedule">Thời gian gửi *</Label>
                    <Select defaultValue="now">
                      <SelectTrigger id="schedule">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="now">Gửi ngay</SelectItem>
                        <SelectItem value="schedule">Lên lịch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="datetime">Ngày giờ (nếu lên lịch)</Label>
                  <Input id="datetime" type="datetime-local" />
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex gap-3">
                    <Bell className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm mb-1">Xem trước thông báo</p>
                      <p className="font-medium">Flash Sale 50% - Chỉ Hôm Nay!</p>
                      <p className="text-sm text-muted-foreground">Giảm giá cực sốc cho tất cả snack. Mua ngay!</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Hủy
                  </Button>
                  <Button type="submit" className="gap-2">
                    <Send className="h-4 w-4" />
                    Gửi thông báo
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <span className="text-sm font-medium text-green-600">{stat.change}</span>
                  </div>
                  <p className="text-2xl font-bold mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lịch sử gửi thông báo</CardTitle>
            <CardDescription>Quản lý tất cả thông báo đã gửi và đang chờ</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Thông báo</TableHead>
                  <TableHead>Đối tượng</TableHead>
                  <TableHead>Đã gửi</TableHead>
                  <TableHead>Click rate</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notifications.map((notif) => (
                  <TableRow key={notif.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{notif.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">{notif.message}</p>
                      </div>
                    </TableCell>
                    <TableCell>{notif.audience}</TableCell>
                    <TableCell>{notif.sent.toLocaleString()}</TableCell>
                    <TableCell>
                      {notif.status === "sent" ? (
                        <span className="font-medium">{((notif.clicked / notif.sent) * 100).toFixed(1)}%</span>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {notif.status === "sent" ? (
                        <Badge variant="secondary" className="gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Đã gửi
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1">
                          <Clock className="h-3 w-3" />
                          Đã lên lịch
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{notif.date}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
  )
}
