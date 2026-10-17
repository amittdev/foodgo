export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  isVeg: boolean;
  isBestseller?: boolean;
  category: string;
  rating?: number;
  ratingCount?: number;
  tags?: string[];
}

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  image: string;
  coverImage: string;
  rating: number;
  ratingCount: number;
  cuisines: string[];
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  priceForTwo: number;
  deliveryFee: number;
  address: string;
  area: string;
  isVegOnly?: boolean;
  hasOffers?: boolean;
  offerText?: string;
  description: string;
  featured?: boolean;
  menu: MenuItem[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  restaurantCount: number;
  description?: string;
}

export interface CartItem {
  restaurantId: string;
  restaurantName: string;
  item: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  maxDiscount: number;
  minOrder: number;
  description: string;
}

export interface Address {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  street: string;
  city: string;
  zip: string;
  landmark?: string;
  isDefault?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  addresses: Address[];
  favorites: string[]; // Restaurant IDs
}

export type OrderStatus =
  | 'placed'
  | 'accepted'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface Order {
  id: string;
  createdAt: string;
  restaurantId: string;
  restaurantName: string;
  items: {
    name: string;
    quantity: number;
    price: number;
    isVeg: boolean;
  }[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  taxes: number;
  total: number;
  deliveryAddress: Address;
  paymentMethod: string;
  status: OrderStatus;
  estimatedDeliveryMin: number;
  deliveryPartner?: {
    name: string;
    phone: string;
    rating: number;
    vehicle: string;
    photo: string;
  };
}

export interface FilterOptions {
  searchQuery: string;
  category: string;
  cuisines: string[];
  sortBy: 'recommended' | 'rating' | 'deliveryTime' | 'costLowHigh' | 'costHighLow';
  vegOnly: boolean;
  minRating: number;
  maxDeliveryTime: number;
  priceRange: string;
}
