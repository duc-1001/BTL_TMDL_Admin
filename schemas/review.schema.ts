import { z } from "zod";

const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB (tuỳ bạn)

export const reviewSchema = z.object({
    rating: z.number({ message: "Vui lòng nhập đánh giá" }).min(1, "Đánh giá phải lớn hơn hoặc bằng 1").max(5, "Đánh giá phải nhỏ hơn hoặc bằng 5"),
    comment: z.string({ message: "Vui lòng nhập bình luận" }).max(1000, "Bình luận không được vượt quá 1000 ký tự").optional(),
    images: z
        .array(
            z
                .union([z.instanceof(File), z.string()])
                .refine(
                    (file) =>
                        typeof file === "string" ||
                        ACCEPTED_IMAGE_TYPES.includes(file.type),
                    { message: "Ảnh chỉ chấp nhận định dạng PNG, JPG hoặc WEBP" }
                )
                .refine(
                    (file) =>
                        typeof file === "string" || file.size <= MAX_FILE_SIZE,
                    { message: "Dung lượng ảnh tối đa 10MB" }
                )
        )
});

export type ReviewFormData = z.infer<typeof reviewSchema>;
