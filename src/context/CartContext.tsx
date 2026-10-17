import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, MenuItem, Coupon } from '../types';
import { COUPONS } from '../data/mockData';
import { computeBillBreakdown, BillBreakdown } from '../utils/orderLogic';
import { useToast } from './ToastContext';

interface CartContextType {
  items: CartItem[];
  restaurantId: string | null;
  restaurantName: string | null;
  totalCount: number;
  bill: BillBreakdown;
  appliedCoupon: Coupon | null;
  specialInstructions: string;
  addItem: (item: MenuItem, restaurantId: string, restaurantName: string) => boolean;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  setSpecialInstructions: (note: string) => void;
  getItemQuantity: (itemId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'foodiego_cart_v1';
const COUPON_STORAGE_KEY = 'foodiego_coupon_v1';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { showToast } = useToast();

  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    try {
      const stored = localStorage.getItem(COUPON_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [specialInstructions, setSpecialInstructions] = useState<string>('');

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items]);

  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save coupon to localStorage', e);
    }
  }, [appliedCoupon]);

  const restaurantId = items.length > 0 ? items[0].restaurantId : null;
  const restaurantName = items.length > 0 ? items[0].restaurantName : null;

  const totalCount = items.reduce((acc, curr) => acc + curr.quantity, 0);
  const bill = computeBillBreakdown(items, appliedCoupon);

  const addItem = (item: MenuItem, rId: string, rName: string): boolean => {
    if (items.length > 0 && items[0].restaurantId !== rId) {
      // Switching restaurant: clear existing or inform
      const confirmReplace = window.confirm(
        `Your cart contains items from "${items[0].restaurantName}". Would you like to clear your cart and start a new order from "${rName}"?`
      );
      if (!confirmReplace) return false;
      setItems([{ restaurantId: rId, restaurantName: rName, item, quantity: 1 }]);
      showToast(`Added ${item.name} from ${rName}`, 'success');
      return true;
    }

    setItems((prev) => {
      const existingIndex = prev.findIndex((ci) => ci.item.id === item.id);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + 1,
        };
        return next;
      } else {
        return [...prev, { restaurantId: rId, restaurantName: rName, item, quantity: 1 }];
      }
    });

    showToast(`Added ${item.name} to cart`, 'success');
    return true;
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((ci) => ci.item.id !== itemId));
    showToast('Item removed from cart', 'info');
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setItems((prev) => {
      return prev
        .map((ci) => {
          if (ci.item.id === itemId) {
            const newQty = ci.quantity + delta;
            return newQty > 0 ? { ...ci, quantity: newQty } : null;
          }
          return ci;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    setSpecialInstructions('');
    localStorage.removeItem(CART_STORAGE_KEY);
    localStorage.removeItem(COUPON_STORAGE_KEY);
  };

  const applyCoupon = (code: string): boolean => {
    const trimmed = code.trim().toUpperCase();
    const found = COUPONS.find((c) => c.code.toUpperCase() === trimmed);
    if (!found) {
      showToast('Invalid coupon code. Try FOODIE50 or TASTY20', 'error');
      return false;
    }

    const currentSubtotal = items.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0);
    if (currentSubtotal < found.minOrder) {
      showToast(`Minimum order of $${found.minOrder} required for ${found.code}`, 'error');
      return false;
    }

    setAppliedCoupon(found);
    showToast(`Coupon ${found.code} applied successfully!`, 'success');
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  const getItemQuantity = (itemId: string): number => {
    const item = items.find((ci) => ci.item.id === itemId);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        restaurantId,
        restaurantName,
        totalCount,
        bill,
        appliedCoupon,
        specialInstructions,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        setSpecialInstructions,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
