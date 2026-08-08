import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, Search, Clock } from 'lucide-react';

const AdminClaims = () => {
  const [claims, setClaims] = useState([
    {
      _id: 'clm_101',
      itemTitle: 'Lost iPhone 15 Pro Max',
      claimantName: 'Sarah Jenkins',
      claimantEmail: 'sarah.j@example.com',
      proofDetails: 'Wallpaper is a picture of a Golden Retriever named Max. Provided purchase invoice receipt.',
      status: 'pending',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      _id: 'clm_102',
      itemTitle: 'Found Seiko Watch',
      claimantName: 'David Miller',
      claimantEmail: 'dmiller@example.com',
      proofDetails: 'Engraved initials D.M. on the inner clasp of the watch band.',
      status: 'approved',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    }
  ]);

  const [notice, setNotice] = useState('');

  const handleAction = (id, action) => {
    setClaims((prev) =>
      prev.map((c) => (c._id === id ? { ...c, status: action } : c))
    );
    setNotice(`Claim ${id} marked as ${action}!`);
    setTimeout(() => setNotice(''), 4000);
  };

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="font-display font-extrabold text-3xl text-slate-900 dark:text-white">
          Claims Verification & Resolution Center
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Review ownership proof, verify item claims, and approve returns
        </p>
      </div>

      {notice && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-extrabold border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Claim ID</th>
                <th className="px-6 py-4">Item Title</th>
                <th className="px-6 py-4">Claimant</th>
                <th className="px-6 py-4">Proof Provided</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {claims.map((c) => (
                <tr key={c._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 font-mono text-slate-500 dark:text-slate-400 font-bold">{c._id}</td>
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{c.itemTitle}</td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{c.claimantName}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] font-mono">{c.claimantEmail}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300 max-w-xs">{c.proofDetails}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full font-extrabold text-[10px] uppercase tracking-wider ${
                      c.status === 'approved' 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300' 
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleAction(c._id, 'approved')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(c._id, 'rejected')}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminClaims;
