"use client"

import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { OrderShippingInfo } from "@/types/order"
import { cn, formatPrice } from "@/lib/utils"
import { CircleAlert, Upload, X } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { calculateRefund, createRefund } from "@/services/refund.service"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { RefundFormValues, refundSchema } from "@/schemas/refund.schema"
import { deleteFile, uploadFile } from "@/services/upload.service"
import { CreateRefundPayload, ReasonCode } from "@/types/refund"
import { toast } from "sonner"

export const REFUND_REASONS = [
    { code: "DEFECTIVE", label: "Sản phẩm bị lỗi" },
    { code: "WRONG_ITEM", label: "Giao sai sản phẩm" },
    { code: "MISSING_ITEM", label: "Thiếu hàng" },
    { code: "NOT_AS_DESCRIBED", label: "Không đúng mô tả" },
    { code: "OTHER", label: "Khác" },
] as const

const MAX_IMAGES = 5
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const

// ────────────────────────────────────────────────
// Schema Zod
// ───────────────────────────────────────────────


interface RefundItemUI {
    productId: string
    name: string
    quantity: number
    maxQuantity: number
    image?: string
    price: number
}

interface RefundFormProps {
    order: OrderShippingInfo
    tab: string
    handleRefundSuccess: () => void
    setCodeError: React.Dispatch<React.SetStateAction<string | null>>
    token: string
}

export default function RefundForm({ order, tab, handleRefundSuccess, setCodeError, token }: RefundFormProps) {
    const [images, setImages] = useState<File[]>([])
    const [refundItems, setRefundItems] = useState<RefundItemUI[]>([])

    const form = useForm<RefundFormValues>({
        resolver: zodResolver(refundSchema),
        defaultValues: {
            paymentMethod: order.payment.method === "cod" ? "cod" : "banking",
            type: "full",
            reasonCode: "",
            reason: "",
            note: "",
            images: [],
            refundDestination: "bank",
            bankName: "",
            accountNumber: "",
            accountHolder: "",
            items:
                order.items?.map((it) => ({
                    productId: it.productId || "",
                    quantity: 0,
                })) || [],
        },
        mode: "onChange",
    })

    const {
        register,
        handleSubmit,
        watch,
        control,
        setValue,
        formState: { errors, isSubmitting },
        reset,
        setError,
        clearErrors,
    } = form

    useEffect(() => {
        reset({
            paymentMethod: order.payment.method === "cod" ? "cod" : "banking",
            type: "full",
            reasonCode: "",
            reason: "",
            note: "",
            images: [],
            refundDestination: "bank",
            bankName: "",
            accountNumber: "",
            accountHolder: "",
            items:
                order.items?.map((it) => ({
                    productId: it.productId || "",
                    quantity: 0,
                })) || [],
        })
        setImages([])
    }, [order, reset])

    const type = watch("type")
    const reasonCode = watch("reasonCode")
    const refundDestination = watch("refundDestination")

    // Khởi tạo refundItems cho UI (giữ nguyên logic cũ)
    useEffect(() => {
        const initial = order.items.map((item) => ({
            productId: item.productId || "",
            name: item.name,
            quantity: 0,
            maxQuantity: item.quantity,
            image: item.image?.url,
            price: item.price,
        }))
        setRefundItems(initial)

        // Đồng bộ quantity vào form
        setValue(
            "items",
            initial.map((i) => ({ productId: i.productId, quantity: 0 }))
        )
    }, [order, setValue])

    // Khi thay đổi quantity trong UI → cập nhật form
    const updateQty = (productId: string, delta: number) => {
        setRefundItems((prev) =>
            prev.map((item) =>
                item.productId === productId
                    ? {
                        ...item,
                        quantity: Math.max(0, Math.min(item.quantity + delta, item.maxQuantity)),
                    }
                    : item
            )
        )

        // Cập nhật vào form
        const currentItems = watch("items") || []
        const newItems = currentItems.map((it) =>
            it.productId === productId
                ? { ...it, quantity: Math.max(0, Math.min((it.quantity || 0) + delta, 999)) }
                : it
        )
        setValue("items", newItems, { shouldValidate: true })
    }

    // Xử lý upload ảnh
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return

        const files = Array.from(e.target.files)
        const validFiles = files.filter((file) => {
            if (!ALLOWED_IMAGE_TYPES.includes(file.type as any)) {
                setError("images", { type: "manual", message: "Chỉ chấp nhận ảnh JPG, PNG hoặc WEBP" })
                return false
            }
            if (file.size > MAX_FILE_SIZE) {
                setError("images", { type: "manual", message: "Mỗi ảnh tối đa 5MB" })
                return false
            }
            return true
        })

        if (images.length + validFiles.length > MAX_IMAGES) {
            setError("images", { type: "manual", message: `Chỉ được tải lên tối đa ${MAX_IMAGES} ảnh` })
            return
        }

        const newImages = [...images, ...validFiles]
        setImages(newImages)
        setValue("images", newImages, { shouldValidate: true })
        clearErrors("images")
    }

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index)
        setImages(newImages)
        setValue("images", newImages, { shouldValidate: true })
    }

    // Gửi form
    const onSubmit = async (data: RefundFormValues) => {
        let cleanImages: { url: string, imagePublicId: string }[] = []

        try {
            const uploadedImages = await Promise.all(
                (data.images ?? []).map(async (file) => {
                    if (typeof file === "string") {
                        return file
                    }
                    const result = await uploadFile(file, "review")
                    if (!result || !result.url || !result.imagePublicId) {
                        throw new Error("Upload failed")
                    }
                    return {
                        url: result.url,
                        imagePublicId: result.imagePublicId
                    }
                })
            )

            cleanImages = uploadedImages.filter(
                (img): img is { url: string, imagePublicId: string } => typeof img !== "string"
            )
            const payload: CreateRefundPayload = {
                orderCode: order.orderCode,
                type: data.type,
                reasonCode: data.reasonCode as ReasonCode,
                reason: data.reasonCode === "OTHER" ? data.reason?.trim() ?? "" : undefined,
                note: data.note?.trim() ?? "",
                items:
                    data.type === "full"
                        ? order.items.map((i) => ({
                            productId: i.productId,
                            quantity: i.quantity,
                        }))
                        : (data.items ?? [])
                            .filter((i) => i.quantity > 0)
                            .map((i) => ({
                                productId: i.productId,
                                quantity: i.quantity,
                            })),
                images: cleanImages,
                paymentMethod: data.paymentMethod,
                refundDestination: data.refundDestination,
                refundBankInfo:
                    data.bankName && data.accountNumber && data.accountHolder
                        ? {
                            bankName: data.bankName.trim(),
                            accountNumber: data.accountNumber.trim(),
                            accountHolder: data.accountHolder.trim(),
                        }
                        : undefined
            }

            const response = await createRefund(payload, token)
            toast.success("Yêu cầu hoàn tiền đã được gửi thành công!")
            handleRefundSuccess()

            reset()
            setImages([])
            setRefundItems((prev) =>
                prev.map((item) => ({ ...item, quantity: 0 }))
            )
        } catch (error: any) {
            console.error("Error uploading images:", error)
            await Promise.all(cleanImages.map(img => deleteFile(img.imagePublicId)))
            toast.error(error.message || "Có lỗi xảy ra khi gửi yêu cầu hoàn tiền. Vui lòng thử lại.")
            setCodeError(error.code)
            return
        }
    }

    // Query tính tiền hoàn (giữ nguyên)
    const { data, isLoading, error } = useQuery({
        queryKey: ["calculateRefund", order.orderCode, type, refundItems],
        queryFn: () =>
            calculateRefund({
                orderCode: order.orderCode,
                type,
                items:
                    type === "partial"
                        ? refundItems
                            .filter((i) => i.quantity > 0)
                            .map((i) => ({ productId: i.productId, quantity: i.quantity }))
                        : undefined,
                viewToken: token
            }),
        enabled: tab === "refund" && !!order.orderCode && order.refundStatus === "none" ,
    })

    if (error && typeof error === "object") {
        const code = (error as any)?.code
        setCodeError(code)
    }

    return (
        <div className="min-h-screen bg-gray-50 py-6 sm:py-10">
            <div className="max-w-5xl mx-auto px-3 sm:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
                    {/* LEFT SIDE */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Header */}
                        <div className="bg-white rounded-xl border shadow-sm p-5 sm:p-6">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                                Yêu cầu hoàn tiền #{order.orderCode}
                            </h2>
                            <p className="text-gray-500 text-sm mt-1">
                                Vui lòng cung cấp thông tin chính xác để xử lý nhanh nhất.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* TYPE */}
                            <div className="bg-white rounded-xl border shadow-sm p-5 sm:p-6 space-y-4">
                                <h3 className="font-semibold text-base sm:text-lg border-b pb-2">
                                    Loại hoàn tiền
                                </h3>

                                <Controller
                                    control={control}
                                    name="type"
                                    render={({ field }) => (
                                        <RadioGroup
                                            {...field}
                                            onValueChange={field.onChange}
                                            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                                        >
                                            {["full", "partial"].map((value) => (
                                                <Label
                                                    htmlFor={value}
                                                    key={value}
                                                    className={cn(
                                                        "rounded-lg p-4 border transition cursor-pointer",
                                                        field.value === value
                                                            ? "border-orange-500 bg-orange-50"
                                                            : "border-gray-200 bg-gray-50"
                                                    )}
                                                >
                                                    <RadioGroupItem value={value} id={value} />
                                                    <div className="ml-2 font-medium cursor-pointer">
                                                        {value === "full" ? "Hoàn toàn bộ" : "Hoàn một phần"}
                                                    </div>
                                                </Label>
                                            ))}
                                        </RadioGroup>
                                    )}
                                />
                            </div>

                            {/* ITEMS - partial only */}
                            {type === "partial" && (
                                <div className="bg-white rounded-xl border shadow-sm p-5 sm:p-6 space-y-4">
                                    <h3 className="font-semibold text-base sm:text-lg border-b pb-2">
                                        Sản phẩm hoàn tiền
                                    </h3>

                                    <div className="space-y-3">
                                        {refundItems.map((item) => (
                                            <div
                                                key={item.productId}
                                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-lg bg-gray-50"
                                            >
                                                <div className="flex items-center gap-3">
                                                    {item.image && (
                                                        <div className="w-16 h-16 border rounded-xl">
                                                            <img
                                                                src={item.image}
                                                                className="m-auto h-full rounded-md object-cover border"
                                                                alt={item.name}
                                                            />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-sm sm:text-base">{item.name}</p>
                                                        <p className="text-xs text-gray-500">
                                                            Giá: {formatPrice(item.price)}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            Tối đa: {item.maxQuantity}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="icon"
                                                        disabled={item.quantity === 0}
                                                        onClick={() => updateQty(item.productId, -1)}
                                                    >
                                                        −
                                                    </Button>

                                                    <span className="w-6 text-center font-semibold">
                                                        {item.quantity}
                                                    </span>

                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="icon"
                                                        disabled={item.quantity >= item.maxQuantity}
                                                        onClick={() => updateQty(item.productId, 1)}
                                                    >
                                                        +
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {errors.items && (
                                        <p className="text-xs text-red-500">{errors.items.message}</p>
                                    )}
                                </div>
                            )}

                            {/* REASON */}
                            <div className="bg-white rounded-xl border shadow-sm p-5 sm:p-6 space-y-4">
                                <h3 className="font-semibold text-base sm:text-lg border-b pb-2">
                                    Lý do hoàn tiền
                                </h3>

                                <Controller
                                    control={control}
                                    name="reasonCode"
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn lý do" />
                                            </SelectTrigger>
                                            <SelectContent position="popper" sideOffset={4}>
                                                {REFUND_REASONS.map((r) => (
                                                    <SelectItem key={r.code} value={r.code}>
                                                        {r.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />

                                {reasonCode === "OTHER" && (
                                    <Input
                                        placeholder="Nhập lý do cụ thể..."
                                        {...register("reason")}
                                    />
                                )}

                                {errors.reasonCode && (
                                    <p className="text-xs text-red-500">{errors.reasonCode.message}</p>
                                )}
                                {errors.reason && (
                                    <p className="text-xs text-red-500">{errors.reason.message}</p>
                                )}

                                <Textarea
                                    placeholder="Mô tả chi tiết vấn đề..."
                                    {...register("note")}
                                />
                            </div>

                            {/* IMAGES */}
                            <div className="space-y-3 bg-white rounded-xl border shadow-sm p-5 sm:p-6">
                                <Label>Ảnh minh chứng (tối đa {MAX_IMAGES} ảnh)</Label>

                                <div className="flex flex-wrap gap-3">
                                    {images.map((file, index) => (
                                        <div
                                            key={index}
                                            className="relative w-20 h-20 rounded-lg overflow-hidden border bg-gray-100"
                                        >
                                            <img
                                                src={URL.createObjectURL(file)}
                                                className="w-full h-full object-cover"
                                                alt="preview"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}

                                    {images.length < MAX_IMAGES && (
                                        <label className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 text-gray-500">
                                            <Upload size={18} />
                                            <span className="text-xs mt-1">Tải lên</span>
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleImageChange}
                                            />
                                        </label>
                                    )}
                                </div>

                                {errors.images && (
                                    <p className="text-xs text-red-500">{errors.images.message}</p>
                                )}

                                <p className="text-xs text-gray-400">JPG, PNG — tối đa 5MB mỗi ảnh</p>
                            </div>

                            {/* PAYMENT METHOD */}
                            <div className="bg-white rounded-xl border shadow-sm p-5 sm:p-6 space-y-4">
                                <h3 className="font-semibold text-base sm:text-lg border-b pb-2">
                                    Phương thức nhận tiền
                                </h3>

                                {/* COD + BANKING */}
                                {(order.payment.method === "cod" || order.payment.method === "banking") && (
                                    <>
                                        <p className="text-sm text-gray-500">
                                            Vui lòng nhập thông tin tài khoản ngân hàng để nhận tiền hoàn.
                                        </p>

                                        <div className="space-y-3">
                                            <Input
                                                placeholder="Tên ngân hàng (VD: Vietcombank)"
                                                {...register("bankName")}
                                            />
                                            {errors.bankName && (
                                                <p className="text-xs text-red-500">{errors.bankName.message}</p>
                                            )}

                                            <Input
                                                placeholder="Số tài khoản"
                                                {...register("accountNumber")}
                                            />
                                            {errors.accountNumber && (
                                                <p className="text-xs text-red-500">{errors.accountNumber.message}</p>
                                            )}

                                            <Input
                                                placeholder="Chủ tài khoản"
                                                {...register("accountHolder")}
                                            />
                                            {errors.accountHolder && (
                                                <p className="text-xs text-red-500">{errors.accountHolder.message}</p>
                                            )}
                                        </div>

                                        <p className="text-xs text-gray-400">
                                            Lưu ý: Thông tin tài khoản phải chính xác để tránh chậm trễ hoàn tiền.
                                        </p>
                                    </>
                                )}

                                {/* MOMO */}
                                {order.payment.method === "momo" && (
                                    <>
                                        <Controller
                                            control={control}
                                            name="refundDestination"
                                            render={({ field }) => (
                                                <RadioGroup
                                                    {...field}
                                                    onValueChange={field.onChange}
                                                    className="space-y-2"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="original" id="original" />
                                                        <Label htmlFor="original">
                                                            Hoàn về ví MoMo đã thanh toán
                                                        </Label>
                                                    </div>

                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="bank" id="bank" />
                                                        <Label htmlFor="bank">
                                                            Nhận tiền qua tài khoản ngân hàng khác
                                                        </Label>
                                                    </div>
                                                </RadioGroup>
                                            )}
                                        />

                                        {refundDestination === "bank" && (
                                            <div className="space-y-3 mt-3">
                                                <Input
                                                    placeholder="Tên ngân hàng"
                                                    {...register("bankName")}
                                                />
                                                {errors.bankName && (
                                                    <p className="text-xs text-red-500">
                                                        {errors.bankName.message}
                                                    </p>
                                                )}

                                                <Input
                                                    placeholder="Số tài khoản"
                                                    {...register("accountNumber")}
                                                />
                                                {errors.accountNumber && (
                                                    <p className="text-xs text-red-500">
                                                        {errors.accountNumber.message}
                                                    </p>
                                                )}

                                                <Input
                                                    placeholder="Chủ tài khoản"
                                                    {...register("accountHolder")}
                                                />
                                                {errors.accountHolder && (
                                                    <p className="text-xs text-red-500">
                                                        {errors.accountHolder.message}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Submit button - di chuyển vào phần right column */}
                            {/* (bạn có thể giữ ở đây hoặc di chuyển như bản gốc) */}
                        </form>
                    </div>

                    {/* RIGHT SUMMARY */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl border shadow-sm p-5 sm:p-6 space-y-5 lg:sticky lg:top-32">
                            <h3 className="font-semibold border-b pb-2">Tóm tắt yêu cầu hoàn tiền</h3>

                            <div className="text-sm space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Loại hoàn</span>
                                    <span className="font-medium">
                                        {type === "full" ? "Hoàn toàn bộ đơn" : "Hoàn một phần"}
                                    </span>
                                </div>

                                {type === "partial" && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Sản phẩm được chọn</span>
                                        <span className="font-medium">
                                            {refundItems.filter((i) => i.quantity > 0).length}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="border rounded-lg p-4 bg-gray-50 space-y-2">
                                <p className="text-xs text-gray-500">
                                    Số tiền hoàn lại là ước tính. Số tiền chính thức sẽ được xác nhận sau khi
                                    cửa hàng kiểm tra sản phẩm hoàn trả.
                                </p>

                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 flex items-center gap-2">
                                            Giá trị sản phẩm hoàn
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <CircleAlert className="inline-block ml-1" size={16} />
                                                    </TooltipTrigger>
                                                    <TooltipContent className="max-w-[260px] text-sm">
                                                        <p>
                                                            Tổng giá trị sản phẩm bạn chọn hoàn tiền (giá gốc × số lượng).
                                                            Chưa bao gồm giảm giá và phí vận chuyển.
                                                        </p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </span>
                                        <span>{data ? `${data.subtotalRefund.toLocaleString()} đ` : "-"}</span>
                                    </div>

                                    {data && data.subtotalRefund !== data.itemRefund && (
                                        <div className="flex justify-between text-red-500">
                                            <div className="flex items-center gap-1">
                                                <span>Giảm giá áp dụng</span>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <CircleAlert className="inline-block ml-1 text-gray-600" size={16} />
                                                        </TooltipTrigger>
                                                        <TooltipContent className="max-w-xs text-sm">
                                                            Giảm giá được phân bổ theo tỷ lệ giá trị sản phẩm hoàn, nên số
                                                            tiền giảm trừ có thể khác tổng giảm giá ban đầu.
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                            <span>
                                                {isLoading
                                                    ? "---"
                                                    : `-${(data.subtotalRefund - data.itemRefund).toLocaleString()} đ`}
                                            </span>
                                        </div>
                                    )}

                                    {data && data.shippingRefund > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Hoàn phí vận chuyển</span>
                                            <span>{data.shippingRefund.toLocaleString()} đ</span>
                                        </div>
                                    )}

                                    <div className="border-t pt-2 flex justify-between font-semibold text-base">
                                        <span>Tổng tiền hoàn dự kiến</span>
                                        <span className="text-green-600 text-lg">
                                            {data ? `${data.totalRefund.toLocaleString()} đ` : "-"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                onClick={handleSubmit(onSubmit)}
                                disabled={isSubmitting}
                                className="w-full bg-orange-600 hover:bg-orange-700 text-white h-11"
                            >
                                {isSubmitting ? "Đang gửi yêu cầu..." : "Gửi yêu cầu hoàn tiền"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}