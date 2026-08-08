import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import AddressAutocompleteInput from '../components/common/AddressAutocompleteInput';
import { 
  Package, 
  CheckCircle2, 
  Award, 
  Bell, 
  PlusCircle, 
  MapPin, 
  Calendar, 
  Mail, 
  Phone, 
  MessageSquare,
  Sparkles,
  Star,
  X,
  Trash2,
  Upload,
  ImageIcon,
  DollarSign,
  Tag,
  Check,
  Building,
  Edit,
  Filter,
  EyeOff
} from 'lucide-react';

const sampleImagePresets = [
  'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
];

const Dashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('items'); // 'items' | 'notifications'
  const [itemTypeFilter, setItemTypeFilter] = useState('all'); // 'all' | 'lost' | 'found'
  
  // Notifications list from database
  const [notifications, setNotifications] = useState([]);

  // URL Query Param Listener: ?tab=notifications switches tab automatically
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('tab') === 'notifications') {
      setActiveTab('notifications');
    }
  }, [location.search]);

  // Feedback modal state
  const [feedbackModalItem, setFeedbackModalItem] = useState(null);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [isAnonymousFeedback, setIsAnonymousFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // Edit Item Modal state
  const [editItem, setEditItem] = useState(null);
  const [updating, setUpdating] = useState(false);

  // Post Item Modal state
  const [showPostModal, setShowPostModal] = useState(false);
  const [posting, setPosting] = useState(false);
  const [notice, setNotice] = useState('');
  const [postForm, setPostForm] = useState({
    title: '',
    type: 'lost',
    category: 'Wallets & Purses',
    city: 'Kigali',
    address: '',
    holdingLocation: '',
    dateOccurred: new Date().toISOString().split('T')[0],
    rewardAmount: 0,
    contactPhone: user?.phone || '+250788847286',
    contactEmail: user?.email || '',
    description: '',
    images: [sampleImagePresets[0]],
  });

  const fetchUserItems = useCallback(async () => {
    try {
      const res = await API.get('/items/my-items');
      if (res.data.success) {
        setItems(res.data.items);
      }
    } catch (err) {
      console.error('Error fetching user items:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserNotifications = useCallback(async () => {
    try {
      const res = await API.get('/claims/my-notifications');
      if (res.data.success) {
        setNotifications(res.data.notifications);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  }, []);

  // Real-time Data Sync & Auto-refetch on Mount, Window Focus & Interval
  useEffect(() => {
    fetchUserItems();
    fetchUserNotifications();

    const handleFocus = () => {
      fetchUserItems();
      fetchUserNotifications();
    };

    window.addEventListener('focus', handleFocus);
    const interval = setInterval(() => {
      fetchUserItems();
      fetchUserNotifications();
    }, 8000); // Auto-sync every 8 seconds

    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, [fetchUserItems, fetchUserNotifications]);

  const handlePostInputChange = (e) => {
    const { name, value } = e.target;
    setPostForm((prev) => ({ ...prev, [name]: value }));
  };

  // Device File Upload handler with instant thumbnail preview
  const handlePostFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setPostForm((prev) => ({ ...prev, images: [event.target.result] }));
    };
    reader.readAsDataURL(file);
  };

  // Submit Post New Item
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!postForm.title.trim() || !postForm.description.trim()) return;

    setPosting(true);
    try {
      const isLost = postForm.type === 'lost';
      const payload = {
        title: postForm.title,
        type: postForm.type,
        category: postForm.category,
        location: {
          city: postForm.city || 'Kigali',
          address: isLost ? (postForm.address || 'Location provided') : `${postForm.address || 'Found location'} (Safe Storage: ${postForm.holdingLocation || 'Held by finder'})`,
        },
        dateOccurred: postForm.dateOccurred,
        rewardAmount: isLost ? (Number(postForm.rewardAmount) || 0) : 0,
        contactPhone: postForm.contactPhone || user?.phone || '+250788847286',
        contactEmail: postForm.contactEmail || user?.email || '',
        description: postForm.description,
        images: postForm.images.length > 0 ? postForm.images : [sampleImagePresets[0]],
      };

      const res = await API.post('/items', payload);
      if (res.data.success) {
        setNotice('🎉 Item posted successfully! Your listing is now live on the homepage under Recently Reported Items.');
        setShowPostModal(false);
        fetchUserItems();
        fetchUserNotifications();
        // Reset form
        setPostForm({
          title: '',
          type: 'lost',
          category: 'Wallets & Purses',
          city: 'Kigali',
          address: '',
          holdingLocation: '',
          dateOccurred: new Date().toISOString().split('T')[0],
          rewardAmount: 0,
          contactPhone: user?.phone || '+250788847286',
          contactEmail: user?.email || '',
          description: '',
          images: [sampleImagePresets[0]],
        });
        setTimeout(() => setNotice(''), 5000);
      }
    } catch (err) {
      alert('Error posting item: ' + (err.response?.data?.message || err.message));
    } finally {
      setPosting(false);
    }
  };

  // Submit Update Item Details
  const handleUpdateItemSubmit = async (e) => {
    e.preventDefault();
    if (!editItem) return;

    setUpdating(true);
    try {
      const res = await API.put(`/items/${editItem._id}`, editItem);
      if (res.data.success) {
        setNotice('Item updated successfully!');
        setEditItem(null);
        fetchUserItems();
        setTimeout(() => setNotice(''), 4000);
      }
    } catch (err) {
      alert('Error updating item: ' + (err.response?.data?.message || err.message));
    } finally {
      setUpdating(false);
    }
  };

  const handleMarkResolved = async (itemId, title) => {
    setFeedbackModalItem({ id: itemId, title });
    setFeedbackSuccess(false);
    setIsAnonymousFeedback(false);
    setFeedbackComment('');
  };

  const submitFeedback = async (e) => {
    e.preventDefault();
    try {
      if (feedbackModalItem) {
        await API.put(`/items/${feedbackModalItem.id}`, { status: 'resolved' });
        
        // Post community testimonial rating & feedback with anonymous option
        try {
          await API.post('/feedback', {
            itemId: feedbackModalItem.id,
            rating: feedbackRating,
            comment: feedbackComment || 'Successfully reconnected with my item!',
            isAnonymous: isAnonymousFeedback,
          });
        } catch (err) {
          // Silent catch if feedback fails
        }

        setItems((prev) =>
          prev.map((i) => (i._id === feedbackModalItem.id ? { ...i, status: 'resolved' } : i))
        );
      }
      setFeedbackSuccess(true);
      setTimeout(() => {
        setFeedbackModalItem(null);
      }, 1500);
    } catch (err) {
      alert('Error marking item as resolved: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await API.delete(`/items/${itemId}`);
      setItems((prev) => prev.filter((i) => i._id !== itemId));
    } catch (err) {
      alert('Error deleting item: ' + (err.response?.data?.message || err.message));
    }
  };

  // Delete Found Notification
  const handleDeleteNotification = async (notificationId) => {
    if (!window.confirm('Are you sure you want to delete this notification report?')) return;
    try {
      await API.delete(`/claims/${notificationId}`);
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
    } catch (err) {
      alert('Error deleting notification: ' + (err.response?.data?.message || err.message));
    }
  };

  const isLostType = postForm.type === 'lost';

  // Filter items by type ('all' | 'lost' | 'found')
  const filteredItems = items.filter((item) => {
    if (itemTypeFilter === 'all') return true;
    return item.type === itemTypeFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Clean Light Glassmorphism Welcome Banner */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-8 shadow-lg shadow-blue-500/5 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-gradient-to-r from-blue-50/80 via-slate-50 to-indigo-50/80 dark:from-slate-900 dark:to-slate-900">
          <div className="space-y-2 z-10">
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight text-slate-900 dark:text-white">
              Welcome back, {user?.name || 'Community Member'}! 👋
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl">
              Track your reported items in Kigali & Rwanda, receive real-time notifications when someone finds your item, and manage your claims.
            </p>
          </div>

          <div className="flex items-center space-x-3 z-10 shrink-0">
            <button
              onClick={() => setShowPostModal(true)}
              className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-full shadow-lg shadow-blue-600/30 transition-all flex items-center space-x-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post New Item</span>
            </button>
          </div>
        </div>

        {/* Notice Banner */}
        {notice && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notice}</span>
          </div>
        )}

        {/* Crisp Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-3xl space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold">My Posted Items</span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center">
                <Package className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold font-display text-slate-900 dark:text-white">{items.length}</p>
            <p className="text-[11px] text-slate-500 font-medium">Active & resolved listings</p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-3xl space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold">Found Notifications</span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold font-display text-amber-600 dark:text-amber-400">{notifications.length}</p>
            <p className="text-[11px] text-slate-500 font-medium">Finder contact reports</p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-3xl space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold">Trust Score</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold font-display text-emerald-600 dark:text-emerald-400">{user?.trustScore || 100}</p>
            <p className="text-[11px] text-emerald-600 font-medium">Verified Community Rank</p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-3xl space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold">Resolved Returns</span>
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold font-display text-purple-600 dark:text-purple-400">
              {items.filter((i) => i.status === 'resolved').length}
            </p>
            <p className="text-[11px] text-slate-500 font-medium">Successfully reconnected</p>
          </div>

        </div>

        {/* Tab Navigation & Type Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          
          <div className="flex space-x-6">
            <button
              onClick={() => {
                setActiveTab('items');
                fetchUserItems();
              }}
              className={`font-display font-extrabold text-base transition-colors relative pb-2 ${
                activeTab === 'items'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>My Posted Items ({items.length})</span>
              {activeTab === 'items' && (
                <span className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full"></span>
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab('notifications');
                fetchUserNotifications();
              }}
              className={`font-display font-extrabold text-base transition-colors relative pb-2 flex items-center space-x-2 ${
                activeTab === 'notifications'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>Found Notifications ({notifications.length})</span>
              {notifications.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white font-bold text-[10px]">NEW</span>
              )}
              {activeTab === 'notifications' && (
                <span className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full"></span>
              )}
            </button>
          </div>

          {/* Lost vs Found Filtering Buttons */}
          {activeTab === 'items' && (
            <div className="flex items-center space-x-1.5 bg-slate-200/60 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-800">
              <button
                onClick={() => setItemTypeFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  itemTypeFilter === 'all'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                All ({items.length})
              </button>

              <button
                onClick={() => setItemTypeFilter('lost')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  itemTypeFilter === 'lost'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                🔴 Lost ({items.filter((i) => i.type === 'lost').length})
              </button>

              <button
                onClick={() => setItemTypeFilter('found')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  itemTypeFilter === 'found'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                🟢 Found ({items.filter((i) => i.type === 'found').length})
              </button>
            </div>
          )}

        </div>

        {/* TAB 1: Compact Sleek Posted Items Grid */}
        {activeTab === 'items' && (
          <div className="space-y-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-3">
                <div className="w-9 h-9 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="text-xs text-slate-400 font-medium">Fetching listed items...</p>
              </div>
            ) : filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredItems.map((item) => {
                  const isLost = item.type === 'lost';
                  const isResolved = item.status === 'resolved';

                  return (
                    <div
                      key={item._id}
                      className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* Compact Height Image Header */}
                        <div className="relative h-36 bg-slate-100 dark:bg-slate-950 overflow-hidden">
                          <img
                            src={item.images && item.images[0] ? item.images[0] : sampleImagePresets[0]}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2 flex items-center space-x-1.5">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-xs ${
                              isLost ? 'bg-rose-600' : 'bg-emerald-600'
                            }`}>
                              {item.type}
                            </span>
                            {isResolved && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-extrabold text-[10px]">
                                RESOLVED
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Basic Compact Information */}
                        <div className="p-4 space-y-2">
                          <h3 className="font-display font-extrabold text-sm text-slate-900 dark:text-white line-clamp-1">
                            {item.title}
                          </h3>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                            {item.description}
                          </p>

                          <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 pt-1">
                            <div className="flex items-center space-x-1.5">
                              <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                              <span className="truncate">{item.location?.city || item.location?.address || 'Kigali Area'}</span>
                            </div>
                            <div className="flex items-center space-x-1.5">
                              <Calendar className="w-3 h-3 text-amber-500 shrink-0" />
                              <span>{new Date(item.dateOccurred || item.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Compact Action Controls Footer */}
                      <div className="p-3 pt-0 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 mt-2">
                        {!isResolved ? (
                          <button
                            onClick={() => handleMarkResolved(item._id, item.title)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-full shadow-xs transition-all flex items-center space-x-1"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Mark Found</span>
                          </button>
                        ) : (
                          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Reconnected
                          </span>
                        )}

                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => setEditItem(item)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                            title="Edit Details"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteItem(item._id)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                            title="Delete Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4">
                <Package className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="font-display font-extrabold text-xl text-slate-900 dark:text-white">
                  No items match this filter
                </h3>
                <p className="text-slate-500 text-xs max-w-sm mx-auto">
                  Have you lost or found a personal item in Kigali? Post it now to connect with finders in your area.
                </p>
                <button
                  onClick={() => setShowPostModal(true)}
                  className="inline-block px-6 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-full shadow"
                >
                  Post New Item
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Real-time Notifications Center */}
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  key={notif._id}
                  className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-3xl shadow-xs space-y-4 relative group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 flex items-center justify-center font-bold">
                        <Bell className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-display font-extrabold text-base text-slate-900 dark:text-white">
                          Found/Lost Report for: "{notif.itemTitle || notif.item?.title}"
                        </h4>
                        <p className="text-xs text-slate-500">
                          Received {new Date(notif.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 font-extrabold text-xs w-fit">
                        Contact Details Attached
                      </span>

                      {/* Delete Notification Button */}
                      <button
                        onClick={() => handleDeleteNotification(notif._id)}
                        className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                        title="Delete Notification"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Contact Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Sender Name</span>
                      <span className="font-bold text-slate-900 dark:text-white">{notif.finderName}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Email Address</span>
                      <a href={`mailto:${notif.finderEmail}`} className="font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center mt-0.5">
                        <Mail className="w-3.5 h-3.5 mr-1" /> {notif.finderEmail}
                      </a>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Phone Number</span>
                      <a href={`tel:${notif.finderPhone}`} className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center mt-0.5">
                        <Phone className="w-3.5 h-3.5 mr-1" /> {notif.finderPhone}
                      </a>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Message & Location Note:</span>
                    <p className="text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-950 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
                      "{notif.message}" — Location: <span className="font-semibold text-slate-800 dark:text-slate-200">{notif.foundLocation}</span>
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-3">
                <Bell className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="font-display font-extrabold text-lg text-slate-900 dark:text-white">
                  No notifications yet
                </h3>
                <p className="text-slate-500 text-xs max-w-sm mx-auto">
                  When someone contacts you about a lost or found item, their contact details and message will appear here automatically.
                </p>
              </div>
            )}
          </div>
        )}

      </div>

      {/* DYNAMIC POST NEW ITEM MODAL WITH ADDRESS AUTOCOMPLETE */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <PlusCircle className="w-5 h-5 text-blue-600" />
                <span className="font-display font-extrabold text-lg text-slate-900 dark:text-white">
                  {isLostType ? 'Report a Lost Item in Kigali' : 'Report a Found Item in Kigali'}
                </span>
              </div>
              <button
                onClick={() => setShowPostModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostSubmit} className="space-y-4">
              
              {/* Type Selection Radio Group */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">What are you reporting?</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPostForm({ ...postForm, type: 'lost' })}
                    className={`py-3 px-4 rounded-2xl border text-xs font-extrabold flex items-center justify-center space-x-2 transition-all ${
                      isLostType
                        ? 'bg-rose-50 border-rose-500 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 shadow-xs ring-2 ring-rose-500/20'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
                    <span>🔴 I Lost Something</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPostForm({ ...postForm, type: 'found' })}
                    className={`py-3 px-4 rounded-2xl border text-xs font-extrabold flex items-center justify-center space-x-2 transition-all ${
                      !isLostType
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 shadow-xs ring-2 ring-emerald-500/20'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                    <span>🟢 I Found Something</span>
                  </button>
                </div>
              </div>

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-7">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {isLostType ? 'Lost Item Title' : 'Found Item Title'}
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={postForm.title}
                    onChange={handlePostInputChange}
                    placeholder={isLostType ? "e.g. Lost Black Leather Wallet near Kacyiru" : "e.g. Found Silver Seiko Watch"}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>

                <div className="sm:col-span-5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Category</label>
                  <select
                    name="category"
                    value={postForm.category}
                    onChange={handlePostInputChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white text-xs font-bold focus:outline-none"
                  >
                    <option value="Wallets & Purses">Wallets & Purses</option>
                    <option value="Electronics">Electronics & Phones</option>
                    <option value="Keys & Accessories">Keys & Accessories</option>
                    <option value="Documents & IDs">Documents & IDs</option>
                    <option value="Bags & Luggage">Bags & Luggage</option>
                    <option value="Pets">Pets & Animals</option>
                    <option value="Other">Other Belongings</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Location & Address Autocomplete */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">City / District</label>
                  <input
                    type="text"
                    name="city"
                    value={postForm.city}
                    onChange={handlePostInputChange}
                    placeholder="Kigali"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>

                <div className="sm:col-span-7">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {isLostType ? 'Specific Address Where Lost' : 'Location Where Found'}
                  </label>
                  <AddressAutocompleteInput
                    name="address"
                    value={postForm.address}
                    onChange={handlePostInputChange}
                    placeholder="Type address (e.g. Kacyiru, Nyarugenge, Kimironko...)"
                  />
                </div>
              </div>

              {/* Phone Number Contact Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center space-x-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Contact Phone Number (Direct calls / SMS)</span>
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={postForm.contactPhone}
                  onChange={handlePostInputChange}
                  placeholder="+250 788 847 286"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-blue-600"
                />
              </div>

              {/* Found-Specific Storage Location OR Lost-Specific Reward Amount */}
              {!isLostType ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center space-x-1">
                    <Building className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Current Safe Storage / Pickup Location</span>
                  </label>
                  <input
                    type="text"
                    name="holdingLocation"
                    value={postForm.holdingLocation}
                    onChange={handlePostInputChange}
                    placeholder="e.g. Safely held at Station Info Desk / Kept with Finder"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-blue-600"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                  <div className="sm:col-span-6">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Date Lost</label>
                    <input
                      type="date"
                      name="dateOccurred"
                      value={postForm.dateOccurred}
                      onChange={handlePostInputChange}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div className="sm:col-span-6">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Reward Amount ($ USD Optional)</label>
                    <input
                      type="number"
                      name="rewardAmount"
                      value={postForm.rewardAmount}
                      onChange={handlePostInputChange}
                      placeholder="0"
                      min="0"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Item Description & Identifiers</label>
                <textarea
                  rows="3"
                  name="description"
                  value={postForm.description}
                  onChange={handlePostInputChange}
                  placeholder="Describe unique characteristics, color, brand, or markings..."
                  className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-blue-600"
                  required
                ></textarea>
              </div>

              {/* Image Upload with Live Selected Thumbnail Preview */}
              <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Item Photo (Upload or Select Sample)
                </label>

                <div className="flex flex-wrap items-center gap-3">
                  <label className="py-2.5 px-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-2xl cursor-pointer flex items-center space-x-2 shadow-xs shrink-0">
                    <Upload className="w-4 h-4" />
                    <span>Upload Image File...</span>
                    <input
                      type="file"
                      accept="image/*"
                      onClick={(e) => { e.target.value = null; }}
                      onChange={handlePostFileUpload}
                      className="hidden"
                    />
                  </label>

                  {postForm.images && postForm.images[0] && (
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-blue-600 shadow-md group shrink-0">
                      <img src={postForm.images[0]} alt="Selected Thumbnail" className="w-full h-full object-cover" />
                      <div className="absolute top-1 right-1 w-4 h-4 bg-blue-600 text-white rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 pl-2 border-l border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] text-slate-400 font-semibold mr-1">Presets:</span>
                    {sampleImagePresets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setPostForm((prev) => ({ ...prev, images: [preset] }))}
                        className={`w-10 h-10 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                          postForm.images[0] === preset ? 'border-blue-600 scale-105 shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={preset} alt={`Sample ${idx}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={posting}
                  className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all flex items-center space-x-2"
                >
                  {posting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Publishing Post...</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4" />
                      <span>{isLostType ? 'Publish Lost Item Report' : 'Publish Found Item Report'}</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* EDIT ITEM MODAL */}
      {editItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-blue-600">
                <Edit className="w-5 h-5" />
                <span className="font-display font-extrabold text-lg text-slate-900 dark:text-white">Edit Item Listing Details</span>
              </div>
              <button
                onClick={() => setEditItem(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateItemSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Item Title</label>
                <input
                  type="text"
                  value={editItem.title}
                  onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-blue-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Category</label>
                <select
                  value={editItem.category}
                  onChange={(e) => setEditItem({ ...editItem, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white text-xs font-bold focus:outline-none"
                >
                  <option value="Wallets & Purses">Wallets & Purses</option>
                  <option value="Electronics">Electronics & Phones</option>
                  <option value="Keys & Accessories">Keys & Accessories</option>
                  <option value="Documents & IDs">Documents & IDs</option>
                  <option value="Bags & Luggage">Bags & Luggage</option>
                  <option value="Pets">Pets & Animals</option>
                  <option value="Other">Other Belongings</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Location Address</label>
                <AddressAutocompleteInput
                  name="address"
                  value={editItem.location?.address || ''}
                  onChange={(e) => setEditItem({ ...editItem, location: { ...editItem.location, address: e.target.value } })}
                  placeholder="Type address..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Contact Phone Number</label>
                <input
                  type="tel"
                  value={editItem.contactPhone || ''}
                  onChange={(e) => setEditItem({ ...editItem, contactPhone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
                <textarea
                  rows="3"
                  value={editItem.description}
                  onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-blue-600"
                  required
                ></textarea>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditItem(null)}
                  className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all flex items-center space-x-2"
                >
                  {updating ? 'Saving...' : 'Save Updated Details'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Poster Mark as Resolved & Feedback Modal WITH ANONYMOUS OPTION */}
      {feedbackModalItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 relative">
            <button
              onClick={() => setFeedbackModalItem(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            {feedbackSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-display font-extrabold text-xl text-slate-900 dark:text-white">
                  Item Marked as Found!
                </h3>
                <p className="text-xs text-slate-500">
                  Thank you for keeping our community platform updated and leaving feedback!
                </p>
              </div>
            ) : (
              <form onSubmit={submitFeedback} className="space-y-4">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto font-bold">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-extrabold text-xl text-slate-900 dark:text-white">
                    Item Recovered Feedback
                  </h3>
                  <p className="text-xs text-slate-500">
                    Did you safely get your item "{feedbackModalItem.title}" back? Leave a quick rating & feedback!
                  </p>
                </div>

                <div className="flex justify-center space-x-2 py-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackRating(star)}
                      className="p-1 focus:outline-none"
                    >
                      <Star className={`w-7 h-7 ${star <= feedbackRating ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-700'}`} />
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Community Feedback / Note
                  </label>
                  <textarea
                    rows="3"
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    placeholder="Describe your recovery experience and thank the finder..."
                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                  ></textarea>
                </div>

                {/* Anonymous Option Checkbox */}
                <label className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymousFeedback}
                    onChange={(e) => setIsAnonymousFeedback(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                    <EyeOff className="w-4 h-4 text-slate-400" />
                    <span>Submit Feedback Anonymously (Hide my name on public reviews)</span>
                  </div>
                </label>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-full shadow transition-all"
                >
                  Submit & Mark Item as Found
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
