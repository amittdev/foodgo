import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  CreditCard,
  Smartphone,
  Banknote,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Plus,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../utils/orderLogic';
import { Address } from '../types';

export const CheckoutPage: React.FC = () => {
  const { items, restaurantId, restaurantName, bill, clearCart } = useCart();
  const {
    user,
    selectedAddress,
    setSelectedAddress,
    addAddress,
    createOrder,
    openAuthModal,
  } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Address modal state
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('Metropolis');
  const [newZip, setNewZip] = useState('90210');
  const [newType, setNewType] = useState<'Home' | 'Work' | 'Other'>('Home');

  // Delivery instructions
  const [deliveryInstruction, setDeliveryInstruction] = useState('Leave at doorstep');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 1089');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('888');

  // Contact details
  const [contactName, setContactName] = useState(user?.name || 'Alex Morgan');
  const [contactPhone, setContactPhone] = useState(user?.phone || '+1 (555) 349-2810');

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#07090e] text-white px-4">
        <div className="text-center py-12">
          <p className="text-base text-slate-400 mb-4">No items to checkout</p>
          <Link
            to="/restaurants"
            className="px-6 py-2.5 bg-orange-500 text-white font-bold text-xs rounded-xl"
          >
            Explore Restaurants
          </Link>
        </div>
      </div>
    );
  }

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet) {
      showToast('Please enter street address', 'error');
      return;
    }
    addAddress({
      type: newType,
      street: newStreet,
      city: newCity,
      zip: newZip,
    });
    setShowNewAddressForm(false);
    setNewStreet('');
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAddress) {
      showToast('Please select or add a delivery address', 'error');
      return;
    }

    if (paymentMethod === 'upi' && !upiId && !user) {
      showToast('Please enter your UPI ID (e.g. user@okhdfcbank)', 'error');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const order = createOrder({
        restaurantId: restaurantId || 'rest-1',
        restaurantName: restaurantName || 'FoodGo Restaurant',
        items: items.map((ci) => ({
          name: ci.item.name,
          quantity: ci.quantity,
          price: ci.item.price,
          isVeg: ci.item.isVeg,
        })),
        subtotal: bill.subtotal,
        discount: bill.discount,
        deliveryFee: bill.deliveryFee,
        taxes: bill.taxes,
        total: bill.grandTotal,
        deliveryAddress: selectedAddress,
        paymentMethod:
          paymentMethod === 'upi'
            ? 'UPI (Google Pay / PhonePe)'
            : paymentMethod === 'card'
            ? 'Credit Card (••• 1089)'
            : 'Cash on Delivery',
        estimatedDeliveryMin: 28,
      });

      clearCart();
      setIsSubmitting(false);
      showToast('Order placed successfully! Tracking your delivery...', 'success');
      navigate(`/order-success/${order.id}`);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-white py-8 sm:py-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Back Link */}
        <div className="mb-6">
          <Link
            to="/cart"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Shopping Cart</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-white mt-2">
            Checkout & Confirmation
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Checkout Steps Form */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Delivery Address */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h3 className="text-base font-bold text-white font-heading">
                    Delivery Address
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                  className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New</span>
                </button>
              </div>

              {/* Saved Address Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {user?.addresses.map((addr) => {
                  const isSelected = selectedAddress?.id === addr.id;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddress(addr)}
                      className={`cursor-pointer p-4 rounded-2xl border transition-all ${
                        isSelected
                          ? 'bg-orange-500/10 border-orange-500 text-white shadow-md'
                          : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/60 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                          {addr.type}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs font-semibold text-white leading-snug">{addr.street}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {addr.city}, {addr.zip}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Add New Address Inline Form */}
              {showNewAddressForm && (
                <form
                  onSubmit={handleAddNewAddress}
                  className="mt-4 p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3"
                >
                  <div className="flex gap-2">
                    {(['Home', 'Work', 'Other'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setNewType(type)}
                        className={`flex-1 py-1 text-xs font-bold rounded-lg border ${
                          newType === type
                            ? 'bg-orange-500 text-white border-orange-400'
                            : 'bg-slate-900 text-slate-400 border-slate-700'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    required
                    value={newStreet}
                    onChange={(e) => setNewStreet(e.target.value)}
                    placeholder="House/Flat number, Street name"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      placeholder="City"
                      className="bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={newZip}
                      onChange={(e) => setNewZip(e.target.value)}
                      placeholder="ZIP code"
                      className="bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowNewAddressForm(false)}
                      className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-orange-500 text-white font-bold text-xs rounded-xl shadow-md"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Step 2: Contact Information & Delivery Preferences */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <h3 className="text-base font-bold text-white font-heading">
                  Recipient & Drop-Off Preferences
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Phone Number for Courier
                  </label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Delivery Instructions Options */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Delivery Instruction
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    'Leave at doorstep',
                    'Ring door bell',
                    'Avoid calling',
                    'Leave with guard',
                  ].map((inst) => (
                    <button
                      key={inst}
                      type="button"
                      onClick={() => setDeliveryInstruction(inst)}
                      className={`p-2 rounded-xl text-center text-xs font-semibold border transition-all ${
                        deliveryInstruction === inst
                          ? 'bg-orange-500/20 text-orange-400 border-orange-500/60'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                      }`}
                    >
                      {inst}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <h3 className="text-base font-bold text-white font-heading">
                  Select Payment Method
                </h3>
              </div>

              <div className="space-y-3">
                {/* UPI Option */}
                <div
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'upi'
                      ? 'bg-orange-500/10 border-orange-500 shadow-md'
                      : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-white">
                          Instant UPI & Wallets
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          Google Pay, PhonePe, Paytm, or any UPI App
                        </p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                      className="accent-orange-500 w-4 h-4"
                    />
                  </div>

                  {paymentMethod === 'upi' && (
                    <div className="mt-3 pt-3 border-t border-slate-800 flex gap-2">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="e.g. yourname@okaxis or yourname@paytm"
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  )}
                </div>

                {/* Credit / Debit Card Option */}
                <div
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-orange-500/10 border-orange-500 shadow-md'
                      : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-white">
                          Credit or Debit Card
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          Visa, Mastercard, Amex with 256-bit SSL encryption
                        </p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="accent-orange-500 w-4 h-4"
                    />
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="Card Number"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono"
                        />
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="CVV"
                          className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Cash on Delivery */}
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'bg-orange-500/10 border-orange-500 shadow-md'
                      : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <Banknote className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-white">
                          Cash on Delivery (COD)
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          Pay with cash or card reader upon doorstep handover
                        </p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="accent-orange-500 w-4 h-4"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Review & Place Order Button */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
                Order Review ({items.length} items)
              </h3>

              <div className="divide-y divide-slate-800 max-h-56 overflow-y-auto pr-1 no-scrollbar text-xs">
                {items.map(({ item, quantity }) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2 truncate pr-2">
                      <span className="text-orange-400 font-bold">{quantity}x</span>
                      <span className="text-white truncate">{item.name}</span>
                    </div>
                    <span className="font-semibold text-white shrink-0">
                      {formatCurrency(item.price * quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Calculation Breakdown */}
              <div className="pt-3 border-t border-slate-800 space-y-2 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-semibold">{formatCurrency(bill.subtotal)}</span>
                </div>
                {bill.discount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Discount</span>
                    <span>-{formatCurrency(bill.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="text-white font-semibold">
                    {bill.deliveryFee === 0 ? 'FREE' : formatCurrency(bill.deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes & Fees</span>
                  <span className="text-white font-semibold">
                    {formatCurrency(bill.taxes + bill.platformFee)}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm">
                  <span className="font-bold text-white">Grand Total</span>
                  <span className="text-xl font-black text-orange-400">
                    {formatCurrency(bill.grandTotal)}
                  </span>
                </div>
              </div>

              {/* Place Order CTA Button */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handlePlaceOrder}
                className="w-full mt-4 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-75 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-orange-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    Confirming Order...
                  </span>
                ) : (
                  <>
                    <span>Place Order • {formatCurrency(bill.grandTotal)}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Safe & Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
