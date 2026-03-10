import React from 'react'
import { Star } from 'lucide-react'
import { Button } from '../ui/button'
import { formatPrice } from '@/lib/utils'
import { ReviewModal } from './review-modal'
import { OrderItemSnapshot, OrderStatus } from '@/types/order'

interface OrderItemDetailPageProps {
    item: OrderItemSnapshot
    canReview: boolean
}

const OrderItemDetailPage = ({ item, canReview }: OrderItemDetailPageProps) => {
    const [showReviewDialog, setShowReviewDialog] = React.useState(false)
    return (
        <div className="pb-4 border-b last:border-0">
            <div className="flex gap-4 mb-3">
                <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-muted shrink-0">
                    <img src={item.image?.url} alt={item.name} className="h-full m-auto object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm mb-1">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">Số lượng: {item.quantity}</p>
                </div>
                <div className="text-right">
                    <p className="font-semibold text-orange-500">{formatPrice(item.price * item.quantity)}</p>
                    <p className="text-xs text-muted-foreground">{formatPrice(item.price)}/cái</p>
                </div>
            </div>
            {canReview && (
                <>
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-transparent gap-2 text-xs"
                        onClick={() => {
                            setShowReviewDialog(true)
                        }}
                    >
                        <Star className="h-3 w-3" />
                        Đánh giá sản phẩm
                    </Button>
                    <ReviewModal
                        isOpen={showReviewDialog && canReview}
                        onClose={() => setShowReviewDialog(false)}
                        item={item}
                    />
                </>
            )}
        </div>
    )
}

export default OrderItemDetailPage
