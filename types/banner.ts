export interface CreateNewBanner {
    title: string;
    subtitle?: string;
    buttonText?: string;
    buttonLink?: string;
    backgroundImage?: File | string;
    isActive?: boolean;
    order?: number;
    startAt?: string;
    endAt?: string;
}

export interface HeroBanner extends CreateNewBanner {
    _id: string;
    createdAt: string;
    updatedAt: string;
}