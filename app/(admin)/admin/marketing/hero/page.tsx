"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit2, Plus, Eye, EyeOff } from "lucide-react"
import CreateNewHero from "@/components/forms/marketting/hero/create-new-hero"
import { useQuery } from "@tanstack/react-query"
import { changeBannerStatus, getAllBannersAdmin } from "@/services/banner.service"
import { HeroBanner } from "@/types/banner"
import { formatDateTime } from "@/lib/utils"
import EditHero from "@/components/forms/marketting/hero/edit-hero"
import DeleteHero from "@/components/forms/marketting/hero/delete-hero"


export default function HeroPage() {

  const {
    data,
  } = useQuery({
    queryKey: ['hero-banners-admin'],
    queryFn: getAllBannersAdmin,
  })

  const [banners, setBanners] = useState<HeroBanner[]>([])

  useEffect(() => {
    if (data) {
      setBanners(data)
    }
  }, [data])

  const [selectedBanner, setSelectedBanner] = useState<HeroBanner | null>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

  const handleAddBanner = () => {
    setSelectedBanner(null)
    setOpenDialog(true)
  }

  const handleEditBanner = (banner: HeroBanner) => {
    setSelectedBanner(banner)
    setOpenEditDialog(true)
  }


  const handleDeleteBanner = (banner: HeroBanner) => {
    setSelectedBanner(banner)
    setOpenDeleteDialog(true)
  }

  const handleToggleActive =  async (id: string) => {
    setBanners(banners.map((b) => (b._id === id ? { ...b, isActive: !b.isActive } : b)))
    try {
      await changeBannerStatus(id)
    } catch (error) {
      setBanners(banners.map((b) => (b._id === id ? { ...b, isActive: !b.isActive } : b)))
    }
  }

  return (
    <div>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Hero Banner</h1>
            <p className="text-muted-foreground">Quản lý banner trên trang chủ</p>
          </div>
          <Button onClick={handleAddBanner} className="bg-orange-600 hover:bg-orange-700">
            <Plus className="h-4 w-4 mr-2" />
            Thêm banner
          </Button>
        </div>

        {/* Banners Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {banners.map((banner) => (
            <Card key={banner._id} className="overflow-hidden group">
              {/* IMAGE */}
              <div className="relative h-48 overflow-hidden bg-muted">
                {banner.backgroundImage ? (
                  <img
                    src={banner.backgroundImage}
                    alt={banner.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                    <span className="text-sm text-muted-foreground">
                      Chưa có hình ảnh
                    </span>
                  </div>
                )}

                {/* STATUS BADGE */}
                <div className="absolute top-2 left-2">
                  <Badge
                    className={
                      banner.isActive
                        ? "bg-green-600 text-white"
                        : "bg-gray-500 text-white"
                    }
                  >
                    {banner.isActive ? "Đang hiển thị" : "Đã tắt"}
                  </Badge>
                </div>
              </div>

              {/* CONTENT */}
              <CardContent className="p-4 space-y-4">
                {/* TITLE */}
                <div>
                  <h3 className="font-semibold leading-snug line-clamp-2">
                    {banner.title}
                  </h3>
                  {banner.subtitle && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {banner.subtitle}
                    </p>
                  )}
                </div>

                {/* META */}
                {banner.buttonText && (
                  <p className="text-xs text-muted-foreground">
                    CTA: <span className="font-medium">{banner.buttonText}</span>
                  </p>
                )}

                {
                  banner.startAt && banner.endAt && (
                    <p className="text-xs text-muted-foreground">
                      Lịch hiển thị:{" "}
                      <span className="font-medium">
                        {formatDateTime(banner.startAt)} - {formatDateTime(banner.endAt)}
                      </span>
                    </p>
                  )
                }

                {/* ACTIONS */}
                <div className="flex items-center gap-2 pt-2 border-t">
                  <Button
                    variant={banner.isActive ? "outline" : "default"}
                    size="sm"
                    className="flex-1"
                    onClick={() => handleToggleActive(banner._id)}
                  >
                    {banner.isActive ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-2" />
                        Tắt banner
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Bật banner
                      </>
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditBanner(banner)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteBanner(banner)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add/Edit Dialog */}
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <CreateNewHero setOpenDialog={setOpenDialog}  />
        </Dialog>
        <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
          {
            selectedBanner && (
              <EditHero
                selectedBanner={selectedBanner}
                setOpenEditDialog={setOpenEditDialog}
              />
            )
          }
        </Dialog>
        <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
          {
            selectedBanner && (
              <DeleteHero
                selectedBanner={selectedBanner}
                setOpenDeleteDialog={setOpenDeleteDialog}
              />
            )
          }
        </Dialog>
      </div>
    </div>
  )
}
