"use client"

import { OrderShippingInfo } from "@/types/order"
import RefundForm from "../refund/refund-form"
import RefundSummaryTab from "../refund/refund-summary"


interface RefundSectionTabProps {
    order: OrderShippingInfo
    tab: string
    handleRefundSuccess: () => void
    setCodeError: React.Dispatch<React.SetStateAction<string | null>>
    token: string 
}

export default function RefundSectionTab({ order, tab, handleRefundSuccess, setCodeError, token }: RefundSectionTabProps) {

    if (order.refundStatus !== "none") {
        return <RefundSummaryTab order={order} viewToken={token} />
    }

    return (
        <RefundForm order={order} tab={tab} handleRefundSuccess={handleRefundSuccess} setCodeError={setCodeError} token={token} />
    )
}