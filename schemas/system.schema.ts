import {z} from "zod";

export const SystemSettingsSchema = z.object({
    websiteName: z.string().min(1, "Tên website là bắt buộc"),
    shortName: z.string().min(1, "Tên viết tắt là bắt buộc"),
    websiteDescription: z.string().optional()
});

export const ContactSettingsSchema = z.object({
    contactEmail: z.string().email("Địa chỉ email không hợp lệ").optional(),
    contactPhone: z.string().optional(),
    contactAddress: z.string().optional(),
    contactMapEmbed: z.string().optional(),
    province: z.object({
        code: z.string().optional(),
        name: z.string().optional(),
    }),
    ward: z.object({
        code: z.string().optional(),
        name: z.string().optional(),
    }),
});

export type SystemSettings = z.infer<typeof SystemSettingsSchema>;
export type ContactSettings = z.infer<typeof ContactSettingsSchema>;
