
export interface User {
  userName: string;
  userFirstName?: string;
  userLastName?: string;
  email?: string;
  roles: string[];
}

export interface LoginResponse {
  jwtToken: string;
  user: {
    userName: string;
    userFirstName?: string;
    userLastName?: string;
    email?: string;
    roles: { roleName: string }[];
  };
}

export interface Brand {
  id?: number;
  name: string;
  description?: string;
  logoUrl?: string;
}

export interface Category {
  id?: number;
  name: string;
  imageUrl?: string;
  parentId?: number;
}
// export interface Product {
//   id?: number;
//   name: string;
//   description?: string;
//   price: number;
//   discountPrice?: number;
//   sku?: string;
//   stockQuantity: number;
//   brandId?: number;
//   categoryIds?: number[];
//   images?: string[];
// }

export interface Product {
createdAt: string|number|Date;
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice: number;
  active: boolean;
  sku: string;
  stockQuantity: number;
  brandName: string;
  brandId: number;
  categories: string[];
  categoryIds: number[];
  images: string[];
}

export interface ProductRequest {
  name: string;
  description?: string;
  price: number;
  discountPrice?: number;
  sku?: string;
  stockQuantity: number;
  brandId?: number;
  categoryIds?: number[];
  imageUrls?: string[]; // For existing image URLs when updating
}

// Add these DTOs if needed
export interface ProductImageDTO {
  id?: number;
  imageUrl: string;
  primaryImage?: boolean;
  productId?: number;
}

export interface ProductReviewDTO {
  id?: number;
  rating: number;
  comment?: string;
  productId: number;
  userId: string;
}

export interface ProductVariantDTO {
  id?: number;
  variantName: string;
  variantValue: string;
  priceAdjustment?: number;
  stock?: number;
  productId: number;
}


export interface CartDto {
  cartId?: number;
  items: ItemDto[];
  totalAmount: number;
}

// export interface ItemDto {
//   itemId: number;
//   productId: number;
//   productName: string;
//   quantity: number;
//   price: number;
//   total: number;
// }

export interface CartItemRequest {
  productId: number;
  quantity: number;
}
export interface ItemDto {
  itemId: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  total: number;  // quantity * price
  imageUrl?: string;
}

export interface OrderDto {
  orderId: number;
  totalAmount: number;
  status: string; // Enum name as string, e.g., "PENDING", "PAID"
  paymentMethod: string; // e.g., "CREDIT_CARD", "PAYPAL", "CASH_ON_DELIVERY"
  items: ItemDto[]; // List of order items

  createdAt?: string; // Backend থেকে ISO string আকারে আসবে (e.g., "2025-12-30T15:30:00")
  userName?: string;

  shippingAddressInfo?: string;

  
}
