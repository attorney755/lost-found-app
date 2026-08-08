import React, { useState, useEffect } from 'react';
import API from '../services/api';
import HeroSection from '../components/public/HeroSection';
import CategoryGrid from '../components/public/CategoryGrid';
import RecentItemsSection from '../components/public/RecentItemsSection';
import HowItWorks from '../components/public/HowItWorks';
import TestimonialsSection from '../components/public/TestimonialsSection';
import PricingSection from '../components/public/PricingSection';
import ItemDetailModal from '../components/items/ItemDetailModal';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';

const Home = () => {
  const [stats, setStats] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/items/stats');
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };

    fetchStats();
  }, []);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => setContactSubmitted(false), 4000);
  };

  return (
    <div className="space-y-12">
      
      {/* Hero Section (#hero) */}
      <section id="hero">
        <HeroSection stats={stats} />
      </section>

      {/* Category Browse Grid (#categories) */}
      <section id="categories">
        <CategoryGrid />
      </section>

      {/* Recent Items Section (#recent) */}
      <section id="recent">
        <RecentItemsSection onViewItem={(item) => setSelectedItem(item)} />
      </section>

      {/* How It Works Guide (#how-it-works) */}
      <section id="how-it-works">
        <HowItWorks />
      </section>

      {/* Community Testimonials & Ratings Section (#testimonials) */}
      <section id="testimonials">
        <TestimonialsSection />
      </section>

      {/* Pricing Plans Section (#pricing) */}
      <section id="pricing">
        <PricingSection />
      </section>

      {/* Main Platform Contact & Location Map Section (#contact) */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-20">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-xl space-y-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">
              Kigali Contact & Location Center
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Have questions about an item claim or platform features? Reach out to our community support staff or visit our headquarters in Kigali, Remera.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Contact Details & Info Cards Left Column */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-start space-x-4">
                <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Support Email</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Instant assistance for claims and disputes</p>
                  <a href="mailto:support@lostfoundapp.com" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline block mt-1">
                    support@lostfoundapp.com
                  </a>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-start space-x-4">
                <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Direct Phone Hotline</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Available 24/7 in Rwanda</p>
                  <a href="tel:+250788847286" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline block mt-1">
                    +250 788 847 286
                  </a>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-start space-x-4">
                <div className="w-11 h-11 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Headquarters Address</h4>
                  <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                    Kigali, Remera
                  </p>
                </div>
              </div>

            </div>

            {/* Embedded Interactive Map & Inquiry Form Right Column */}
            <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-6">
              
              {/* Google Maps Iframe */}
              <div className="w-full h-56 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xs relative">
                <iframe
                  title="Kigali Rwanda Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63799.55938210352!2d30.038487770857317!3d-1.9440726917631558!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca4258ed8e797%3A0xfadcda59b489d20!2sKigali%2C%20Rwanda!5e0!3m2!1sen!2srw!4v1700000000000!5m2!1sen!2srw"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full filter grayscale contrast-125 dark:invert"
                ></iframe>
              </div>

              {/* Inquiry Form */}
              {contactSubmitted ? (
                <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-xs text-center flex items-center justify-center space-x-2 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Thank you! Your message has been sent to our support line at +250 788 847 286.</span>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Your Full Name"
                      className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-600"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Your Email Address"
                      className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-600"
                      required
                    />
                  </div>
                  <textarea
                    rows="2"
                    placeholder="How can we help you today?"
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-600"
                    required
                  ></textarea>
                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-full shadow-md shadow-blue-600/20 transition-all flex items-center justify-center space-x-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message to Support</span>
                  </button>
                </form>
              )}

            </div>

          </div>

        </div>
      </section>

      {/* Item Detail View Modal */}
      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}

    </div>
  );
};

export default Home;
