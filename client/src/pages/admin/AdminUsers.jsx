import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Search, Shield, User, Trash2, CheckCircle2, XCircle, RefreshCw, Crown, AlertTriangle, X } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [notice, setNotice] = useState('');

  // Delete Modal State
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm.trim()) params.set('q', searchTerm.trim());
      if (roleFilter !== 'all') params.set('role', roleFilter);

      const res = await API.get(`/admin/users?${params.toString()}`);
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error('Error fetching users list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const roleLabel = newRole === 'admin' ? 'Super Admin' : 'Item Poster';
    try {
      const res = await API.put(`/admin/users/${userId}/role`, { role: newRole });
      if (res.data.success) {
        setNotice(`Account updated to ${roleLabel}`);
        fetchUsers();
        setTimeout(() => setNotice(''), 4000);
      }
    } catch (err) {
      alert('Error updating role: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleStatusToggle = async (userId) => {
    try {
      const res = await API.put(`/admin/users/${userId}/status`);
      if (res.data.success) {
        setNotice(res.data.message);
        fetchUsers();
        setTimeout(() => setNotice(''), 4000);
      }
    } catch (err) {
      alert('Error toggling status: ' + (err.response?.data?.message || err.message));
    }
  };

  // Perform confirmed account deletion
  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    setDeleting(true);
    try {
      const res = await API.delete(`/admin/users/${userToDelete._id}`);
      if (res.data.success) {
        setNotice(`Account ${userToDelete.email} permanently deleted.`);
        setUsers((prev) => prev.filter((u) => u._id !== userToDelete._id));
        setUserToDelete(null);
        setTimeout(() => setNotice(''), 4000);
      }
    } catch (err) {
      alert('Error deleting user: ' + (err.response?.data?.message || err.message));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-slate-900 dark:text-white">
            User Accounts & Super Admin Access Control
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Manage registered item posters (who administer their own posts), grant or revoke Super Admin platform privileges, and delete accounts
          </p>
        </div>
      </div>

      {/* Notice Banner */}
      {notice && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Filter Control Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-3xl flex flex-col sm:flex-row gap-4 items-center justify-between shadow-xs">
        
        {/* Search */}
        <form onSubmit={(e) => { e.preventDefault(); fetchUsers(); }} className="relative flex-grow w-full sm:w-auto max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white text-xs placeholder-slate-400 focus:outline-none focus:border-blue-600"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        </form>

        {/* Role Selector */}
        <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-950 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-800 shrink-0 w-full sm:w-auto">
          <button
            onClick={() => setRoleFilter('all')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
              roleFilter === 'all' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            All Accounts
          </button>
          <button
            onClick={() => setRoleFilter('user')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
              roleFilter === 'user' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Item Posters / Members
          </button>
          <button
            onClick={() => setRoleFilter('admin')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
              roleFilter === 'admin' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Super Admins
          </button>
        </div>

      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-extrabold border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Account Info</th>
                <th className="px-6 py-4">Platform Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4 text-right">Super Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">Loading accounts...</td>
                </tr>
              ) : users.length > 0 ? (
                users.map((u) => {
                  const isSuperAdmin = u.role === 'admin';
                  return (
                    <tr key={u._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-600/20 text-blue-700 dark:text-blue-400 font-bold flex items-center justify-center border border-blue-200 dark:border-blue-500/30">
                            {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-sm">{u.name}</p>
                            <p className="text-slate-500 dark:text-slate-400 text-xs font-mono">{u.email} | {u.phone}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full font-extrabold text-[10px] uppercase tracking-wider inline-flex items-center ${
                          isSuperAdmin 
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300 border border-purple-200 dark:border-purple-500/40' 
                            : 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800'
                        }`}>
                          {isSuperAdmin ? (
                            <>
                              <Crown className="w-3 h-3 mr-1 text-amber-500" />
                              <span>Super Admin</span>
                            </>
                          ) : (
                            <>
                              <User className="w-3 h-3 mr-1 text-blue-600" />
                              <span>Item Poster / Member</span>
                            </>
                          )}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full font-bold text-[10px] ${
                          u.isVerified !== false 
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' 
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400'
                        }`}>
                          {u.isVerified !== false ? 'Active' : 'Deactivated'}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-medium">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleRoleToggle(u._id, u.role)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                            isSuperAdmin
                              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                              : 'bg-purple-50 hover:bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                          }`}
                          title="Grant or revoke Super Admin control panel access"
                        >
                          {isSuperAdmin ? 'Revoke Super Admin' : 'Make Super Admin'}
                        </button>
                        <button
                          onClick={() => handleStatusToggle(u._id)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition-all"
                        >
                          {u.isVerified !== false ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => setUserToDelete(u)}
                          className="p-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/20 rounded-lg transition-colors"
                          title="Delete Account"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">No accounts found matching query.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Custom Designed Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-rose-600">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-display font-extrabold text-base text-slate-900 dark:text-white">Delete User Account?</span>
              </div>
              <button
                onClick={() => setUserToDelete(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Are you sure you want to permanently delete account <strong className="text-slate-900 dark:text-white font-mono">{userToDelete.email}</strong> ({userToDelete.name})?
              </p>
              <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium bg-rose-50 dark:bg-rose-950/40 p-3 rounded-2xl border border-rose-200 dark:border-rose-900/50">
                ⚠️ Warning: All posted items and claims associated with this account will be permanently deleted. This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDeleteUser}
                disabled={deleting}
                className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all flex items-center space-x-2"
              >
                {deleting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Yes, Delete Account</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminUsers;
