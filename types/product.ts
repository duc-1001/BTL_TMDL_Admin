// src/types/product.ts

export type Product = {
    _id: string

    // ===== basic info =====
    name: string
    slug: string
    description?: string

    // ===== pricing =====
    price: number
    originalPrice: number
    shortDescription: string,
    highlights: string[],

    // ===== relations =====
    category: {
        _id: string
        name: string
        slug: string
    } | null

    brand: {
        _id: string
        name: string
        slug: string
        logo?: string
    } | null

    // ===== inventory =====
    stock: number
    soldQuantity: number
    sku?: string

    // ===== food info =====
    weight: number
    unit: "g" | "kg"
    origin?: string
    ingredient?: string
    allergens?: string[]
    storageInstruction?: string

    // ===== media =====
    images: {
        url: string
    }[]

    thumbnail?: string

    // ===== flags =====
    isFeatured: boolean
    isActive: boolean
    isOutOfStock?: boolean

    // ===== batch helper (admin only) =====
    nearestExpirationDate?: string | null

    // ===== misc =====
    tags: string[]

    // ===== meta =====
    createdAt: string
    updatedAt: string,
    rating?: number
    discount: number
    reviewCount?: number
    badge?: string
    isLiked?: boolean
}


// src/types/product-admin.ts

export type ProductAdmin = {
    _id: string
    name: string
    price: number
    originalPrice?: number
    category: {
        _id: string
        name: string
    }

    brand: {
        _id: string
        name: string
        logo?: string
    }

    images: {
        url: string
    }[]

    thumbnail: string

    stock: number
    soldQuantity: number
    isOutOfStock: boolean

    nearestExpirationDate?: string

    isActive: boolean
    isFeatured: boolean

    createdAt: string
}

// src/types/product-edit.ts

export type ProductEdit = {
    _id: string

    // ===== basic =====
    name: string
    slug: string
    description?: string

    // ===== pricing =====
    price: number
    originalPrice?: number

    // ===== relations (để select) =====
    category: {
        _id: string
        name: string
        slug: string
    } | null

    brand: {
        _id: string
        name: string
        slug: string
        logo?: string
    } | null

    // ===== inventory =====
    sku?: string
    stock: number

    // ===== food info =====
    weight: number
    unit: "g" | "kg"

    origin?: string
    ingredient?: string
    allergens?: string[]
    storageInstruction?: string

    // ===== media =====
    images: {
        url: string
        imagePublicId: string
    }[]

    // ===== flags =====
    isFeatured: boolean
    isActive: boolean

    // ===== misc =====
    tags?: string[]

    // ===== meta =====
    createdAt: string
    updatedAt: string

    shortDescription: string,
    highlights: string[],
}

export type BasicProductForm = {
    _id: string,
    name: string,
    sku?: string,
    isActive?: boolean,
    category: {
        _id: string,
        name: string
    },
    brand: {
        _id: string,
        name: string
    },
    originalPrice: number,
    price: number,
    stock: number
}

export type BatchProductStatus = {
    totalBatches: number,
    activeBatches: number,
    expiringSoonBatches: number,
    expiredOrEmptyBatches: number,
}

export type ProductBatch = {
    _id: string,
    quantity: number,
    remainingQuantity: number,
    expirationDate: string,
    importedAt: string,
    importPrice: number,
    status: "active" | "expired" | "sold_out" | "near_expiry" | "disposed",
}

export type HomeProduct = {
    _id: string
    name: string
    slug: string
    price: number
    originalPrice: number
    image: string
    stock: number
    soldQuantity: number
    rating?: number
    discount: number
    reviewCount?: number
    badge?: string
    description?: string
    shortDescription?: string
    isLiked?: boolean
}

export type SimilarProduct = {
    _id: string
    name: string
    slug: string
    price: number
    originalPrice: number
    image: string
    stock: number
    soldQuantity: number
    rating?: number
    discount: number
    reviewCount?: number
    badge?: string
    description?: string
    shortDescription?: string
}
