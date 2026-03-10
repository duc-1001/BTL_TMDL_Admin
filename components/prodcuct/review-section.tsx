"use client"

import { useState, useMemo } from "react"
import "dayjs/locale/vi"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { useQuery } from "@tanstack/react-query"
import { getCanReviewProduct, getProductReviews } from "@/services/product.service"
import { formatTimeAgo } from "@/lib/time"
import { Star } from "lucide-react"
import { Button } from "../ui/button"
import { toast } from "sonner"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { ReviewModal } from "../order/review-modal"
import { Product } from "@/types/product"
import { queryClient } from "../QueryClientProviders"
import { Review } from "@/types/review"
import StarRating from "./star-rating"

interface ReviewSectionProps {
    product: Product
    reviewSectionRef: React.RefObject<HTMLDivElement | null>
    handleUpdateRating: (newRating: number) => void
}


export default function ProductReviewSection({ product, reviewSectionRef, handleUpdateRating }: ReviewSectionProps) {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth)
    const [page, setPage] = useState(1)
    const { data: canReviewData } = useQuery({
        queryKey: ["can-review-product", product._id],
        queryFn: () => getCanReviewProduct(product._id),
        enabled: !!product._id,
    })

    const canReview = useMemo(() => {
        if (!canReviewData) return false
        return canReviewData.canReview
    }, [canReviewData])

    const { data: productReviews, refetch } = useQuery({
        queryKey: ["product-reviews", product._id, page],
        queryFn: () => getProductReviews(product._id, page, 6),
        enabled: !!product._id,
    })

    const [isReviewOpen, setIsReviewOpen] = useState(false)
    const handleOpenReviewDialog = () => {
        if (!isAuthenticated) {
            toast.error("Vui lòng đăng nhập để viết đánh giá!")
            return
        }
        if (!canReview) {
            toast.error("Bạn chỉ có thể đánh giá sản phẩm sau khi mua hàng!")
            return
        }
        setIsReviewOpen(true)
    }

    const handleAddReviewSuccess = (newReview: Review) => {
        if (page !== 1) {
            setPage(1)
        }

        queryClient.setQueryData(
            ["product-reviews", product._id, 1],
            (oldData: any) => {
                if (!oldData) return oldData
                return {
                    ...oldData,
                    data: [newReview, ...oldData.data],
                }
            }
        )
        handleUpdateRating(newReview.rating)
        window.scrollTo({ top: (reviewSectionRef.current?.offsetTop || 0), behavior: "smooth" })
    }
    const rating = product?.ratingAvg || 0
    return (
        <div className="space-y-8">
            {/* HEADER + BUTTON */}
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Đánh giá sản phẩm</h3>
                <Button
                    onClick={handleOpenReviewDialog}
                    className="
                                    rounded-xl 
                                    bg-gradient-to-r 
                                    from-orange-500 
                                    to-orange-600 
                                    hover:from-orange-600 
                                    hover:to-orange-700
                                    shadow-md 
                                    hover:shadow-lg
                                    transition-all
                                  "
                >
                    Viết đánh giá
                </Button>
                <ReviewModal
                    isOpen={isReviewOpen && canReview}
                    onClose={() => setIsReviewOpen(false)}
                    item={product}
                    handleAddReviewSuccess={handleAddReviewSuccess}
                />
            </div>
            {/* OVERVIEW */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    {/* LEFT: SCORE */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <div className="text-5xl font-semibold text-gray-900">
                            {product?.ratingAvg?.toFixed(1) || "0.0"}
                        </div>
                        <StarRating rating={rating} />
                        <div className="text-sm text-gray-400 mt-1">
                            {product?.ratingCount || 0} đánh giá
                        </div>
                    </div>
                    {/* RIGHT: BREAKDOWN */}
                    <div className="md:col-span-2 space-y-1">
                        {[5, 4, 3, 2, 1].map((stars) => {
                            const count = product?.ratingBreakdown?.[stars] || 0
                            const total = product?.ratingCount || 0
                            const percent = total ? (count / total) * 100 : 0
                            return (
                                <div key={stars} className="flex items-center gap-3">
                                    <span className="text-sm text-gray-500 w-12">{stars} sao</span>

                                    <div className="flex-1 h-2 rounded-full bg-gray-100">
                                        <div
                                            className="h-2 rounded-full bg-yellow-400 transition-all duration-500"
                                            style={{ width: `${percent}%` }}
                                        />
                                    </div>

                                    <span className="text-sm text-gray-400 w-10 text-right">
                                        {count}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            {/* REVIEW LIST */}
            <div className="space-y-4">
                {(productReviews?.data ?? []).length === 0 && (
                    <div className="text-center py-10 text-muted-foreground">
                        Chưa có đánh giá nào
                    </div>
                )}

                {(productReviews?.data ?? []).map((i) => (
                    <div key={i._id} className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                        <div className="flex flex-col sm:flex-row gap-4">

                            <div className="flex items-start gap-3 min-w-[60px]">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={i.user?.avatar || undefined} />
                                    <AvatarFallback className="bg-orange-100 text-orange-600 font-semibold">
                                        {(i.user?.fullName || "U").charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                            </div>

                            <div className="flex-1 space-y-3">

                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                    <div>
                                        <div className="font-semibold text-gray-900">{i.user?.fullName || "Người dùng ẩn danh"}</div>
                                        <div className="flex items-center gap-1 mt-1">
                                            {[...Array(5)].map((_, j) => (
                                                <Star key={j} className={`h-4 w-4 ${j < i.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-400">{formatTimeAgo(i.createdAt)}</div>
                                </div>

                                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line" dangerouslySetInnerHTML={{ __html: i.comment }} />

                                {i.images?.length > 0 && (
                                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 xl:grid-cols-12 gap-2 pt-2">
                                        {i.images.map((img, idx) => (
                                            <div key={idx} className="overflow-hidden rounded-xl border cursor-pointer group">
                                                <img src={img.url} className="object-cover w-full aspect-square transition-transform duration-300 group-hover:scale-110" />
                                            </div>
                                        ))}
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* PAGINATION */}
            {productReviews && productReviews?.pagination?.totalPages > 1 && (
                <div className="flex justify-center gap-2 pt-6">
                    {Array.from(
                        { length: productReviews.pagination.totalPages },
                        (_, index) => (
                            <button
                                key={index}
                                onClick={() => setPage(index + 1)}
                                className={`px-3 py-1 rounded-lg border ${page === index + 1
                                    ? "bg-orange-500 text-white"
                                    : ""
                                    }`}
                            >
                                {index + 1}
                            </button>
                        )
                    )}
                </div>
            )}
        </div>
    )
}