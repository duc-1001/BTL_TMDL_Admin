import { queryClient } from '@/components/QueryClientProviders'
import { Button } from '@/components/ui/button'
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatDateTimeLocal } from '@/lib/utils'
import { HeroBanner, HeroBannerSchema } from '@/schemas/hero.schema'
import { editBanner } from '@/services/banner.service'
import { CreateNewBanner } from '@/types/banner'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { HeroBanner as Banner } from '@/types/banner'

const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB (tuỳ bạn)

interface EditHeroProps {
    setOpenEditDialog: React.Dispatch<React.SetStateAction<boolean>>;
    selectedBanner: Banner;
}

const EditHero = ({ setOpenEditDialog, selectedBanner }: EditHeroProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        setValue,
        setError,
        clearErrors,
        reset,
    } = useForm<HeroBanner>({
        resolver: zodResolver(HeroBannerSchema),
        defaultValues: {
            title: '',
            subtitle: '',
            buttonText: '',
            buttonLink: '',
            backgroundImage: '',
            order: 1,
            isActive: true,
            endAt: undefined,
            startAt: undefined,
        }
    })
    useEffect(() => {
        if (selectedBanner) {
            reset({
                ...selectedBanner,
                startAt: selectedBanner.startAt ? new Date(selectedBanner.startAt) : undefined,
                endAt: selectedBanner.endAt ? new Date(selectedBanner.endAt) : undefined,
                backgroundImage: selectedBanner.backgroundImage ? selectedBanner.backgroundImage : '',
            })
        }
    }, [selectedBanner, reset])
    const onSubmit = async (data: HeroBanner) => {
        try {
            const payload: CreateNewBanner = {
                ...data,
                startAt: data.startAt ? formatDateTimeLocal(data.startAt) : undefined,
                endAt: data.endAt ? formatDateTimeLocal(data.endAt) : undefined,
            }
            const res = await editBanner(selectedBanner._id, payload);
            if (res.success === true) {
                queryClient.invalidateQueries({ queryKey: ['hero-banners-admin'] });
                setOpenEditDialog(false);
                reset();
                toast.success("Sửa banner thành công!");
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return

        const newImages = Array.from(files)
        let hasError = false

        for (const file of newImages) {
            if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
                setError("backgroundImage", {
                    type: "manual",
                    message: "Ảnh chỉ chấp nhận file PNG, JPG hoặc WEBP",
                })
                hasError = true
                break
            }

            if (file.size > MAX_FILE_SIZE) {
                setError("backgroundImage", {
                    type: "manual",
                    message: "Dung lượng ảnh tối đa 2MB",
                })
                hasError = true
                break
            }
        }

        if (hasError) {
            e.target.value = ""
            return
        }

        clearErrors("backgroundImage")

        setValue("backgroundImage", newImages[0], { shouldValidate: true })

        e.target.value = ""
    }

    const previewImage = watch("backgroundImage") instanceof File
        ? URL.createObjectURL(watch("backgroundImage") as File)
        : watch("backgroundImage") as string;
    console.log(errors);

    return (
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>Sửa banner</DialogTitle>
                <DialogDescription>
                    Chỉnh sửa banner hiển thị trên trang chủ
                </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
                {/* ===== CONTENT ===== */}
                <div className="space-y-4">
                    <div>
                        <Label className='mb-1'>Tiêu đề</Label>
                        <Input
                            placeholder="Snack ngon mỗi ngày, giao nhanh tận nhà"
                            {...register("title")}
                        />
                        {errors.title && (
                            <p className="text-xs text-red-600 mt-1 font-medium">
                                {errors.title.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label className='mb-1'>Tiêu đề phụ</Label>
                        <Input
                            placeholder="Hàng trăm loại snack Việt & nhập khẩu"
                            {...register("subtitle")}
                        />
                        {errors.subtitle && (
                            <p className="text-xs text-red-600 mt-1 font-medium">
                                {errors.subtitle.message}
                            </p>
                        )}
                    </div>
                </div>

                {/* ===== CTA ===== */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label className='mb-1'>Văn bản nút</Label>
                        <Input placeholder="Mua ngay" {...register("buttonText")} />
                        {errors.buttonText && (
                            <p className="text-xs text-red-600 mt-1 font-medium">
                                {errors.buttonText.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label className='mb-1'>Liên kết nút</Label>
                        <Input placeholder="/products" {...register("buttonLink")} />
                        {errors.buttonLink && (
                            <p className="text-xs text-red-600 mt-1 font-medium">
                                {errors.buttonLink.message}
                            </p>
                        )}
                    </div>
                </div>

                {/* ===== IMAGE ===== */}
                <div className="space-y-2">
                    <Label className='mb-1'>Hình ảnh nền</Label>

                    {watch("backgroundImage") ? (
                        <div className="relative h-48 rounded-lg overflow-hidden border">
                            <img
                                src={previewImage}
                                alt="Preview"
                                className="h-full m-auto object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => setValue("backgroundImage", undefined)}
                                className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded"
                            >
                                Xóa
                            </button>
                        </div>
                    ) : (
                        <label className="border-2 border-dashed rounded-lg h-48 flex items-center justify-center cursor-pointer text-sm text-muted-foreground hover:bg-muted transition">
                            Nhấp để tải ảnh
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                        </label>
                    )}
                    {errors.backgroundImage && (
                        <p className="text-xs text-red-600 mt-1 font-medium">
                            {errors.backgroundImage.message}
                        </p>
                    )}
                </div>

                {/* ===== DISPLAY SETTINGS ===== */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label className='mb-1'>Thứ tự hiển thị</Label>
                        <Input
                            type="number"
                            min={1}
                            {...register("order", { valueAsNumber: true })}
                        />
                        {errors.order && (
                            <p className="text-xs text-red-600 mt-1 font-medium">
                                {errors.order.message}
                            </p>
                        )}
                    </div>

                    <div className="flex items-end gap-2">
                        <input
                            type="checkbox"
                            className="h-4 w-4"
                            {...register("isActive")}
                        />
                        <Label className="cursor-pointer">Hiển thị banner</Label>
                    </div>
                </div>

                {/* ===== SCHEDULE ===== */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label className='mb-1'>Bắt đầu</Label>
                        <Input type="datetime-local"
                            value={formatDateTimeLocal(watch("startAt"))}
                            onChange={(e) => {
                                const date = e.target.value
                                setValue("startAt", date ? new Date(date) : undefined)
                            }}
                        />
                        {errors.startAt && (
                            <p className="text-xs text-red-600 mt-1 font-medium">
                                {errors.startAt.message}
                            </p>
                        )}
                    </div>
                    <div>
                        <Label className='mb-1'>Kết thúc</Label>
                        <Input type="datetime-local"
                            value={formatDateTimeLocal(watch("endAt"))}
                            onChange={(e) => {
                                const date = e.target.value
                                setValue("endAt", date ? new Date(date) : undefined)
                            }}
                        />
                        {errors.endAt && (
                            <p className="text-xs text-red-600 mt-1 font-medium">
                                {errors.endAt.message}
                            </p>
                        )}
                    </div>
                </div>

                {/* ===== ACTIONS ===== */}
                <div className="flex justify-end gap-3 pt-2">
                    <Button
                        disabled={isSubmitting}
                        type="button"
                        variant="outline"
                        onClick={() => setOpenEditDialog(false)}
                    >
                        Hủy
                    </Button>
                    <Button disabled={isSubmitting} className="bg-orange-600 hover:bg-orange-700">
                        Sửa banner
                    </Button>
                </div>
            </form>
        </DialogContent>
    )
}

export default EditHero
