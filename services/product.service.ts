import { ApiClient } from "@/lib/apiClient";
import { buildFormData } from "@/lib/formData";
import { ApiResponse, PaginatedData } from "@/types/commons";
import { BasicProductForm, BatchProductStatus, HomeProduct, Product,ProductAdmin, ProductBatch, ProductEdit, BasicProductCard, ProductForSelect } from "@/types/product";

export const createProduct = async (data: any) => {
    const formData = buildFormData(data);
    const response = await ApiClient.post<ApiResponse>('/products', formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response;
}

export const editProduct = async (id: string, data: any) => {
    const formData = buildFormData(data);
    const response = await ApiClient.put<ApiResponse>(`/products/${id}`, formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response;
}

export const getAllProductsAdmin = async (page: number, limit: number, q?: string) => {
    const params = { page, limit, q }
    const response = await ApiClient.get<PaginatedData<ProductAdmin>>('/products/admin', params);
    return response
}

export const getProductByIdAdmin = async (id: string) => {
    const response = await ApiClient.get<ApiResponse<ProductEdit>>(`/products/admin/${id}`);
    return response.data;
}

export const updateProductStatus = async (productId: string) => {
    const response = await ApiClient.patch<ApiResponse>(`/products/${productId}/status`);
    return response;
}

export const deleteProduct = async (productId: string) => {
    const response = await ApiClient.delete<ApiResponse>(`/products/${productId}`);
    return response;
}

export const getProductBasicInfo = async (productId:string) => {
    const response = await ApiClient.get<ApiResponse<BasicProductForm>>(`/products/admin/${productId}/basic`);
    return response.data;
}

export const getBatchProductStatus  = async (productId:string) => {
    const response = await ApiClient.get<ApiResponse<BatchProductStatus>>(`/products/admin/${productId}/batch-status`);
    return response.data;
}

export const getProductBatchesAdmin  = async (productId:string, page:number, limit:number) => {
    const params = { page, limit }
    const response = await ApiClient.get<PaginatedData<ProductBatch>>(`/products/admin/${productId}/batches`, params);
    return response;
}

export const updateBatchQuantity = async (productId:string, data:any) => {
    const response = await ApiClient.put<ApiResponse>(`/products/admin/${productId}/batches/${data.batchId}`, { quantity: data.quantity });
    return response;
}

export const createProductBatch = async (productId:string, data:any) => {
    const formData = buildFormData(data);
    const response = await ApiClient.post<ApiResponse>(`/products/admin/${productId}/batches`, formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response;
}

export const getProductForSelect = async (q?: string, limit?: number, category_id?: string) => {
    const params = { q, limit, category_id }
    const response = await ApiClient.get<ApiResponse<ProductForSelect[]>>('/products/admin/for-select', params);
    return response.data;
}

//user

export const getHomeProducts = async (limit:number) => {
    const response = await ApiClient.get<ApiResponse<HomeProduct[]>>('/products/home',{limit});
    return response.data;
}

export const getProductBySlug = async (slug: string) => {
    const response = await ApiClient.get<ApiResponse<Product>>(`/products/${slug}`);
    return response.data;
}

export const getSimilarProducts = async (id: string, limit: number = 4) => {
    const params = { limit }
    const response = await ApiClient.get<ApiResponse<BasicProductCard[]>>(`/products/${id}/similar`, params);
    return response.data;
}
