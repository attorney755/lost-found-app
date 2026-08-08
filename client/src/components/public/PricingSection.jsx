import React from 'react';
import { Check, Sparkles, Zap, Shield, Crown } from 'lucide-react';

const plans = [
  {
    id: 'free',
    name: 'Standard Community',
    price: '$0',
    period: 'Forever Free',
    description: 'Essential features for reporting lost & found items in your local area.',
    popular: false,
    badge: null,
    features: [
      'Post 1 active item listing',
      'Basic search & category filtering',
      'Direct contact notification',
      'Standard 30-day listing duration',
      'Community trust rating badge',
    ],
    buttonText: 'Get Started Free',
    buttonStyle: 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white',
  },
  {
    id: 'pro',
    name: 'Featured Finder',
    price: '$4.99',
    period: 'one-time fee',
    description: 'Maximize visibility with instant SMS alerts and featured priority placement.',
    popular: true,
    badge: 'MOST POPULAR',
    features: [
      'Up to 5 active item listings',
      'Featured placement on Homepage',
      'Instant SMS & email notification alerts',
      'Upload up to 5 high-res photos',
      'Extended 90-day active listing duration',
      'Priority verification badge',
    ],
    buttonText: 'Upgrade to Featured',
    buttonStyle: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30',
  },
  {
    id: 'business',
    name: 'VIP Protection',
    price: '$12.99',
    period: 'one-time fee',
    description: 'For venues, transport hubs, or valuable high-priority assets.',
    popular: false,
    badge: 'MAX VISIBILITY',
    features: [
      'Unlimited active item listings',
      '3 HD Video Uploads per item',
      'VIP top homepage ranking',
      'Automated social media promotion',
      'Custom QR code generator',
      '24/7 Priority VIP support',
    ],
    buttonText: 'Get VIP Access',
    buttonStyle: 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-bold shadow-md shadow-amber-500/20',
  },
];

const PricingSection = () => {
  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      
      {/* High-Contrast Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Simple, Transparent Pricing
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
          Choose the right plan to boost your item visibility and speed up recovery times.
        </p>
      </div>

      {/* Crisp Light & Dark Mode Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
              plan.popular
                ? 'bg-white dark:bg-slate-900 border-2 border-blue-600 dark:border-blue-500 shadow-2xl shadow-blue-500/10 scale-105 z-10'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            {plan.badge && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-blue-600 text-white font-extrabold text-[11px] tracking-wider uppercase shadow-md">
                {plan.badge}
              </div>
            )}

            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-display font-extrabold text-xl text-slate-900 dark:text-white">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {plan.description}
                  </p>
                </div>
              </div>

              <div className="my-6">
                <span className="font-display font-extrabold text-4xl text-slate-900 dark:text-white">
                  {plan.price}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium ml-2">
                  / {plan.period}
                </span>
              </div>

              <ul className="space-y-3 mb-8 border-t border-slate-100 dark:border-slate-800 pt-6">
                {plan.features.map((feat, i) => (
                  <li key={i} className="flex items-center text-xs text-slate-700 dark:text-slate-300">
                    <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2.5 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              className={`w-full py-3.5 px-6 rounded-full font-bold text-xs transition-all duration-200 ${plan.buttonStyle}`}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>

    </section>
  );
};

export default PricingSection;
