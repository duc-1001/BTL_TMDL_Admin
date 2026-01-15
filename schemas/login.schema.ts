import {z} from "zod"

export const loginSchema = z.object({
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự"),
    rememberMe: z.boolean().optional(),
})

export type LoginForm = z.infer<typeof loginSchema>