import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle2, 
  Instagram, 
  Linkedin, 
  Twitter, 
  Coffee, 
  Copy, 
  Check, 
  X, 
  Heart,
  Smartphone
} from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [showCoffeeModal, setShowCoffeeModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const handleCopyMoMo = () => {
    navigator.clipboard.writeText('0794729150');
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-12 transition-colors duration-300 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-blue-600 p-0.5 shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform duration-200 flex items-center justify-center text-white">
                <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-xl tracking-tight text-white">
                  Lost & Found
                </span>
                <span className="text-[10px] font-medium tracking-wider text-blue-400 uppercase -mt-1">
                  Finder Platform
                </span>
              </div>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              The premier community platform connecting people who lost belongings with finders across Kigali & Rwanda. Powered by real-time notifications, photo verification, and secure contact matching.
            </p>

            <div className="space-y-1.5 text-xs text-slate-400 pt-1">
              <p className="flex items-center space-x-2 font-bold text-white">
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>Kigali, Remera</span>
              </p>
              <p className="flex items-center space-x-2 font-semibold text-emerald-400">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <a href="tel:+250788847286" className="hover:underline">+250 788 847 286</a>
              </p>
            </div>

            {/* Buy Me a Coffee Trigger & Socials */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowCoffeeModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center space-x-2 group hover:scale-105 active:scale-95"
              >
                <Coffee className="w-4 h-4 text-slate-950 group-hover:rotate-12 transition-transform" />
                <span>Buy me a Coffee</span>
              </button>

              <div className="flex items-center space-x-2">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="X Twitter"
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-xs"
                >
                  <Twitter className="w-4 h-4" />
                </a>

                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-pink-600 text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-xs"
                >
                  <Instagram className="w-4 h-4" />
                </a>

                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-blue-700 text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-xs"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-white text-base mb-4">Quick Navigation</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="text-slate-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/browse" className="text-slate-400 hover:text-white transition-colors">Browse Items</Link></li>
              <li><Link to="/pricing" className="text-slate-400 hover:text-white transition-colors">Pricing & Plans</Link></li>
              <li><Link to="/contact" className="text-slate-400 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/login" className="text-slate-400 hover:text-white transition-colors">Sign In</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display font-bold text-white text-base mb-4">Popular Categories</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/browse?category=Electronics" className="text-slate-400 hover:text-white transition-colors">Electronics & Phones</Link></li>
              <li><Link to="/browse?category=Wallets%20%26%20Purses" className="text-slate-400 hover:text-white transition-colors">Wallets & Cards</Link></li>
              <li><Link to="/browse?category=Pets" className="text-slate-400 hover:text-white transition-colors">Pets & Animals</Link></li>
              <li><Link to="/browse?category=Documents%20%26%20IDs" className="text-slate-400 hover:text-white transition-colors">Documents & IDs</Link></li>
              <li><Link to="/browse?category=Vehicles%20%26%20Keys" className="text-slate-400 hover:text-white transition-colors">Keys & Car Remotes</Link></li>
            </ul>
          </div>

          {/* Newsletter Form */}
          <div>
            <h4 className="font-display font-bold text-white text-base mb-4">Stay Informed</h4>
            <p className="text-slate-400 text-xs mb-3">
              Subscribe for instant notifications when new items matching your area are listed.
            </p>

            {subscribed ? (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs rounded-xl flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Thank you for subscribing!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-all flex items-center justify-center space-x-2 shadow-md shadow-blue-600/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Subscribe</span>
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Copyright & Developer Credit */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-3 text-center sm:text-left">
            <p>© {new Date().getFullYear()} Lost & Found Finder Platform. All rights reserved.</p>
            <span className="hidden sm:inline text-slate-700">•</span>
            <p className="text-slate-300 font-medium flex items-center space-x-1">
              <span>Developed with</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500 mx-0.5 animate-pulse" />
              <span>by</span>
              <strong className="text-white font-bold tracking-wide pl-1">Attorney Valois NIYIGABA</strong>
            </p>
          </div>

          <div className="flex items-center space-x-6">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
            <button 
              onClick={() => setShowCoffeeModal(true)} 
              className="text-amber-400 hover:text-amber-300 font-bold flex items-center space-x-1"
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>Buy me a Coffee</span>
            </button>
          </div>
        </div>

      </div>

      {/* ☕ BUY ME A COFFEE MOMO PAYMENT MODAL */}
      {showCoffeeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 relative animate-in fade-in zoom-in-95 duration-150 text-slate-900 dark:text-white">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-500 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20">
                  <Coffee className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-lg">Buy me a Coffee ☕</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Support the developer's work</p>
                </div>
              </div>
              <button
                onClick={() => setShowCoffeeModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Details */}
            <div className="space-y-4">
              
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-center space-y-1">
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                  Thank you for supporting Lost & Found Platform!
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  You can send your support directly via MTN Mobile Money (MoMo).
                </p>
              </div>

              {/* Developer MoMo Details Card */}
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-inner">
                
                <div>
                  <p className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">
                    Developer Name
                  </p>
                  <p className="font-display font-extrabold text-base text-slate-900 dark:text-white">
                    Attorney Valois NIYIGABA
                  </p>
                </div>

                <div className="border-t border-slate-200/60 dark:border-slate-800/80 pt-3">
                  <p className="text-[10px] uppercase font-extrabold tracking-wider text-amber-600 dark:text-amber-400 flex items-center space-x-1">
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>MTN Mobile Money (MoMo) Number</span>
                  </p>
                  
                  <div className="mt-1 flex items-center justify-between bg-white dark:bg-slate-900 border border-amber-500/40 px-4 py-3 rounded-xl shadow-xs">
                    <span className="font-mono font-black text-xl text-amber-600 dark:text-amber-400 tracking-wider">
                      0794729150
                    </span>

                    <button
                      type="button"
                      onClick={handleCopyMoMo}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center space-x-1 shadow-xs"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* USSD Dial Helper */}
                <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 space-y-1">
                  <p className="font-semibold text-slate-700 dark:text-slate-300">
                    Quick USSD Dialing (MTN MoMo):
                  </p>
                  <code className="block p-2 bg-slate-200 dark:bg-slate-900 rounded-lg text-slate-800 dark:text-slate-200 font-mono text-[11px] text-center font-bold">
                    *182*8*1*0794729150#
                  </code>
                </div>

              </div>

            </div>

            {/* Footer Action */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setShowCoffeeModal(false)}
                className="w-full py-3 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
