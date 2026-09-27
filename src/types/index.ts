export type Category =
  | "smartphones"
  | "phone-accessories"
  | "audio"
  | "smart-devices"
  | "computing"
  | "electronics";

export interface Variant {
  type: "Color" | "Storage" | "Size";
  options: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: Category;
  price: number;
  previousPrice?: number;
  images: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  featured?: boolean;
  bestSeller?: boolean;
  deal?: boolean;
  description: string;
  specs: { label: string; value: string }[];
  variants?: Variant[];
  createdAt: string; // ISO date, used for "Newest" sort
}

export interface CartVariantSelection {
  [variantType: string]: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  selectedVariants: CartVariantSelection;
}

export interface Coupon {
  code: string;
  type: "percent" | "flat";
  value: number;
  minSubtotal?: number;
}

export type OrderStatus = "processing" | "confirmed";

export interface Order {
  orderNumber: string;
  createdAt: string;
  customer: { fullName: string; email: string; phone: string };
  delivery: {
    state: string;
    lga: string;
    address: string;
    instructions?: string;
    method: "standard" | "express";
  };
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  paymentStatus: "paid";
  status: OrderStatus;
  estimatedDelivery: string;
}
