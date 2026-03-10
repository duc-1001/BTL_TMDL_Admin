/* ================= REVIEW BASE ================= */

export interface ReviewImage {
  url: string
  imagePublicId: string
}

export interface ReviewUser {
  _id: string
  fullName: string
  avatar?: string | null
}

/* ================= PUBLIC REVIEW ================= */

export interface Review {
  _id: string
  rating: number
  comment: string
  images: ReviewImage[]
  createdAt: string
  user: ReviewUser | null
}

/* ================= CREATE REVIEW ================= */

export interface CreateReviewPayload {
  productId: string
  rating: number
  comment?: string
  images?: ReviewImage[]
}


/* ================= LIST REVIEW ================= */

export interface ReviewListResponse {
  data: Review[]
  total: number
  page: number
  limit: number
}

/* ================= ADMIN REVIEW ================= */

export interface AdminReview extends Review {
  userId: string
  productId: string
  isDeleted: boolean
  isHidden: boolean
  hiddenReason?: string | null
  hiddenAt?: string | null
  hiddenBy?: string | null
}