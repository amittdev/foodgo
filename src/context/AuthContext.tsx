import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, Address, Order, OrderStatus } from '../types';
import { INITIAL_USER, INITIAL_ORDERS } from '../data/mockData';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: UserProfile | null;
  isLoggedIn: boolean;
  selectedAddress: Address | null;
  currentLocation: string;
  orders: Order[];
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'signup';
  openAuthModal: (tab?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
  login: (email: string, pass: string) => boolean;
  signup: (name: string, email: string, phone: string, pass: string) => boolean;
  logout: () => void;
  setCurrentLocation: (loc: string) => void;
  setSelectedAddress: (addr: Address) => void;
  addAddress: (addr: Omit<Address, 'id'>) => void;
  deleteAddress: (id: string) => void;
  toggleFavorite: (restaurantId: string) => void;
  isFavorite: (restaurantId: string) => boolean;
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => Order;
  getOrder: (id: string) => Order | undefined;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  simulateIncomingOrder: () => Order;
}

const USER_STORAGE_KEY = 'foodiego_user_v1';
const ORDERS_STORAGE_KEY = 'foodiego_orders_v1';
const LOCATION_STORAGE_KEY = 'foodiego_loc_v1';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { showToast } = useToast();

  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      return stored ? JSON.parse(stored) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [currentLocation, setCurrentLocationState] = useState<string>(() => {
    try {
      return localStorage.getItem(LOCATION_STORAGE_KEY) || 'Downtown, Central Plaza';
    } catch {
      return 'Downtown, Central Plaza';
    }
  });

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(() => {
    return user?.addresses[0] || null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to sync user storage', e);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to sync orders storage', e);
    }
  }, [orders]);

  const setCurrentLocation = (loc: string) => {
    setCurrentLocationState(loc);
    try {
      localStorage.setItem(LOCATION_STORAGE_KEY, loc);
    } catch {}
    showToast(`Location set to ${loc}`, 'info');
  };

  const openAuthModal = (tab: 'login' | 'signup' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = (email: string, _pass: string): boolean => {
    if (!email) {
      showToast('Please enter your email or phone', 'error');
      return false;
    }
    const loggedInUser: UserProfile = {
      ...INITIAL_USER,
      email,
      name: email.split('@')[0] || 'Foodie Member',
    };
    setUser(loggedInUser);
    closeAuthModal();
    showToast(`Welcome back, ${loggedInUser.name}!`, 'success');
    return true;
  };

  const signup = (name: string, email: string, phone: string, _pass: string): boolean => {
    if (!name || !email) {
      showToast('Please fill in all required fields', 'error');
      return false;
    }
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name,
      email,
      phone: phone || '+1 (555) 000-0000',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      favorites: ['rest-burger-house'],
      addresses: [
        {
          id: `addr-${Date.now()}`,
          type: 'Home',
          street: '100 Innovation Way',
          city: 'Metropolis',
          zip: '90001',
          isDefault: true,
        },
      ],
    };
    setUser(newUser);
    closeAuthModal();
    showToast(`Account created! Welcome to FoodGo, ${name}!`, 'success');
    return true;
  };

  const logout = () => {
    setUser(null);
    showToast('You have been signed out', 'info');
  };

  const toggleFavorite = (restaurantId: string) => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    const isFav = user.favorites.includes(restaurantId);
    const updatedFavorites = isFav
      ? user.favorites.filter((id) => id !== restaurantId)
      : [...user.favorites, restaurantId];

    setUser({ ...user, favorites: updatedFavorites });
    showToast(isFav ? 'Removed from favorites' : 'Added to favorites ❤️', 'success');
  };

  const isFavorite = (restaurantId: string): boolean => {
    return !!user?.favorites.includes(restaurantId);
  };

  const addAddress = (addr: Omit<Address, 'id'>) => {
    if (!user) return;
    const newAddr: Address = {
      ...addr,
      id: `addr-${Date.now()}`,
    };
    const updated = [...user.addresses, newAddr];
    setUser({ ...user, addresses: updated });
    setSelectedAddress(newAddr);
    showToast('New delivery address saved', 'success');
  };

  const deleteAddress = (id: string) => {
    if (!user) return;
    const updated = user.addresses.filter((a) => a.id !== id);
    setUser({ ...user, addresses: updated });
    if (selectedAddress?.id === id) {
      setSelectedAddress(updated[0] || null);
    }
    showToast('Address deleted', 'info');
  };

  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Order => {
    const id = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newOrder: Order = {
      ...orderData,
      id,
      createdAt: `Today, ${timeStr}`,
      status: 'placed',
      deliveryPartner: {
        name: 'Carlos Rivera',
        phone: '+1 (555) 789-0123',
        rating: 4.95,
        vehicle: 'Honda CB500X • Silver • Plate #FD-729',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      },
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const getOrder = (id: string): Order | undefined => {
    return orders.find((o) => o.id === id);
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
  };

  const simulateIncomingOrder = (): Order => {
    const id = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newOrder: Order = {
      id,
      createdAt: `Just now (${timeStr})`,
      restaurantId: 'rest-burger-house',
      restaurantName: 'Burger House',
      items: [
        { name: 'The Truffle Smash Double', quantity: 1, price: 13.99, isVeg: false },
        { name: 'Warm Fudge Skillet Brownie', quantity: 1, price: 6.50, isVeg: true },
        { name: 'Salted Caramel Crunch Shake', quantity: 1, price: 5.50, isVeg: true },
      ],
      subtotal: 25.99,
      discount: 0,
      deliveryFee: 2.99,
      taxes: 2.08,
      total: 31.06,
      deliveryAddress: {
        id: `addr-sim-${Date.now()}`,
        type: 'Home',
        street: '88 Horizon Boulevard, Suite 502',
        city: 'Metropolis',
        zip: '90210',
      },
      paymentMethod: 'UPI (PhonePe)',
      status: 'placed',
      estimatedDeliveryMin: 25,
      deliveryPartner: {
        name: 'Carlos Rivera',
        phone: '+1 (555) 789-0123',
        rating: 4.95,
        vehicle: 'Honda CB500X • Plate #FD-729',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      },
    };

    setOrders((prev) => [newOrder, ...prev]);
    showToast(`🔔 New Customer Order Received! #${id}`, 'info');
    return newOrder;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        selectedAddress,
        currentLocation,
        orders,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        login,
        signup,
        logout,
        setCurrentLocation,
        setSelectedAddress,
        addAddress,
        deleteAddress,
        toggleFavorite,
        isFavorite,
        createOrder,
        getOrder,
        updateOrderStatus,
        simulateIncomingOrder,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
