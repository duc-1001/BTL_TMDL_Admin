"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trash2, Edit2, Plus, Send, BarChart3, Mail } from "lucide-react"

interface EmailCampaign {
  id: string
  name: string
  subject: string
  content: string
  targetAudience: string
  sentAt?: string
  scheduledFor?: string
  status: "draft" | "scheduled" | "sent"
  recipientCount: number
  openRate: number
  clickRate: number
  conversionRate: number
}

const initialCampaigns: EmailCampaign[] = [
  {
    id: "1",
    name: "Email Sản Phẩm Mới Tháng 1",
    subject: "Khám phá những sản phẩm snack mới chỉ có tại SnackViet",
    content: "Chúng tôi vui mừng giới thiệu bộ sưu tập snack mới từ các nhà cung cấp hàng đầu...",
    targetAudience: "Tất cả khách hàng",
    sentAt: "2026-01-15 10:30",
    status: "sent",
    recipientCount: 5678,
    openRate: 45,
    clickRate: 12,
    conversionRate: 3.2,
  },
  {
    id: "2",
    name: "Flash Sale - Giảm 40%",
    subject: "⏰ Flash Sale: Giảm 40% ngay hôm nay!",
    content: "Chỉ còn vài giờ nữa! Hãy nhanh chóng mua hàng với mức giá ưu đãi nhất...",
    targetAudience: "Khách hàng VIP",
    scheduledFor: "2026-01-20 08:00",
    status: "scheduled",
    recipientCount: 2345,
    openRate: 0,
    clickRate: 0,
    conversionRate: 0,
  },
]

export default function EmailMarketingPage() {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>(initialCampaigns)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<EmailCampaign>>({})
  const [openDialog, setOpenDialog] = useState(false)

  const handleAddCampaign = () => {
    setEditingId(null)
    setFormData({
      name: "",
      subject: "",
      content: "",
      targetAudience: "all",
      status: "draft",
      recipientCount: 0,
      openRate: 0,
      clickRate: 0,
      conversionRate: 0,
    })
    setOpenDialog(true)
  }

  const handleEditCampaign = (campaign: EmailCampaign) => {
    setEditingId(campaign.id)
    setFormData(campaign)
    setOpenDialog(true)
  }

  const handleSaveCampaign = () => {
    if (editingId) {
      setCampaigns(campaigns.map((c) => (c.id === editingId ? { ...c, ...formData } : c)))
    } else {
      const newCampaign: EmailCampaign = {
        id: Date.now().toString(),
        ...formData as EmailCampaign,
      }
      setCampaigns([...campaigns, newCampaign])
    }
    setOpenDialog(false)
    setFormData({})
  }

  const handleDeleteCampaign = (id: string) => {
    setCampaigns(campaigns.filter((c) => c.id !== id))
  }

  const sentCampaigns = campaigns.filter((c) => c.status === "sent")
  const scheduledCampaigns = campaigns.filter((c) => c.status === "scheduled")
  const draftCampaigns = campaigns.filter((c) => c.status === "draft")

  const totalEmailsSent = sentCampaigns.reduce((sum, c) => sum + c.recipientCount, 0)
  const avgOpenRate =
    sentCampaigns.length > 0
      ? Math.round(sentCampaigns.reduce((sum, c) => sum + c.openRate, 0) / sentCampaigns.length)
      : 0

  return (
    <div>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Email Marketing</h1>
            <p className="text-muted-foreground">Tạo và quản lý chiến dịch email quảng cáo</p>
          </div>
          <Button onClick={handleAddCampaign} className="bg-orange-600 hover:bg-orange-700">
            <Plus className="h-4 w-4 mr-2" />
            Chiến dịch mới
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tổng email gửi</p>
                  <p className="text-3xl font-bold">{totalEmailsSent.toLocaleString("vi-VN")}</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tỷ lệ mở trung bình</p>
                  <p className="text-3xl font-bold">{avgOpenRate}%</p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Đã gửi</p>
                  <p className="text-3xl font-bold">{sentCampaigns.length}</p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <Send className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Lên lịch</p>
                  <p className="text-3xl font-bold">{scheduledCampaigns.length}</p>
                </div>
                <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">Tất cả ({campaigns.length})</TabsTrigger>
            <TabsTrigger value="sent">Đã gửi ({sentCampaigns.length})</TabsTrigger>
            <TabsTrigger value="scheduled">Lên lịch ({scheduledCampaigns.length})</TabsTrigger>
            <TabsTrigger value="draft">Bản nháp ({draftCampaigns.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3">
            {campaigns.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">Chưa có chiến dịch nào.</p>
                </CardContent>
              </Card>
            ) : (
              <>
                {campaigns.map((campaign) => (
                  <Card key={campaign.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{campaign.name}</h3>
                            <Badge
                              className={
                                campaign.status === "sent"
                                  ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                                  : campaign.status === "scheduled"
                                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                                    : "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400"
                              }
                            >
                              {campaign.status === "sent"
                                ? "Đã gửi"
                                : campaign.status === "scheduled"
                                  ? "Lên lịch"
                                  : "Bản nháp"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{campaign.subject}</p>
                          <p className="text-xs text-muted-foreground mb-3">
                            <span className="font-medium">Đối tượng:</span> {campaign.targetAudience} ({campaign.recipientCount.toLocaleString("vi-VN")} người nhận)
                          </p>

                          {campaign.status === "sent" && (
                            <div className="grid grid-cols-3 gap-4 pt-3 border-t">
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Tỷ lệ mở</p>
                                <p className="font-semibold text-lg">{campaign.openRate}%</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Click rate</p>
                                <p className="font-semibold text-lg">{campaign.clickRate}%</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Conversion</p>
                                <p className="font-semibold text-lg">{campaign.conversionRate}%</p>
                              </div>
                            </div>
                          )}

                          {campaign.status === "scheduled" && (
                            <p className="text-xs text-muted-foreground">
                              <span className="font-medium">Lên lịch:</span> {campaign.scheduledFor}
                            </p>
                          )}

                          {campaign.status === "sent" && (
                            <p className="text-xs text-muted-foreground mt-3">
                              <span className="font-medium">Gửi:</span> {campaign.sentAt}
                            </p>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditCampaign(campaign)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteCampaign(campaign.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}
          </TabsContent>

          <TabsContent value="sent">
            {sentCampaigns.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">Chưa có chiến dịch nào được gửi.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {sentCampaigns.map((campaign) => (
                  <Card key={campaign.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{campaign.name}</h3>
                          <p className="text-sm text-muted-foreground">{campaign.subject}</p>
                        </div>
                        <div className="text-right mr-4">
                          <p className="text-sm font-medium">{campaign.openRate}% mở</p>
                          <p className="text-xs text-muted-foreground">{campaign.clickRate}% click</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon">
                            <BarChart3 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="scheduled">
            {scheduledCampaigns.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">Chưa có chiến dịch nào được lên lịch.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {scheduledCampaigns.map((campaign) => (
                  <Card key={campaign.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{campaign.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{campaign.subject}</p>
                          <p className="text-xs text-muted-foreground">
                            Lên lịch: {campaign.scheduledFor}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditCampaign(campaign)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="draft">
            {draftCampaigns.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">Chưa có chiến dịch nào dưới dạng bản nháp.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {draftCampaigns.map((campaign) => (
                  <Card key={campaign.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{campaign.name}</h3>
                          <p className="text-sm text-muted-foreground">{campaign.subject}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditCampaign(campaign)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteCampaign(campaign.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Add/Edit Dialog */}
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingId ? "Chỉnh sửa chiến dịch" : "Tạo chiến dịch mới"}</DialogTitle>
              <DialogDescription>
                {editingId ? "Cập nhật thông tin chiến dịch email" : "Tạo một chiến dịch email marketing mới"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div>
                <Label>Tên chiến dịch</Label>
                <Input
                  placeholder="Email Sản Phẩm Mới Tháng 1"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <Label>Tiêu đề email (Subject)</Label>
                <Input
                  placeholder="Khám phá những sản phẩm snack mới..."
                  value={formData.subject || ""}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div>
                <Label>Nội dung email</Label>
                <Textarea
                  placeholder="Nhập nội dung email..."
                  value={formData.content || ""}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={5}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Đối tượng</Label>
                  <select
                    value={formData.targetAudience || "all"}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  >
                    <option value="all">Tất cả khách hàng</option>
                    <option value="vip">Khách hàng VIP</option>
                    <option value="new">Khách hàng mới</option>
                    <option value="inactive">Khách hàng không hoạt động</option>
                  </select>
                </div>

                <div>
                  <Label>Trạng thái</Label>
                  <select
                    value={formData.status || "draft"}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  >
                    <option value="draft">Bản nháp</option>
                    <option value="scheduled">Lên lịch</option>
                    <option value="sent">Đã gửi</option>
                  </select>
                </div>
              </div>

              {formData.status === "scheduled" && (
                <div>
                  <Label>Thời gian gửi</Label>
                  <Input
                    type="datetime-local"
                    value={formData.scheduledFor || ""}
                    onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value })}
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setOpenDialog(false)}>
                Hủy
              </Button>
              <Button onClick={handleSaveCampaign} className="bg-orange-600 hover:bg-orange-700">
                {editingId ? "Cập nhật" : "Tạo"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
