import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  PlusCircle, 
  ShieldCheck, 
  MessageSquare, 
  CheckCircle2, 
  Bell, 
  ArrowRight,
  HelpCircle,
  FileCheck
} from 'lucide-react';

const HowItWorksPage = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Header Hero Banner */}
        <div className="text-center space-y-4 max-w-3xl mx-auto pt-4">
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-slate-900 dark:text-white tracking-tight">
            How Lost & Found Works
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
            Whether you lost a personal belonging or found an item in your city, our platform connects posters and finders safely in minutes.
          </p>
        </div>

        {/* PROMINENT POSTER NOTE ALERT */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-amber-500/20 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center shrink-0">
            <FileCheck className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display font-extrabold text-xl text-white">
              Note for Item Posters & Finders
            </h3>
            <p className="text-xs sm:text-sm text-amber-50 leading-relaxed font-medium">
              After posting a lost or found item, your listing goes live immediately on the homepage and browse directory. When someone sends a report or claim, you will receive real-time notifications directly in your <span className="underline font-bold">User Command Dashboard</span>.
            </p>
          </div>
        </div>

        {/* Step 1: Post Lost or Found Item */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-3 flex flex-col items-center justify-center text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
            <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center font-extrabold text-2xl mb-2 shadow-md">
              1
            </div>
            <span className="font-display font-extrabold text-sm text-blue-700 dark:text-blue-300">Step 1</span>
          </div>

          <div className="md:col-span-9 space-y-3">
            <h3 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white flex items-center space-x-3">
              <PlusCircle className="w-6 h-6 text-blue-600" />
              <span>Post Your Lost or Found Item</span>
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Click <strong className="text-slate-900 dark:text-white">Post New Item</strong> to open our adaptive reporting form. Choose whether you lost an item or found an item. Enter the title, category, description, and upload item photos.
            </p>
            <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1 pl-4 list-disc">
              <li>For <strong>Lost Items</strong>: Optional reward amount and lost date.</li>
              <li>For <strong>Found Items</strong>: Safe storage location or pickup instructions.</li>
            </ul>
          </div>
        </div>

        {/* Step 2: Instant Notifications & Claim Matching */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-3 flex flex-col items-center justify-center text-center p-6 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-100 dark:border-amber-800">
            <div className="w-16 h-16 rounded-full bg-amber-500 text-white flex items-center justify-center font-extrabold text-2xl mb-2 shadow-md">
              2
            </div>
            <span className="font-display font-extrabold text-sm text-amber-700 dark:text-amber-300">Step 2</span>
          </div>

          <div className="md:col-span-9 space-y-3">
            <h3 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white flex items-center space-x-3">
              <Bell className="w-6 h-6 text-amber-500" />
              <span>Receive Real-Time Found Notifications</span>
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              When a community member recognizes your item and submits a report through <strong className="text-slate-900 dark:text-white">Found this item? Contact Poster</strong>, their contact details (Name, Phone, Email, and Location note) are instantly delivered to your dashboard.
            </p>
          </div>
        </div>

        {/* Step 3: Verify Ownership & Mark Found */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-3 flex flex-col items-center justify-center text-center p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800">
            <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center font-extrabold text-2xl mb-2 shadow-md">
              3
            </div>
            <span className="font-display font-extrabold text-sm text-emerald-700 dark:text-emerald-300">Step 3</span>
          </div>

          <div className="md:col-span-9 space-y-3">
            <h3 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white flex items-center space-x-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              <span>Reunite Item & Mark as Resolved</span>
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Reach out to the finder via direct phone call or email to confirm item verification and arrange safe pickup. Once recovered, click <strong className="text-slate-900 dark:text-white">Mark Found</strong> on your dashboard to leave community feedback!
            </p>
          </div>
        </div>

        {/* CTA Footer */}
        <div className="text-center pt-6 space-y-4">
          <h3 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white">
            Ready to reconnect a lost item?
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/dashboard"
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-full shadow-lg shadow-blue-600/30 transition-all flex items-center space-x-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post New Item Now</span>
            </Link>
            <Link
              to="/browse"
              className="px-8 py-3.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs rounded-full transition-all flex items-center space-x-2"
            >
              <Search className="w-4 h-4" />
              <span>Browse All Items</span>
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};

export default HowItWorksPage;
