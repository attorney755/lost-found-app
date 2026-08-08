import React from 'react';
import { Search, ShieldCheck, HeartHandshake, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'Report or Search Items',
    description: 'Post details of your lost item or list a found item with photos, category, and location coordinates.',
    icon: Search,
    color: 'bg-blue-100 dark:bg-blue-600/20 border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400',
  },
  {
    step: '02',
    title: 'Verify Ownership & Claim',
    description: 'Claimants submit verification evidence or answer unique questions to prove true ownership securely.',
    icon: ShieldCheck,
    color: 'bg-purple-100 dark:bg-purple-600/20 border-purple-200 dark:border-purple-500/30 text-purple-600 dark:text-purple-400',
  },
  {
    step: '03',
    title: 'Reunite & Recover',
    description: 'Use built-in encrypted messaging to coordinate safe meetup points and celebrate successful item returns!',
    icon: HeartHandshake,
    color: 'bg-emerald-100 dark:bg-emerald-600/20 border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-white dark:bg-slate-900/40 border-t border-b border-slate-200 dark:border-slate-800/80 relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            How Lost & Found Works
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-base">
            Our streamlined 3-step verification system ensures lost belongings find their way home safely.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="relative bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl ${s.color} border flex items-center justify-center`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="font-display font-extrabold text-3xl text-slate-300 dark:text-slate-700">
                      {s.step}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-3">
                    {s.title}
                  </h3>

                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    {s.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center text-xs text-blue-600 dark:text-blue-400 font-semibold space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Automated Matching Enabled</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
