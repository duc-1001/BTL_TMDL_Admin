import { ApiClient } from "@/lib/apiClient";
import { ApiResponse } from "@/types/commons";
import { CalculateRefund,CreateRefundPayload, ListRefundItem, RefundUserDetail } from "@/types/refund";


export const calculateRefund = async (payload: {
    orderCode: string;
    type: string;
    items?: Array<{ productId: string; quantity: number }>
    viewToken: string
}) => {
    const response = await ApiClient.post<ApiResponse<CalculateRefund>>("/refunds/calculate", payload);
    return response.data;
}

export const createRefund = async (payload: CreateRefundPayload, viewToken: string) => {
    const response = await ApiClient.post<ApiResponse>("/refunds", { ...payload, viewToken });
    return response.data;
}

export const getRefundDetails = async (
    order_code: string,
    viewToken: string
) => {
    const response = await ApiClient.get<ApiResponse<RefundUserDetail>>(`/refunds/${order_code}`, {
        viewToken
    });
    return response.data;
}

export const getMyRefunds = async () => {
    const response = await ApiClient.get<ApiResponse<ListRefundItem[]>>("/refunds/me");
    return response.data;
}