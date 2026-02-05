import { AppliedDiscount } from "./discount";

export interface CartItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

export interface Cart {
    items: CartItem[];
    DiscountMode: "auto" | "manual";
}

export type GuestCartItem = {
  productId: string
  quantity: number
}

export type CaculateCartPricing = {
    subtotal: number;
    discountDiscount: number;
    couponDiscount: number;
    totalPrice: number;
    shippingFee: number;
    discount: number;
    appliedDiscounts: AppliedDiscount[];
    appliedCoupons: ApplyCoupon[] ;
}

export type ApplyCoupon = {
    _id: string;
    code: string;
    name: string;
    description: string;
    type: string;   
    value: number;
    maxDiscountValue: number;
    minOrderValue: number;
    discountValue: number;
}