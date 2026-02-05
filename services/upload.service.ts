import { ApiClient } from "@/lib/apiClient";
import { buildFormData } from "@/lib/formData";
import { CaculateCartPricing, Cart, GuestCartItem } from "@/types/cart";
import { ApiResponse } from "@/types/commons";


export const uploadFile = async (file: File, type: 'product' | 'system' | 'category' | 'user') => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await ApiClient.post<ApiResponse<{ url: string,imagePublicId: string }>>(`/upload/image?type=${type}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
}