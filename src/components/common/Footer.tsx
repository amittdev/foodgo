import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Instagram, Facebook, Twitter, Linkedin, Heart, ArrowRight, ShieldCheck, Clock, Award } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    showToast('Subscribed! Check your inbox for 25% off coupon.', 'success');
    setEmail('');
  };

  return (
    <footer className="bg-[#07090e] border-t border-slate-800/80 text-slate-400 pt-16 pb-24 md:pb-12">
      {/* Value Proposition Highlights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 pb-12 border-b border-slate-800/60">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/50">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">30-Min Fast Delivery</h4>
              <p className="text-xs text-slate-400 mt-0.5">Hot meals delivered straight to your door by trusted couriers.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/50">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Best Hygiene Standards</h4>
              <p className="text-xs text-slate-400 mt-0.5">Sanitized food prep, tamper-evident seals & temperature checks.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/50">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Top-Rated Local Restaurants</h4>
              <p className="text-xs text-slate-400 mt-0.5">Handpicked premium dining, artisanal kitchens & city legends.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          {/* Brand Info & Newsletter */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-md">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black text-white font-heading">
                Food<span className="text-orange-500">Go</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Good Food. Delivered Fast. Discover top rated local restaurants, track your cravings in real-time, and experience restaurant-quality dining at home.
            </p>

            <form onSubmit={handleSubscribe} className="pt-2">
              <label htmlFor="newsletter-email" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Get $10 Off Your First Order
              </label>
              <div className="flex gap-2 max-w-sm">
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-orange-500/20"
                >
                  Join <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>

          {/* Column 1: FoodGo */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase font-heading">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/about" className="hover:text-orange-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/restaurants" className="hover:text-orange-400 transition-colors">
                  Browse Restaurants
                </Link>
              </li>
              <li>
                <Link to="/offers" className="hover:text-orange-400 transition-colors">
                  Exclusive Deals & Offers
                </Link>
              </li>
              <li>
                <a href="#careers" onClick={(e) => e.preventDefault()} className="hover:text-orange-400 transition-colors">
                  Careers <span className="text-[10px] bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded">Hiring</span>
                </a>
              </li>
              <li>
                <Link to="/contact" className="hover:text-orange-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: For Restaurants */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase font-heading">
              For Restaurants
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="#partner" onClick={(e) => e.preventDefault()} className="hover:text-orange-400 transition-colors">
                  Partner With Us
                </a>
              </li>
              <li>
                <Link to="/admin" className="hover:text-orange-400 transition-colors">
                  Restaurant Admin Login (OMS)
                </Link>
              </li>
              <li>
                <a href="#rider" onClick={(e) => e.preventDefault()} className="hover:text-orange-400 transition-colors">
                  Deliver With FoodGo
                </a>
              </li>
              <li>
                <a href="#enterprise" onClick={(e) => e.preventDefault()} className="hover:text-orange-400 transition-colors">
                  Corporate Catering
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Support & Legal */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase font-heading">
              Support & Legal
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/contact" className="hover:text-orange-400 transition-colors">
                  Help Center & FAQs
                </Link>
              </li>
              <li>
                <a href="#terms" onClick={(e) => e.preventDefault()} className="hover:text-orange-400 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-orange-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#refund" onClick={(e) => e.preventDefault()} className="hover:text-orange-400 transition-colors">
                  Refund & Cancellation
                </a>
              </li>
              <li>
                <a href="#cookies" onClick={(e) => e.preventDefault()} className="hover:text-orange-400 transition-colors">
                  Cookie Preferences
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Socials & Copyright */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="flex items-center gap-1 text-slate-500">
            © {new Date().getFullYear()} FoodGo Inc. Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for food lovers everywhere.
          </p>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="text-[11px] font-medium text-slate-500">Follow our food journeys:</span>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg bg-slate-900 hover:text-white hover:bg-orange-500/20 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg bg-slate-900 hover:text-white hover:bg-orange-500/20 transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg bg-slate-900 hover:text-white hover:bg-orange-500/20 transition-colors"
              aria-label="Twitter / X"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg bg-slate-900 hover:text-white hover:bg-orange-500/20 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
