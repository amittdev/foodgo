import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateSubtotal,
  calculateDiscount,
  calculateDeliveryFee,
  calculateTaxes,
  computeBillBreakdown,
  FREE_DELIVERY_THRESHOLD,
  STANDARD_DELIVERY_FEE,
  PLATFORM_FEE,
} from './orderLogic.ts';
import type { CartItem, Coupon } from '../types/index.ts';

const dummyItem1: CartItem = {
  restaurantId: 'rest-1',
  restaurantName: 'Burger House',
  quantity: 2,
  item: {
    id: 'item-1',
    name: 'Classic Cheeseburger',
    description: 'Juicy beef patty',
    price: 12.5,
    image: '',
    isVeg: false,
    category: 'Burgers',
  },
};

const dummyItem2: CartItem = {
  restaurantId: 'rest-1',
  restaurantName: 'Burger House',
  quantity: 1,
  item: {
    id: 'item-2',
    name: 'Crispy Fries',
    description: 'Golden salted fries',
    price: 4.99,
    image: '',
    isVeg: true,
    category: 'Starters',
  },
};

test('calculateSubtotal sums up items accurately', () => {
  const subtotal = calculateSubtotal([dummyItem1, dummyItem2]);
  // 12.50 * 2 + 4.99 = 29.99
  assert.equal(subtotal, 29.99);
});

test('calculateDeliveryFee applies standard fee below threshold and free above', () => {
  assert.equal(calculateDeliveryFee(25), STANDARD_DELIVERY_FEE);
  assert.equal(calculateDeliveryFee(FREE_DELIVERY_THRESHOLD), 0);
  assert.equal(calculateDeliveryFee(50), 0);
  assert.equal(calculateDeliveryFee(0), 0);
});

test('calculateDiscount handles coupons with minimum order and max discount cap', () => {
  const coupon50: Coupon = {
    code: 'FOODIE50',
    discountPercent: 50,
    maxDiscount: 10,
    minOrder: 20,
    description: '50% off up to $10',
  };

  // Subtotal below minOrder
  assert.equal(calculateDiscount(15, coupon50), 0);

  // Subtotal eligible, 50% of 25 = 12.5, capped at 10
  assert.equal(calculateDiscount(25, coupon50), 10);

  // Subtotal eligible, 50% of 16 = 8, within cap
  assert.equal(calculateDiscount(16, { ...coupon50, minOrder: 10 }), 8);
});

test('computeBillBreakdown calculates all fields including taxes and grand total correctly', () => {
  const coupon: Coupon = {
    code: 'TASTY20',
    discountPercent: 20,
    maxDiscount: 15,
    minOrder: 20,
    description: '20% off',
  };

  const breakdown = computeBillBreakdown([dummyItem1, dummyItem2], coupon);
  // subtotal = 29.99
  assert.equal(breakdown.subtotal, 29.99);

  // 20% of 29.99 = 5.998 => 6.00
  assert.equal(breakdown.discount, 6.00);

  // subtotal (29.99) < 30, so delivery fee = 3.99
  assert.equal(breakdown.deliveryFee, STANDARD_DELIVERY_FEE);
  assert.equal(breakdown.platformFee, PLATFORM_FEE);

  // taxable = 29.99 - 6.00 = 23.99
  // taxes = 23.99 * 0.08 = 1.9192 => 1.92
  assert.equal(breakdown.taxes, 1.92);

  // grandTotal = 23.99 + 3.99 + 1.49 + 1.92 = 31.39
  assert.equal(breakdown.grandTotal, 31.39);
  assert.equal(breakdown.amountNeededForFreeDelivery, 0.01);
});
