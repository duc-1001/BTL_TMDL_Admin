import { ApiClient } from "@/lib/apiClient";
import { ApiResponse } from "@/types/commons";
import { CreateReviewPayload, Review } from "@/types/review";


export const createReview = async (payload: CreateReviewPayload) => {
  const response = await ApiClient.post<ApiResponse<Review>>("/reviews", payload);
  return response.data;
}