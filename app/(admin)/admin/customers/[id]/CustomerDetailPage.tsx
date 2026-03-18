"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ArrowLeft, Mail, Phone, MapPin, Calendar, Package, Truck, CheckCircle2,
  Edit, Save, X, Ban, Unlock, Trash2, Star, ShoppingBag, TrendingUp,
  Clock, MessageSquare, Plus, Send, CreditCard, Gift
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface CustomerOrder {
  id: string
  date: string
  total: number
  status: "pending" | "confirmed" | "shipping" | "delivered" | "cancelled"
  items: number
  paymentMethod: string
}

interface CustomerActivity {
  id: number
  type: "order" | "login" | "review" | "return" | "support"
  description: string
  date: string
  time: string
}

interface CustomerNote {
  id: number
  content: string
  author: string
  date: string
}

const customerOrders: CustomerOrder[] = [
  {
    id: "#ORD-2024-001",
    date: "12/01/2026",
    total: 250000,
    status: "delivered",
    items: 3,
    paymentMethod: "COD",
  },
  {
    id: "#ORD-2024-002",
    date: "10/01/2026",
    total: 180000,
    status: "shipping",
    items: 2,
    paymentMethod: "Momo",
  },
  {
    id: "#ORD-2024-003",
    date: "05/01/2026",
    total: 320000,
    status: "delivered",
    items: 5,
    paymentMethod: "VNPay",
  },
  {
    id: "#ORD-2024-004",
    date: "28/12/2025",
    total: 450000,
    status: "delivered",
    items: 4,
    paymentMethod: "COD",
  },
  {
    id: "#ORD-2024-005",
    date: "20/12/2025",
    total: 150000,
    status: "cancelled",
    items: 2,
    paymentMethod: "Banking",
  },
]

const customerActivities: CustomerActivity[] = [
  {
    id: 1,
    type: "order",
    description: "Đặt hàng #ORD-2024-001",
    date: "12/01/2026",
    time: "14:30",
  },
  {
    id: 2,
    type: "login",
    description: "Đăng nhập vào hệ thống",
    date: "12/01/2026",
    time: "10:15",
  },
  {
    id: 3,
    type: "review",
    description: "Đánh giá sản phẩm Snack BBQ - 5 sao",
    date: "11/01/2026",
    time: "16:45",
  },
  {
    id: 4,
    type: "order",
    description: "Đặt hàng #ORD-2024-002",
    date: "10/01/2026",
    time: "09:20",
  },
  {
    id: 5,
    type: "support",
    description: "Liên hệ hỗ trợ - Hỏi về chính sách đổi trả",
    date: "08/01/2026",
    time: "11:00",
  },
]

const customerNotes: CustomerNote[] = [
  {
    id: 1,
    content: "Khách hàng thân thiết, luôn thanh toán đúng hạn. Ưu tiên xử lý đơn hàng.",
    author: "Admin",
    date: "10/01/2026",
  },
  {
    id: 2,
    content: "Đã nâng cấp lên VIP sau khi đạt 10 đơn hàng.",
    author: "System",
    date: "05/01/2026",
  },
]

interface CustomerDetailPageProps {
    id: string
}

export default function CustomerDetailPage({ id }: CustomerDetailPageProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [blockDialogOpen, setBlockDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [emailDialogOpen, setEmailDialogOpen] = useState(false)
  const [noteDialogOpen, setNoteDialogOpen] = useState(false)
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false)
  
  // Customer data state
  const [customer, setCustomer] = useState({
    id: 1,
    name: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    phone: "0912345678",
    address: "123 Nguyễn Văn Linh",
    ward: "Phường 10",
    district: "Quận 7",
    city: "TP. Hồ Chí Minh",
    joinDate: "15/09/2025",
    status: "vip" as "active" | "vip" | "new" | "blocked",
    totalOrders: 15,
    totalSpent: 3750000,
    avgOrderValue: 250000,
    lastOrderDate: "12/01/2026",
  })

  const [editedCustomer, setEditedCustomer] = useState({ ...customer })
  const [newNote, setNewNote] = useState("")
  const [notes, setNotes] = useState(customerNotes)
  const [emailSubject, setEmailSubject] = useState("")
  const [emailContent, setEmailContent] = useState("")
  const [newStatus, setNewStatus] = useState(customer.status)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const getOrderStatusBadge = (status: string) => {
    const config = {
      pending: { label: "Chờ xử lý", icon: Clock, className: "bg-yellow-500" },
      confirmed: { label: "Đã xác nhận", icon: CheckCircle2, className: "bg-blue-500" },
      shipping: { label: "Đang giao", icon: Truck, className: "bg-cyan-500" },
      delivered: { label: "Đã giao", icon: CheckCircle2, className: "bg-green-500" },
      cancelled: { label: "Đã hủy", icon: X, className: "bg-red-500" },
    }
    const { label, icon: Icon, className } = config[status as keyof typeof config]
    return (
      <Badge className={className}>
        <Icon className="h-3 w-3 mr-1" />
        {label}
      </Badge>
    )
  }

  const getActivityIcon = (type: string) => {
    const icons = {
      order: <ShoppingBag className="h-4 w-4" />,
      login: <Clock className="h-4 w-4" />,
      review: <Star className="h-4 w-4" />,
      return: <Package className="h-4 w-4" />,
      support: <MessageSquare className="h-4 w-4" />,
    }
    return icons[type as keyof typeof icons]
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      vip: "bg-purple-500",
      active: "bg-green-500",
      new: "bg-blue-500",
      blocked: "bg-red-500",
    }
    const labels = {
      vip: "VIP",
      active: "Hoạt động",
      new: "Mới",
      blocked: "Bị chặn",
    }
    return (
      <Badge className={styles[status as keyof typeof styles]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    )
  }

  const handleSaveEdit = () => {
    setCustomer(editedCustomer)
    setIsEditing(false)
    console.log("[v0] Saved customer data:", editedCustomer)
  }

  const handleCancelEdit = () => {
    setEditedCustomer({ ...customer })
    setIsEditing(false)
  }

  const handleBlock = () => {
    setCustomer({ ...customer, status: "blocked" })
    setBlockDialogOpen(false)
    console.log("[v0] Customer blocked")
  }

  const handleUnblock = () => {
    setCustomer({ ...customer, status: "active" })
    console.log("[v0] Customer unblocked")
  }

  const handleDelete = () => {
    console.log("[v0] Customer deleted")
    setDeleteDialogOpen(false)
    router.push("/admin/customers")
  }

  const handleAddNote = () => {
    if (newNote.trim()) {
      const note: CustomerNote = {
        id: notes.length + 1,
        content: newNote,
        author: "Admin",
        date: new Date().toLocaleDateString("vi-VN"),
      }
      setNotes([note, ...notes])
      setNewNote("")
      setNoteDialogOpen(false)
      console.log("[v0] Note added:", note)
    }
  }

  const handleSendEmail = () => {
    console.log("[v0] Sending email:", { subject: emailSubject, content: emailContent })
    setEmailDialogOpen(false)
    setEmailSubject("")
    setEmailContent("")
  }

  const handleUpgradeStatus = () => {
    setCustomer({ ...customer, status: newStatus })
    setUpgradeDialogOpen(false)
    console.log("[v0] Status upgraded to:", newStatus)
  }

  return (
    <div>
      <div className="space-y-6 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/admin/customers">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Chi tiết khách hàng</h1>
              <p className="text-muted-foreground">Thông tin và lịch sử mua hàng</p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {!isEditing ? (
              <>
                <Button variant="outline" className="bg-transparent gap-2" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4" />
                  Chỉnh sửa
                </Button>
                <Button variant="outline" className="bg-transparent gap-2" onClick={() => setEmailDialogOpen(true)}>
                  <Send className="h-4 w-4" />
                  Gửi email
                </Button>
                {customer.status === "blocked" ? (
                  <Button variant="outline" className="bg-transparent gap-2 text-green-600" onClick={handleUnblock}>
                    <Unlock className="h-4 w-4" />
                    Mở khóa
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="bg-transparent gap-2 text-destructive"
                    onClick={() => setBlockDialogOpen(true)}
                  >
                    <Ban className="h-4 w-4" />
                    Chặn
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button variant="outline" className="bg-transparent gap-2" onClick={handleCancelEdit}>
                  <X className="h-4 w-4" />
                  Hủy
                </Button>
                <Button className="gap-2" onClick={handleSaveEdit}>
                  <Save className="h-4 w-4" />
                  Lưu thay đổi
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold">
                    {customer.name.charAt(0)}
                  </div>
                  <div>
                    {isEditing ? (
                      <Input
                        value={editedCustomer.name}
                        onChange={(e) => setEditedCustomer({ ...editedCustomer, name: e.target.value })}
                        className="font-semibold text-lg mb-2"
                      />
                    ) : (
                      <CardTitle>{customer.name}</CardTitle>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusBadge(customer.status)}
                      {customer.status !== "blocked" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs"
                          onClick={() => setUpgradeDialogOpen(true)}
                        >
                          <Gift className="h-3 w-3 mr-1" />
                          Đổi hạng
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  {isEditing ? (
                    <Input
                      value={editedCustomer.email}
                      onChange={(e) => setEditedCustomer({ ...editedCustomer, email: e.target.value })}
                      className="h-8"
                    />
                  ) : (
                    <span>{customer.email}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  {isEditing ? (
                    <Input
                      value={editedCustomer.phone}
                      onChange={(e) => setEditedCustomer({ ...editedCustomer, phone: e.target.value })}
                      className="h-8"
                    />
                  ) : (
                    <span>{customer.phone}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span>Tham gia: {customer.joinDate}</span>
                </div>
              </CardContent>
            </Card>

            {/* Statistics Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Thống kê
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tổng đơn hàng</span>
                  <span className="font-bold text-lg">{customer.totalOrders}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tổng chi tiêu</span>
                  <span className="font-bold text-lg text-primary">{formatPrice(customer.totalSpent)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Giá trị TB/đơn</span>
                  <span className="font-semibold">{formatPrice(customer.avgOrderValue)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Đơn gần nhất</span>
                  <span className="font-semibold">{customer.lastOrderDate}</span>
                </div>
              </CardContent>
            </Card>

            {/* Address Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Địa chỉ giao hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {isEditing ? (
                  <div className="space-y-3">
                    <Input
                      placeholder="Địa chỉ"
                      value={editedCustomer.address}
                      onChange={(e) => setEditedCustomer({ ...editedCustomer, address: e.target.value })}
                    />
                    <Input
                      placeholder="Phường/Xã"
                      value={editedCustomer.ward}
                      onChange={(e) => setEditedCustomer({ ...editedCustomer, ward: e.target.value })}
                    />
                    <Input
                      placeholder="Quận/Huyện"
                      value={editedCustomer.district}
                      onChange={(e) => setEditedCustomer({ ...editedCustomer, district: e.target.value })}
                    />
                    <Input
                      placeholder="Tỉnh/Thành phố"
                      value={editedCustomer.city}
                      onChange={(e) => setEditedCustomer({ ...editedCustomer, city: e.target.value })}
                    />
                  </div>
                ) : (
                  <div className="text-sm">
                    <p className="font-medium">{customer.address}</p>
                    <p className="text-muted-foreground">{customer.ward}, {customer.district}</p>
                    <p className="text-muted-foreground">{customer.city}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="text-destructive">Vùng nguy hiểm</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="destructive"
                  className="w-full gap-2"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4" />
                  Xóa khách hàng
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Hành động này không thể hoàn tác. Tất cả dữ liệu của khách hàng sẽ bị xóa vĩnh viễn.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Tabs Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="orders" className="space-y-6">
              <TabsList>
                <TabsTrigger value="orders">Đơn hàng ({customerOrders.length})</TabsTrigger>
                <TabsTrigger value="activity">Hoạt động</TabsTrigger>
                <TabsTrigger value="notes">Ghi chú ({notes.length})</TabsTrigger>
              </TabsList>

              {/* Orders Tab */}
              <TabsContent value="orders" className="space-y-4">
                {customerOrders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Link
                              href={`/admin/orders/${order.id}`}
                              className="font-semibold text-lg hover:text-primary transition-colors"
                            >
                              {order.id}
                            </Link>
                            {getOrderStatusBadge(order.status)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {order.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Package className="h-3 w-3" />
                              {order.items} sản phẩm
                            </span>
                            <span className="flex items-center gap-1">
                              <CreditCard className="h-3 w-3" />
                              {order.paymentMethod}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-xl text-primary">{formatPrice(order.total)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {customerOrders.length === 0 && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                      <p className="text-muted-foreground">Khách hàng chưa có đơn hàng nào</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent value="activity">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {customerActivities.map((activity, index) => (
                        <div key={activity.id} className="flex gap-4">
                          <div className="relative">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                              {getActivityIcon(activity.type)}
                            </div>
                            {index < customerActivities.length - 1 && (
                              <div className="absolute top-8 left-1/2 -translate-x-1/2 w-px h-full bg-border" />
                            )}
                          </div>
                          <div className="flex-1 pb-6">
                            <p className="font-medium">{activity.description}</p>
                            <p className="text-sm text-muted-foreground">
                              {activity.date} - {activity.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notes Tab */}
              <TabsContent value="notes" className="space-y-4">
                <Button className="w-full gap-2" onClick={() => setNoteDialogOpen(true)}>
                  <Plus className="h-4 w-4" />
                  Thêm ghi chú mới
                </Button>

                {notes.map((note) => (
                  <Card key={note.id}>
                    <CardContent className="p-4">
                      <p className="text-sm mb-3">{note.content}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Bởi: {note.author}</span>
                        <span>{note.date}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {notes.length === 0 && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                      <p className="text-muted-foreground">Chưa có ghi chú nào</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Block Dialog */}
      <Dialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận chặn tài khoản</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn chặn tài khoản của "{customer.name}"? Khách hàng sẽ không thể đăng nhập và
              đặt hàng cho đến khi được mở khóa.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBlockDialogOpen(false)} className="bg-transparent">
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleBlock}>
              Chặn tài khoản
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa khách hàng</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa khách hàng "{customer.name}"? Tất cả dữ liệu bao gồm lịch sử đơn hàng,
              hoạt động và ghi chú sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="bg-transparent">
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Xóa vĩnh viễn
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Email Dialog */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Gửi email cho khách hàng</DialogTitle>
            <DialogDescription>
              Gửi email đến {customer.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Tiêu đề</label>
              <Input
                placeholder="Nhập tiêu đề email..."
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Nội dung</label>
              <Textarea
                placeholder="Nhập nội dung email..."
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                className="min-h-32"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEmailDialogOpen(false)} className="bg-transparent">
              Hủy
            </Button>
            <Button onClick={handleSendEmail} disabled={!emailSubject || !emailContent}>
              <Send className="h-4 w-4 mr-2" />
              Gửi email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Note Dialog */}
      <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm ghi chú mới</DialogTitle>
            <DialogDescription>
              Thêm ghi chú nội bộ về khách hàng này
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Nhập nội dung ghi chú..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="min-h-24"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNoteDialogOpen(false)} className="bg-transparent">
              Hủy
            </Button>
            <Button onClick={handleAddNote} disabled={!newNote.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm ghi chú
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upgrade Status Dialog */}
      <Dialog open={upgradeDialogOpen} onOpenChange={setUpgradeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thay đổi hạng khách hàng</DialogTitle>
            <DialogDescription>
              Chọn hạng mới cho khách hàng "{customer.name}"
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={newStatus} onValueChange={(value: "active" | "vip" | "new") => setNewStatus(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn hạng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">Mới</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpgradeDialogOpen(false)} className="bg-transparent">
              Hủy
            </Button>
            <Button onClick={handleUpgradeStatus}>
              <Gift className="h-4 w-4 mr-2" />
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
