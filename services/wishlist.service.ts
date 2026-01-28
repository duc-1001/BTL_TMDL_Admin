import { ApiClient } from "@/lib/apiClient";
import { buildFormData } from "@/lib/formData";
import { UserAddressForm } from "@/schemas/user_address.shema";
import { User } from "@/types/auth";
import { ApiResponse } from "@/types/commons";
import { HomeProduct } from "@/types/product";

export const getWishlist = async () => {
    const response = await ApiClient.get<ApiResponse<HomeProduct[]>>('/api/wishlist');
    return response.data;
}

export const addToWishlist = async (productId: string) => {
    const response = await ApiClient.post<ApiResponse>('/api/wishlist', { productId });
    return response.data;
}

export const removeFromWishlist = async (productId: string) => {
    const response = await ApiClient.delete<ApiResponse>(`/api/wishlist/${productId}`);
    return response.data;
}