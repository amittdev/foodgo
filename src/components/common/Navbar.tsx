import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  MapPin,
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Flame,
  Heart,
  LogOut,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const { totalCount } = useCart();
  const { user, isLoggedIn, logout, openAuthModal, currentLocation, setCurrentLocation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const LOCATIONS = [
    'Downtown, Central Plaza',
    'North District, Little Italy',
    'East Gate, Royal Avenue',
    'West Bay, Organic Meadow',
    'Market Square, Chinatown',
    'Sweet Valley, Confectionery Lane',
  ];

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Restaurants', path: '/restaurants' },
    { label: 'Offers', path: '/offers', badge: '50% OFF' },
    { label: 'Admin', path: '/admin', badge: 'OMS' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#0a0d14]/95 backdrop-blur-md border-b border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-4 md:px-4 lg:px-6 xl:px-8">
          <div className="flex items-center justify-between flex-nowrap gap-2 sm:gap-3 md:gap-4 lg:gap-5 h-14 sm:h-16 md:h-16 lg:h-20 w-full">
            {/* Logo & Brand (compact, never wraps) */}
            <div className="flex items-center flex-nowrap gap-2 sm:gap-2.5 md:gap-3 lg:gap-5 shrink-0">
              <Link to="/" className="flex items-center flex-nowrap gap-1.5 sm:gap-2 lg:gap-2.5 group shrink-0">
                <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-8 md:h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 rounded-lg sm:rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-md shadow-orange-500/25 group-hover:scale-105 transition-transform shrink-0">
                  <Flame className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-4.5 md:h-4.5 lg:w-5 lg:h-5 text-white" />
                </div>
                <div className="flex flex-col shrink-0">
                  <div className="flex items-center flex-nowrap">
                    <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-black tracking-tight text-white font-heading whitespace-nowrap">
                      Food<span className="text-orange-500">Go</span>
                    </span>
                  </div>
                  <span className="text-[7.5px] sm:text-[8px] md:text-[8.5px] lg:text-[10px] uppercase tracking-wider text-slate-400 font-semibold -mt-0.5 sm:-mt-1 hidden xs:block whitespace-nowrap">
                    Delivered Fast
                  </span>
                </div>
              </Link>

              {/* Location Picker Pill (visible only on ultra-wide screens to prevent crowding nav links) */}
              <div className="relative hidden 2xl:block shrink-0">
                <button
                  type="button"
                  onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 hover:border-orange-500/50 text-slate-200 text-xs font-medium transition-all group shrink-0 whitespace-nowrap"
                  aria-label="Change delivery location"
                >
                  <MapPin className="w-3.5 h-3.5 text-orange-400 group-hover:animate-bounce" />
                  <span className="max-w-[140px] truncate text-slate-300 group-hover:text-white">
                    {currentLocation}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {locationDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <p className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Select Delivery Area
                    </p>
                    {LOCATIONS.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => {
                          setCurrentLocation(loc);
                          setLocationDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs rounded-lg flex items-center justify-between transition-colors ${
                          currentLocation === loc
                            ? 'bg-orange-500/20 text-orange-400 font-semibold'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span className="truncate">{loc}</span>
                        {currentLocation === loc && <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Desktop & Tablet Navigation Links - same line, compact, and responsive */}
            <nav className="hidden md:flex items-center flex-nowrap gap-1 md:gap-1.5 lg:gap-2.5 shrink-0">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-1.5 md:px-2 lg:px-2.5 xl:px-3 py-1 md:py-1 lg:py-1.5 rounded-lg lg:rounded-xl text-[11px] md:text-xs lg:text-[13px] font-semibold transition-all whitespace-nowrap inline-flex items-center gap-1 flex-nowrap shrink-0 ${
                    isActive(link.path)
                      ? 'text-orange-400 bg-orange-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <span className="whitespace-nowrap">{link.label}</span>
                  {link.badge && (
                    <span className="px-1 md:px-1.5 py-[0.5px] md:py-[1px] text-[7px] md:text-[8px] font-extrabold uppercase bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full leading-none shrink-0 shadow-xs tracking-tight whitespace-nowrap">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            {/* Action Buttons: Cart, Profile/Login, Mobile Menu - on the same line with clean space after Contact */}
            <div className="flex items-center flex-nowrap gap-2 md:gap-2.5 lg:gap-3 shrink-0 ml-auto md:ml-3 lg:ml-5">
              {/* Cart Pill - on same line as Contact with dedicated space */}
              <Link
                to="/cart"
                className="flex items-center flex-nowrap gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-2.5 lg:px-3.5 py-1.5 sm:py-2 md:py-1.5 lg:py-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium text-xs sm:text-sm md:text-xs lg:text-sm hover:from-amber-600 hover:to-orange-600 shadow-md shadow-orange-500/20 transition-all transform active:scale-95 shrink-0 whitespace-nowrap group"
                aria-label={`Shopping cart with ${totalCount} items`}
              >
                <div className="relative shrink-0">
                  <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 group-hover:rotate-6 transition-transform" />
                  {totalCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-4.5 sm:h-4.5 bg-slate-950 text-orange-400 font-bold text-[8.5px] sm:text-[10px] rounded-full flex items-center justify-center border border-orange-500 leading-none">
                      {totalCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline font-semibold text-xs sm:text-sm whitespace-nowrap">
                  {totalCount > 0 ? (totalCount === 1 ? '1 item' : `${totalCount} items`) : 'Cart'}
                </span>
              </Link>

              {/* User Profile / Login */}
              {isLoggedIn && user ? (
                <div className="relative shrink-0">
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1.5 p-1 sm:p-1.5 md:p-1 lg:px-3 lg:py-1.5 rounded-lg sm:rounded-xl bg-slate-900 border border-slate-700/60 hover:border-slate-600 transition-colors shrink-0"
                    aria-label="User account menu"
                  >
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                      alt={user.name}
                      className="w-6 h-6 sm:w-7 sm:h-7 md:w-6 md:h-6 lg:w-7 lg:h-7 rounded-lg object-cover ring-1 ring-orange-500"
                    />
                    <span className="hidden lg:inline text-xs font-semibold text-slate-200 max-w-[85px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-3 py-2 border-b border-slate-800">
                        <p className="text-xs font-bold text-white truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <User className="w-4 h-4 text-orange-400" />
                        My Profile & Orders
                      </Link>
                      <Link
                        to="/profile?tab=favorites"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <Heart className="w-4 h-4 text-rose-400" />
                        Favorite Restaurants
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="px-2.5 sm:px-3 md:px-2.5 lg:px-4 py-1.5 sm:py-2 md:py-1.5 lg:py-2 rounded-lg sm:rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-white font-medium text-[11px] sm:text-xs border border-slate-700/80 transition-colors shrink-0 whitespace-nowrap"
                >
                  Sign In
                </button>
              )}

              {/* Mobile Menu Hamburger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800 shrink-0"
                aria-label="Toggle mobile navigation menu"
              >
                {mobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0d121d] border-b border-slate-800 px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-4">
            {/* Mobile Location Selector */}
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
                <MapPin className="w-3.5 h-3.5 text-orange-400" />
                <span>Delivery Location:</span>
              </div>
              <select
                value={currentLocation}
                onChange={(e) => setCurrentLocation(e.target.value)}
                className="w-full bg-slate-800 text-white text-xs font-medium rounded-lg p-2 border border-slate-700 focus:outline-none focus:border-orange-500"
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Nav Links with compact buttons and clean spacing */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`p-2.5 sm:p-3 rounded-lg sm:rounded-xl text-center text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 sm:gap-2 ${
                    isActive(link.path)
                      ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="px-1.5 py-[2px] text-[8px] font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full leading-none">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>

            {isLoggedIn ? (
              <div className="pt-2 sm:pt-3 flex items-center justify-between border-t border-slate-800">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-xs sm:text-sm text-slate-200 font-semibold"
                >
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400" />
                  My Account
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-rose-400 font-semibold"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="pt-2 sm:pt-3 flex gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('login');
                  }}
                  className="flex-1 py-2 sm:py-2.5 bg-slate-800 text-white font-semibold text-xs rounded-lg sm:rounded-xl"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('signup');
                  }}
                  className="flex-1 py-2 sm:py-2.5 bg-orange-500 text-white font-semibold text-xs rounded-lg sm:rounded-xl shadow-lg shadow-orange-500/20"
                >
                  Create Account
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Floating Bottom Nav for Mobile with decreased button size and clean gap between tabs */}
      <nav aria-label="Mobile Navigation" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a0d14]/95 backdrop-blur-xl border-t border-slate-800/90 px-2 sm:px-4 py-1.5 sm:py-2 flex items-center justify-around gap-1 sm:gap-2 shadow-2xl">
        <Link
          to="/"
          className={`flex-1 flex flex-col items-center justify-center py-1 sm:py-1.5 px-0.5 rounded-lg transition-all ${
            isActive('/') ? 'text-orange-400 bg-orange-500/10' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Flame className="w-4 h-4 sm:w-4.5 sm:h-4.5 mb-0.5" />
          <span className="text-[9px] sm:text-[10px] font-semibold tracking-tight">Home</span>
        </Link>
        <Link
          to="/restaurants"
          className={`flex-1 flex flex-col items-center justify-center py-1 sm:py-1.5 px-0.5 rounded-lg transition-all ${
            isActive('/restaurants') ? 'text-orange-400 bg-orange-500/10' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4 sm:w-4.5 sm:h-4.5 mb-0.5" />
          <span className="text-[9px] sm:text-[10px] font-semibold tracking-tight">Explore</span>
        </Link>
        <Link
          to="/search"
          className={`flex-1 flex flex-col items-center justify-center py-1 sm:py-1.5 px-0.5 rounded-lg transition-all ${
            isActive('/search') ? 'text-orange-400 bg-orange-500/10' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5 mb-0.5" />
          <span className="text-[9px] sm:text-[10px] font-semibold tracking-tight">Search</span>
        </Link>
        <Link
          to="/cart"
          className={`flex-1 flex flex-col items-center justify-center py-1 sm:py-1.5 px-0.5 rounded-lg transition-all relative ${
            isActive('/cart') ? 'text-orange-400 bg-orange-500/10' : 'text-slate-400 hover:text-white'
          }`}
        >
          <div className="relative">
            <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5 mb-0.5" />
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-2 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-orange-500 text-white text-[8px] sm:text-[9px] font-bold flex items-center justify-center shadow-xs">
                {totalCount}
              </span>
            )}
          </div>
          <span className="text-[9px] sm:text-[10px] font-semibold tracking-tight">Cart</span>
        </Link>
        <Link
          to={isLoggedIn ? '/profile' : '#'}
          onClick={(e) => {
            if (!isLoggedIn) {
              e.preventDefault();
              openAuthModal('login');
            }
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1 sm:py-1.5 px-0.5 rounded-lg transition-all ${
            isActive('/profile') ? 'text-orange-400 bg-orange-500/10' : 'text-slate-400 hover:text-white'
          }`}
        >
          <User className="w-4 h-4 sm:w-4.5 sm:h-4.5 mb-0.5" />
          <span className="text-[9px] sm:text-[10px] font-semibold tracking-tight">{isLoggedIn ? 'Profile' : 'Sign In'}</span>
        </Link>
      </nav>
    </>
  );
};
