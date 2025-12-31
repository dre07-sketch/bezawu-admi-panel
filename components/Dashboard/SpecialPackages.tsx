
import React, { useState } from 'react';
import { Search, Plus, Gift, Trash2, Eye, EyeOff, Info, X, Package, List, ArrowRight } from 'lucide-react';
import { Bundle, BundleItem } from '../../types';

// Mock data based on SQL dump
const mockBundles: Bundle[] = [
  {
    id: 'BZWBU-229653',
    name: 'Family Essentials Pack',
    description: 'All your weekly kitchen needs in one go. Includes onions, beans, and more.',
    price: 1500.00,
    image_url: 'https://media.istockphoto.com/id/1205419959/photo/fresh-vegetables-in-eco-cotton-bags-on-table-in-the-kitchen.jpg?s=612x612&w=0&k=20&c=JdF6R4W5o6fW6_3J8z5X_7_4d9_4_8_2_5_8',
    is_active: true,
    created_at: '2025-12-31 16:55:07',
    items: [
      { id: 'BZWBUI-254851', bundle_id: 'BZWBU-229653', product_id: 'BZWP-298881', product_name: 'Red Onions', quantity: 2 },
      { id: 'BZWBUI-784696', bundle_id: 'BZWBU-229653', product_id: 'BZWP-138445', product_name: 'Green Beans', quantity: 1 },
    ]
  },
  {
    id: 'BZWBU-112566',
    name: 'Breakfast Special',
    description: 'Start your day right with these healthy options.',
    price: 850.50,
    image_url: 'https://t3.ftcdn.net/jpg/02/52/38/80/360_F_252388016_KjPnB9dlgPDqjFjKqjFjKqjFjKqjFjKq.jpg',
    is_active: true,
    created_at: '2025-12-31 16:55:07',
    items: [
      { id: 'BZWBUI-873171', bundle_id: 'BZWBU-112566', product_id: 'BZWP-120867', product_name: 'Rolled Oats', quantity: 5 },
    ]
  }
];

interface SpecialPackagesProps {
  isDarkMode: boolean;
  onAddPackage: () => void;
}

export const SpecialPackages: React.FC<SpecialPackagesProps> = ({ isDarkMode, onAddPackage }) => {
  const [bundles, setBundles] = useState<Bundle[]>(mockBundles);
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null);

  const toggleVisibility = (id: string) => {
    setBundles(prev => prev.map(b => b.id === id ? { ...b, is_active: !b.is_active } : b));
  };

  const deleteBundle = (id: string) => {
    if (confirm('Are you sure you want to delete this package?')) {
      setBundles(prev => prev.filter(b => b.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Special <span className="text-emerald-600">Packages</span>
          </h1>
          <p className={`${isDarkMode ? 'text-slate-500' : 'text-slate-400'} text-sm mt-1 flex items-center gap-2 font-bold uppercase tracking-widest`}>
            <Gift size={14} className="text-emerald-500" />
            Curated Bundles & Tactical Promotions
          </p>
        </div>
        <button 
          onClick={onAddPackage}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-8 py-3 rounded-2xl flex items-center gap-3 transition-all shadow-lg shadow-emerald-600/20 active:scale-[0.98] text-xs uppercase tracking-[0.2em]"
        >
          <Plus size={20} />
          Add Package
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className={`flex-1 border rounded-[1.5rem] px-6 py-3 flex items-center gap-4 transition-colors ${
          isDarkMode ? 'bg-[#121418] border-slate-800 focus-within:border-emerald-500/50 shadow-inner' : 'bg-white border-slate-200 focus-within:border-emerald-500'
        }`}>
          <Search size={18} className="text-slate-500" />
          <input 
            type="text" 
            placeholder="Search manifests..." 
            className="bg-transparent border-none w-full focus:outline-none placeholder:text-slate-600 font-bold text-sm" 
          />
        </div>
      </div>

      {/* List View */}
      <div className={`border rounded-[2.5rem] overflow-hidden ${isDarkMode ? 'bg-[#121418] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className={`border-b text-[10px] font-black uppercase tracking-widest ${
                isDarkMode ? 'bg-[#1a1d23] border-slate-800 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}>
                <th className="px-8 py-5">Bundle Identity</th>
                <th className="px-8 py-5">Price Model</th>
                <th className="px-8 py-5">Items</th>
                <th className="px-8 py-5">Visibility</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>
              {bundles.map((bundle) => (
                <tr key={bundle.id} className={`group transition-colors ${isDarkMode ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'} ${!bundle.is_active ? 'opacity-50' : ''}`}>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-5">
                      <div className="h-16 w-16 rounded-2xl overflow-hidden border border-slate-700/30 flex-shrink-0">
                        <img src={bundle.image_url} alt={bundle.name} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all" />
                      </div>
                      <div>
                        <p className={`text-base font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{bundle.name}</p>
                        <p className="text-[10px] text-slate-500 font-mono tracking-tighter uppercase italic">{bundle.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-xl font-black text-emerald-500">{bundle.price.toLocaleString()}</span>
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">ETB / UNIT</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-emerald-500' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
                        <List size={18} />
                      </div>
                      <div className="text-left">
                        <span className={`text-sm font-black ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{bundle.items?.length || 0} Assets</span>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Synchronized Items</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <button 
                      onClick={() => toggleVisibility(bundle.id)}
                      className={`flex items-center gap-3 px-4 py-2 rounded-full border transition-all ${
                        bundle.is_active 
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                          : 'bg-slate-800 border-slate-700 text-slate-500'
                      }`}
                    >
                      {bundle.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {bundle.is_active ? 'ACTIVE' : 'DORMANT'}
                      </span>
                    </button>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => setSelectedBundle(bundle)}
                        className={`p-3 rounded-xl transition-all ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:text-emerald-600'}`}
                        title="Manifest Details"
                      >
                        <Info size={18} />
                      </button>
                      <button 
                        onClick={() => deleteBundle(bundle.id)}
                        className="p-3 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-inner"
                        title="Decommission Bundle"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedBundle && (
        <BundleDetailModal 
          bundle={selectedBundle} 
          onClose={() => setSelectedBundle(null)} 
          isDarkMode={isDarkMode} 
        />
      )}
    </div>
  );
};

const BundleDetailModal: React.FC<{ bundle: Bundle, onClose: () => void, isDarkMode: boolean }> = ({ bundle, onClose, isDarkMode }) => {
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className={`max-w-3xl w-full rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] transition-all border animate-in zoom-in-95 duration-500 ${
        isDarkMode ? 'bg-[#121418] border-slate-800' : 'bg-white border-slate-100'
      }`}>
        <div className="px-10 pt-10 pb-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className={`p-4 rounded-2xl border transition-colors ${isDarkMode ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-100'}`}>
              <Gift className="text-emerald-500" size={36} />
            </div>
            <div>
              <h2 className={`text-3xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{bundle.name}</h2>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.3em] mt-1 italic">STRATEGIC_BUNDLE_ID: {bundle.id}</p>
            </div>
          </div>
          <button onClick={onClose} className={`p-3 rounded-xl transition-all ${isDarkMode ? 'bg-slate-800 text-slate-600 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}>
            <X size={28} />
          </button>
        </div>

        <div className="px-10 pb-10 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-8">
              <div className="h-56 rounded-[2rem] overflow-hidden border border-slate-800 shadow-2xl relative group">
                <img src={bundle.image_url} alt={bundle.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121418] via-transparent to-transparent opacity-60"></div>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Package size={16} className="text-emerald-500" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Bundle Manifest Content</span>
                </div>
                <div className={`rounded-[2rem] border overflow-hidden ${isDarkMode ? 'bg-slate-900/50 border-slate-800/50' : 'bg-slate-50 border-slate-200'}`}>
                  {bundle.items?.map((item) => (
                    <div key={item.id} className="p-5 flex items-center justify-between border-b border-slate-800/30 last:border-0 hover:bg-emerald-500/5 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                           <ArrowRight size={14} className="text-emerald-500" />
                        </div>
                        <span className={`text-sm font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{item.product_name}</span>
                      </div>
                      <span className="text-xs font-black text-emerald-500 px-3 py-1 bg-emerald-500/10 rounded-full">{item.quantity} UNITS</span>
                    </div>
                  ))}
                  {(!bundle.items || bundle.items.length === 0) && (
                    <div className="p-8 text-center text-xs text-slate-600 italic font-medium">Manifest is currently empty.</div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-8 flex flex-col justify-between">
              <div className="space-y-8">
                <div className={`p-8 rounded-[2rem] border ${isDarkMode ? 'bg-[#0f1115] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">Strategic Description</span>
                  <p className={`text-base leading-relaxed italic font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    "{bundle.description}"
                  </p>
                </div>

                <div className={`p-8 rounded-[2rem] border-2 border-emerald-500/20 flex flex-col items-center justify-center text-center ${isDarkMode ? 'bg-emerald-500/5' : 'bg-emerald-50'}`}>
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em] mb-2">Total Package Valuation</span>
                  <p className="text-5xl font-black text-emerald-500 tracking-tighter">{bundle.price.toLocaleString()} <span className="text-sm tracking-normal font-normal text-emerald-700 ml-1 italic">ETB</span></p>
                </div>
              </div>

              <div className={`flex items-center gap-4 px-6 py-4 rounded-2xl border ${isDarkMode ? 'bg-slate-900/50 border-slate-800/30' : 'bg-white border-slate-100 shadow-sm'}`}>
                <div className={`w-3 h-3 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.3)] ${bundle.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  Contextual State: <span className={bundle.is_active ? 'text-emerald-500' : 'text-rose-500'}>{bundle.is_active ? 'DEPLOYED_LIVE' : 'ISOLATED_DORMANT'}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={`p-10 flex items-center justify-end border-t transition-colors ${isDarkMode ? 'bg-[#1a1d23]/80 border-slate-800' : 'bg-[#f8fafc] border-slate-100'}`}>
          <button 
            onClick={onClose} 
            className={`px-14 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-xl ${isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-[#e2e8f0] text-[#475569] hover:bg-[#cbd5e1]'}`}
          >
            Acknowledge Manifest
          </button>
        </div>
      </div>
    </div>
  );
};
