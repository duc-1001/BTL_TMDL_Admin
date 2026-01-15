"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Mail, MessageSquare, Eye, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

const campaigns = [
  {
    id: 1,
    name: "Email Chào Mừng Khách Hàng Mới",
    type: "email",
    status: "active",
    sent: 1234,
    opened: 567,
    clicked: 89,
    date: "10/01/2026",
  },
  {
    id: 2,
    name: "SMS Flash Sale Cuối Tuần",
    type: "sms",
    status: "scheduled",
    sent: 0,
    opened: 0,
    clicked: 0,
    date: "18/01/2026",
  },
  {
    id: 3,
    name: "Email Sản Phẩm Mới Tháng 1",
    type: "email",
    status: "completed",
    sent: 5678,
    opened: 2456,
    clicked: 345,
    date: "05/01/2026",
  },
]

export default function CampaignsPage() {
  const router = useRouter()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<(typeof campaigns)[0] | null>(null)

  const getStatusBadge = (status: string) => {
    const config = {
      active: { label: "Đang chạy", className: "bg-green-500" },
      scheduled: { label: "Đã lên lịch", className: "bg-blue-500" },
      completed: { label: "Hoàn thành", className: "bg-gray-500" },
    }
    const { label, className } = config[status as keyof typeof config]
    return <Badge className={className}>{label}</Badge>
  }

  const getTypeIcon = (type: string) => {
    return type === "email" ? <Mail className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />
  }

  const handleDelete = () => {
    if (selectedCampaign) {
      console.log("[v0] Deleting campaign:", selectedCampaign.id)
      // Implement actual delete logic here
      setDeleteDialogOpen(false)
      setSelectedCampaign(null)
    }
  }

  return (
    <div>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Chiến dịch Marketing</h1>
            <p className="text-muted-foreground">Quản lý các chiến dịch email và SMS</p>
          </div>
          <Button asChild>
            <Link href="/admin/marketing/campaigns/new">
              <Plus className="h-4 w-4 mr-2" />
              Tạo chiến dịch
            </Link>
          </Button>
        </div>

        <div className="grid gap-4">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-orange-600/10 text-primary">{getTypeIcon(campaign.type)}</div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-semibold">{campaign.name}</h3>
                          {getStatusBadge(campaign.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">{campaign.date}</p>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Đã gửi</p>
                        <p className="text-xl font-bold">{campaign.sent.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Đã mở</p>
                        <div className="flex items-baseline gap-2">
                          <p className="text-xl font-bold">{campaign.opened.toLocaleString()}</p>
                          {campaign.sent > 0 && (
                            <span className="text-sm text-green-600">
                              {Math.round((campaign.opened / campaign.sent) * 100)}%
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Đã click</p>
                        <div className="flex items-baseline gap-2">
                          <p className="text-xl font-bold">{campaign.clicked.toLocaleString()}</p>
                          {campaign.opened > 0 && (
                            <span className="text-sm text-blue-600">
                              {Math.round((campaign.clicked / campaign.opened) * 100)}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex lg:flex-col gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-transparent"
                      onClick={() => router.push(`/admin/marketing/campaigns/${campaign.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-transparent"
                      onClick={() => router.push(`/admin/marketing/campaigns/${campaign.id}/edit`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-transparent text-destructive hover:text-destructive"
                      onClick={() => {
                        setSelectedCampaign(campaign)
                        setDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {campaigns.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground mb-4">Chưa có chiến dịch nào được tạo</p>
              <Button asChild>
                <Link href="/admin/marketing/campaigns/new">Tạo chiến dịch đầu tiên</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa chiến dịch</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa chiến dịch "{selectedCampaign?.name}"? Hành động này không thể hoàn tác và tất
              cả dữ liệu liên quan sẽ bị xóa.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="bg-transparent">
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Xóa chiến dịch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
