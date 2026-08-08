import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, HelpCircle, Clock } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
      setTimeout(() => setSubmitted(false), 6000);
    }, 1000);
  };

  const faqs = [
    {
      q: 'How does item verification work in Kigali?',
      a: 'When claiming a lost item, finders will ask you to verify specific details not visible in public photos (e.g. wallpaper picture, serial number, ID card number, or exact contents).',
    },
    {
      q: 'Is my personal contact information private?',
      a: 'Yes! Your personal phone number and email are kept secure. All initial communication takes place securely through our built-in notification system.',
    },
    {
      q: 'How long do lost and found posts stay active?',
      a: 'Listings remain active until marked as resolved or reconnected with rightful owners.',
    },
    {
      q: 'What should I do if I find an ID or Official Document in Kigali?',
      a: 'You can post a found report on our platform and specify the safe pickup location (e.g. nearest Police Station or Sector Office in Kigali).',
    },
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen py-12 lg:py-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1.5 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider">
            Kigali Support Center
          </span>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-slate-900 dark:text-white mt-4">
            Contact Support & Inquiries
          </h1>
          <p className="mt-4 text-slate-600 dark:text-slate-400 text-lg">
            Have questions about lost items, claim verifications, or platform features? Our dedicated team in Kigali is available to assist you.
          </p>
        </div>

        {/* Contact Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Email Support</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Our team responds in &lt;2 hours</p>
              <a href="mailto:support@lostfoundapp.com" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline block mt-2">
                support@lostfoundapp.com
              </a>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Phone Assistance</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Mon - Sun, 24/7 Helpline</p>
              <a href="tel:+250788847286" className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline block mt-2">
                +250 788 847 286
              </a>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-600/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Headquarters</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Remera Hub</p>
              <p className="text-sm font-extrabold text-slate-900 dark:text-white block mt-2">
                Kigali, Remera
              </p>
            </div>
          </div>
        </div>

        {/* Embedded Kigali Interactive Map & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          
          {/* Form */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <div>
              <h2 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white mb-2">
                Send Us a Message
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Fill out the form below and our Kigali support team will get back to you.
              </p>
            </div>

            {submitted && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start space-x-3 text-emerald-800 dark:text-emerald-300 text-sm">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-600" />
                <span>Thank you! Your message has been sent successfully to +250 788 847 286 support line.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Attorney Valois"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="attorney@example.com"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Inquiry Topic
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-bold"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Claim Verification Help">Claim Verification Help</option>
                  <option value="Report Found Item in Kigali">Report Found Item in Kigali</option>
                  <option value="Report Suspicious User">Report Suspicious Activity</option>
                  <option value="Technical Support">Technical Support</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Message Details
                </label>
                <textarea
                  rows="4"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Describe how we can assist you..."
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-full shadow-md shadow-blue-600/20 transition-all flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message to Support</span>
                  </>
                )}
              </button>
            </form>

            {/* Embedded Kigali Interactive Map */}
            <div className="pt-4 space-y-2">
              <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                Kigali Headquarters Map
              </span>
              <div className="w-full h-56 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
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
            </div>

          </div>

          {/* FAQ Accordion Section */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center space-x-3">
              <HelpCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h2 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {faq.q}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Contact;
