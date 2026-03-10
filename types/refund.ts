import { OrderItemSnapshot } from "./order";

export type RefundStatus = "none" | "pending" | "processing" | "completed" | "rejected"

export interface CalculateRefund {
    subtotalRefund: number;
    itemRefund: number;
    shippingRefund: number;
    totalRefund: number;
}

export type ReasonCode =
    | "DEFECTIVE"
    | "WRONG_ITEM"
    | "MISSING_ITEM"
    | "NOT_AS_DESCRIBED"
    | "OTHER";

export interface RefundItemPayload {
    productId: string;
    quantity: number;
}

export interface RefundImagePayload {
    url: string;
    imagePublicId: string;
}

export interface BankInfoPayload {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
}

export interface CreateRefundPayload {
    orderCode: string;
    paymentMethod: "cod" | "banking";

    type: "full" | "partial";

    reasonCode: ReasonCode;
    reason?: string;

    note?: string;

    images?: RefundImagePayload[];

    refundDestination?: "original" | "bank";

    refundBankInfo?: BankInfoPayload | null;

    items?: RefundItemPayload[];
}

export interface RefundAmountData {
    subtotalRefund: number;
    itemRefund: number;
    shippingRefund: number;
    totalRefund: number;
}

export interface RefundUserDetail {
    _id: string;
    orderCode: string;
    refundCode: string;

    userId?: string | null;

    type: "full" | "partial";

    reasonCode: ReasonCode;
    reason?: string;

    note?: string;

    status: RefundStatus;

    items: OrderItemSnapshot[];

    images: RefundImagePayload[];

    paymentMethod: "cod" | "banking";

    refundDestination?: "original" | "bank";

    refundBankInfo?: BankInfoPayload | null;

    refundAmountData: RefundAmountData;

    createdAt: string;
    updatedAt: string;
}

export interface RefundSummary {
    _id: string
    orderCode: string
    refundCode: ReasonCode
    reason?: string

    status: string
    createdAt: string

    totalRefund: number

    itemCount: number
    type: "full" | "partial"

    reasonCode: string

    refundDestination: "original" | "bank"
}

export interface ListRefundItem {
    _id: string;
    orderCode: string;
    refundCode: string;

    status: RefundStatus;
    createdAt: string;
    totalRefund: number;

    items: OrderItemSnapshot[];
    type: "full" | "partial";
    reason: string;
    viewToken: string;
}