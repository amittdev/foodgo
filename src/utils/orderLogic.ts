import type { CartItem, Coupon } from '../types/index.ts';

export interface BillBreakdown {
  subtotal: number;
  deliveryFee: number;
  platformFee: number;
  taxes: number;
  discount: number;
  grandTotal: number;
  freeDeliveryThreshold: number;
  amountNeededForFreeDelivery: number;
}

export const FREE_DELIVERY_THRESHOLD = 30;
export const STANDARD_DELIVERY_FEE = 3.99;
export const PLATFORM_FEE = 1.49;
export const TAX_RATE = 0.08; // 8%

/**
 * Calculates subtotal of items in cart
 */
export function calculateSubtotal(items: CartItem[]): number {
  const sum = items.reduce((acc, curr) => {
    return acc + curr.item.price * curr.quantity;
  }, 0);
  return Number(sum.toFixed(2));
}

/**
 * Calculates discount based on coupon rules
 */
export function calculateDiscount(subtotal: number, coupon: Coupon | null): number {
  if (!coupon) return 0;
  if (subtotal < coupon.minOrder) return 0;

  const rawDiscount = (subtotal * coupon.discountPercent) / 100;
  const appliedDiscount = Math.min(rawDiscount, coupon.maxDiscount);
  return Number(appliedDiscount.toFixed(2));
}

/**
 * Calculates delivery fee based on order subtotal
 */
export function calculateDeliveryFee(subtotal: number): number {
  if (subtotal === 0) return 0;
  if (subtotal >= FREE_DELIVERY_THRESHOLD) return 0;
  return STANDARD_DELIVERY_FEE;
}

/**
 * Calculates taxes based on discounted subtotal
 */
export function calculateTaxes(taxableAmount: number): number {
  if (taxableAmount <= 0) return 0;
  return Number((taxableAmount * TAX_RATE).toFixed(2));
}

/**
 * Computes complete bill breakdown
 */
export function computeBillBreakdown(items: CartItem[], coupon: Coupon | null): BillBreakdown {
  const subtotal = calculateSubtotal(items);
  if (subtotal === 0) {
    return {
      subtotal: 0,
      deliveryFee: 0,
      platformFee: 0,
      taxes: 0,
      discount: 0,
      grandTotal: 0,
      freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
      amountNeededForFreeDelivery: FREE_DELIVERY_THRESHOLD,
    };
  }

  const discount = calculateDiscount(subtotal, coupon);
  const deliveryFee = calculateDeliveryFee(subtotal);
  const platformFee = PLATFORM_FEE;
  const taxableAmount = Math.max(0, subtotal - discount);
  const taxes = calculateTaxes(taxableAmount);
  const grandTotal = Number((taxableAmount + deliveryFee + platformFee + taxes).toFixed(2));

  const amountNeededForFreeDelivery =
    subtotal >= FREE_DELIVERY_THRESHOLD
      ? 0
      : Number((FREE_DELIVERY_THRESHOLD - subtotal).toFixed(2));

  return {
    subtotal,
    deliveryFee,
    platformFee,
    taxes,
    discount,
    grandTotal,
    freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
    amountNeededForFreeDelivery,
  };
}

/**
 * Format currency nicely
 */
export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

/**
 * Estimate order arrival time
 */
export function getEstimatedDeliveryTime(prepTimeMin: number = 30): string {
  const now = new Date();
  const arrival = new Date(now.getTime() + prepTimeMin * 60000);
  return arrival.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
