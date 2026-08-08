import React, { useState } from 'react';
import API from '../../services/api';
import AddressAutocompleteInput from '../common/AddressAutocompleteInput';
import { 
  X, 
  MapPin, 
  Calendar, 
  Tag, 
  DollarSign, 
  Send, 
  CheckCircle2, 
  User, 
  Mail, 
  Phone, 
  MessageSquare,
  AlertCircle
} from 'lucide-react';

const ItemDetailsModal = ({ item, onClose }) => {
  const [formData, setFormData] = useState({
    finderName: '',
    finderEmail: '',
    finderPhone: '',
    foundLocation: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!item) return null;

  const isLost = item.type === 'lost';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        itemId: item._id,
        finderName: formData.finderName,
        finderEmail: formData.finderEmail,
        finderPhone: formData.finderPhone,
        foundLocation: formData.foundLocation,
        message: formData.message,
      };

      const res = await API.post('/claims', payload);
      if (res.data.success) {
        setSubmitted(true);
      }
    } catch (err) {
      alert('Error sending report: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
        
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center transition-colors shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          
          {/* Image & Main Info Left Column */}
          <div className="md:col-span-5 bg-slate-100 dark:bg-slate-950 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800">
            <div>
              <div className="relative rounded-2xl overflow-hidden shadow-md mb-4 bg-slate-200 dark:bg-slate-800 aspect-4/3">
                <img
                  src={item.images && item.images[0] ? item.images[0] : 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop'}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className={`px-3 py-1 rounded-full font-extrabold text-xs uppercase tracking-wider text-white shadow-md ${
                    isLost ? 'bg-rose-600' : 'bg-emerald-600'
                  }`}>
                    {item.type}
                  </span>
                </div>
              </div>

              <h2 className="font-display font-extrabold text-xl text-slate-900 dark:text-white leading-snug">
                {item.title}
              </h2>

              <div className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center space-x-2">
                  <Tag className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span className="font-semibold">{item.category}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{item.location?.city || item.location?.address || 'Location provided'}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{new Date(item.dateOccurred || item.createdAt).toLocaleDateString()}</span>
                </div>

                {item.rewardAmount > 0 && (
                  <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-extrabold text-sm pt-1">
                    <DollarSign className="w-4 h-4 shrink-0" />
                    <span>${item.rewardAmount} Reward Offered</span>
                  </div>
                )}
              </div>
            </div>

            {/* Poster Contact Details Card */}
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-2 bg-slate-50 dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
              <p className="font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>Posted by: {item.contactName || item.user?.name || 'Community Member'}</span>
              </p>
              
              {(item.contactPhone || item.user?.phone) && (
                <p className="flex items-center space-x-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                  <Phone className="w-3.5 h-3.5 shrink-0" />
                  <a href={`tel:${item.contactPhone || item.user?.phone}`} className="hover:underline">
                    {item.contactPhone || item.user?.phone}
                  </a>
                </p>
              )}

              {(item.contactEmail || item.user?.email) && (
                <p className="flex items-center space-x-1.5 font-semibold text-blue-600 dark:text-blue-400">
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  <a href={`mailto:${item.contactEmail || item.user?.email}`} className="hover:underline">
                    {item.contactEmail || item.user?.email}
                  </a>
                </p>
              )}

              <p className="text-[10px] text-slate-400 font-mono pt-0.5">
                Status: <span className="font-bold text-blue-600 dark:text-blue-400 uppercase">{item.status || 'Active'}</span>
              </p>
            </div>
          </div>

          {/* Details & Contact Form Right Column */}
          <div className="md:col-span-7 p-6 space-y-6">
            
            {/* Item Description */}
            <div>
              <h3 className="font-display font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                Item Description
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                {item.description}
              </p>
            </div>

            {/* Dynamic "Found or Lost Item? Contact Poster" Form */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  <Send className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-base text-slate-900 dark:text-white">
                    {isLost ? "Found or Lost Item? Contact Poster" : "Is this your item? Contact Poster"}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isLost 
                      ? "Send a message to the poster if you found their item or have info to help reconnect!"
                      : "Send a direct message & claim report to the finder so you can arrange safe return!"
                    }
                  </p>
                </div>
              </div>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-display font-extrabold text-base text-emerald-900 dark:text-emerald-200">
                    Message Sent to Poster!
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 max-w-xs mx-auto">
                    The item poster has been notified in their dashboard with your contact information to connect with you.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-6 py-2 bg-emerald-600 text-white font-bold text-xs rounded-full shadow hover:bg-emerald-700 transition-all mt-2"
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Your Full Name
                      </label>
                      <div className="relative">
                        <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          name="finderName"
                          value={formData.finderName}
                          onChange={handleChange}
                          placeholder="e.g. Jane Doe"
                          className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-600"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="email"
                          name="finderEmail"
                          value={formData.finderEmail}
                          onChange={handleChange}
                          placeholder="jane@example.com"
                          className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-600"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="tel"
                          name="finderPhone"
                          value={formData.finderPhone}
                          onChange={handleChange}
                          placeholder="+250 788 847 286"
                          className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-600"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Your Location / Address
                      </label>
                      <AddressAutocompleteInput
                        name="foundLocation"
                        value={formData.foundLocation}
                        onChange={handleChange}
                        placeholder="Type address (e.g. Kacyiru, Nyarugenge...)"
                        required={true}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Message / Additional Details
                    </label>
                    <div className="relative">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="2"
                        placeholder="Type your message to the poster..."
                        className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-600"
                        required
                      ></textarea>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-full shadow-md shadow-blue-600/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 mt-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'Sending Message...' : 'Send Message to Poster'}</span>
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ItemDetailsModal;
