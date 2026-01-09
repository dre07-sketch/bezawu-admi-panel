import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, Trash2, Power, TrendingUp, Sparkles, Loader2, X, Tag, Zap, Shield, Activity, ChevronRight, Star, Clock, BarChart3, PackageOpen, ArrowUpRight, Filter } from 'lucide-react';
import { Bundle } from '../../types';

interface SpecialPackagesProps {
    isDarkMode: boolean;
    onAddPackage: () => void;
}

const SpecialPackages: React.FC<SpecialPackagesProps> = ({ isDarkMode, onAddPackage }) => {
    const [bundles, setBundles] = useState<Bundle[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
    const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null);
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    const fetchBundles = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/bundles/bundles-get', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setBundles(data);
            }
        } catch (err) {
            console.error('Failed to fetch bundles:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBundles();
    }, []);

    const handleToggleStatus = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/bundles/bundles/${id}/toggle`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setBundles(prev => prev.map(b => b.id === id ? { ...b, is_active: !b.is_active } : b));
            }
        } catch (err) {
            console.error('Failed to toggle bundle:', err);
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to decommission this strategic bundle?')) return;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/bundles/bundles/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setBundles(prev => prev.filter(b => b.id !== id));
            }
        } catch (err) {
            console.error('Failed to delete bundle:', err);
        }
    };

    const filteredBundles = bundles.filter(b => {
        const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === 'ALL' ||
            (filter === 'ACTIVE' ? b.is_active : !b.is_active);
        return matchesSearch && matchesFilter;
    });

    const getImageUrl = (url?: string) => {
        if (!url) return 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1074';

        // Handle legacy absolute URLs with potential wrong IPs (e.g. 192.168.x.x)
        if (url.includes('/uploads/')) {
            const filename = url.split('/uploads/')[1];
            return `http://localhost:5000/uploads/${filename}`;
        }

        if (url.startsWith('http')) return url;
        return `http://localhost:5000${url}`;
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 min-h-[400px]">
                <div className="relative">
                    <Loader2 className="animate-spin text-emerald-500 mb-4" size={48} />
                    <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-pulse"></div>
                </div>
                <p className="text-sm font-black text-slate-500 uppercase tracking-widest animate-pulse font-mono">
                    Decrypting Strategic Packages...
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Strategic Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-lg shadow-emerald-500/30">
                            <Sparkles className="text-white" size={24} />
                        </div>
                        <div className="absolute -inset-1 bg-emerald-500 rounded-xl blur-lg opacity-30 animate-pulse"></div>
                    </div>
                    <div>
                        <h1 className={`text-3xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            Specialized Bundles
                        </h1>
                        <p className={`${isDarkMode ? 'text-slate-500' : 'text-slate-400'} text-sm font-medium`}>
                            Configure high-velocity product combinations
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className={`relative ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                            type="text"
                            placeholder="Search bundles..."
                            className={`w-64 pl-10 pr-4 py-2.5 rounded-xl border transition-all text-sm font-bold ${isDarkMode
                                ? 'bg-slate-800/50 border-slate-700 focus:border-emerald-500'
                                : 'bg-white border-slate-200 focus:border-emerald-500'
                                }`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={onAddPackage}
                        className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all gap-2 items-center flex shadow-lg shadow-emerald-500/20 active:scale-95"
                    >
                        <Plus size={16} />
                        New Bundle
                    </button>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2">
                {(['ALL', 'ACTIVE', 'INACTIVE'] as const).map((filterOption) => (
                    <button
                        key={filterOption}
                        onClick={() => setFilter(filterOption)}
                        className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${filter === filterOption
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                            : isDarkMode ? 'bg-slate-800/50 text-slate-400 hover:bg-slate-800' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                    >
                        <Filter size={14} />
                        {filterOption}
                    </button>
                ))}
            </div>

            {/* Awesome List Style */}
            <div className={`rounded-2xl border overflow-hidden transition-all duration-300 ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
                {filteredBundles.length === 0 ? (
                    <div className="p-12 text-center">
                        <Package className="mx-auto text-slate-400 mb-4" size={48} />
                        <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>No bundles found</p>
                        <p className="text-sm text-slate-500 mt-1">Create your first bundle to get started</p>
                    </div>
                ) : (
                    <div className={`divide-y ${isDarkMode ? 'divide-slate-700' : 'divide-slate-100'}`}>
                        {filteredBundles.map((bundle) => (
                            <div
                                key={bundle.id}
                                onClick={() => setSelectedBundle(bundle)}
                                onMouseEnter={() => setHoveredId(bundle.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                className={`group relative p-5 transition-all duration-200 cursor-pointer hover:bg-slate-50/50 ${isDarkMode ? 'hover:bg-slate-700/30' : 'hover:bg-slate-50'
                                    }`}
                            >
                                <div className="flex flex-col md:flex-row md:items-center gap-6">
                                    {/* Image Section */}
                                    <div className="relative flex-shrink-0 w-full md:w-48 h-32 rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition-all">
                                        <img
                                            src={getImageUrl(bundle.image_url)}
                                            alt={bundle.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                        {bundle.discount > 0 && (
                                            <div className="absolute top-2 left-2 bg-rose-600/90 backdrop-blur-sm text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-sm">
                                                -{bundle.discount}%
                                            </div>
                                        )}
                                    </div>

                                    {/* Content Section */}
                                    <div className="flex-grow min-w-0 py-1">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className={`font-black text-lg truncate pr-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                                    {bundle.name}
                                                </h3>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${bundle.is_active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'
                                                        }`}>
                                                        <div className={`w-1.5 h-1.5 rounded-full ${bundle.is_active ? 'bg-emerald-500' : 'bg-slate-500'}`} />
                                                        {bundle.is_active ? 'Active' : 'Inactive'}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs font-medium text-amber-500">
                                                        <Star size={12} fill="currentColor" />
                                                        <span>4.8</span>
                                                        <span className="text-slate-400 font-normal">(32)</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Price - Mobile visible, Desktop hidden (moved to right) */}
                                            <div className="md:hidden text-right">
                                                <span className={`block font-black text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                                    {bundle.price.toLocaleString()}
                                                </span>
                                                <span className="text-[10px] font-bold text-emerald-500 uppercase">ETB</span>
                                            </div>
                                        </div>

                                        <p className={`text-sm line-clamp-2 mb-3 max-w-2xl ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                            {bundle.description || "No description provided."}
                                        </p>

                                        <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                                            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                                                <PackageOpen size={14} />
                                                <span>{bundle.items?.length || 0} Items</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                                                <Activity size={14} />
                                                <span>High Demand</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions & Price Section (Desktop) */}
                                    <div className="flex-shrink-0 flex flex-col items-end justify-between gap-4 min-w-[140px] pl-4 md:border-l border-slate-100 dark:border-slate-800">
                                        <div className="hidden md:block text-right">
                                            <div className="flex items-baseline justify-end gap-1">
                                                <span className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                                    {bundle.price.toLocaleString()}
                                                </span>
                                                <span className="text-xs font-bold text-emerald-500 uppercase">ETB</span>
                                            </div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Total Value</p>
                                        </div>

                                        <div className="flex items-center justify-end gap-2 w-full">
                                            <button
                                                onClick={(e) => handleToggleStatus(e, bundle.id)}
                                                className={`p-2 rounded-lg transition-all ${bundle.is_active
                                                    ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white'
                                                    : 'bg-slate-500/10 text-slate-500 hover:bg-slate-500 hover:text-white'
                                                    }`}
                                                title={bundle.is_active ? 'Deactivate' : 'Activate'}
                                            >
                                                <Power size={16} />
                                            </button>
                                            <button
                                                onClick={(e) => handleDelete(e, bundle.id)}
                                                className="p-2 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            <button className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-emerald-500 hover:bg-emerald-500/10 transition-all">
                                                <ChevronRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Hover Indicator */}
                                <div className={`absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 transform transition-transform duration-200 ${hoveredId === bundle.id ? 'scale-y-100' : 'scale-y-0'
                                    }`} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {selectedBundle && (
                <BundleDetailModal
                    bundle={selectedBundle}
                    onClose={() => setSelectedBundle(null)}
                    isDarkMode={isDarkMode}
                    getImageUrl={getImageUrl}
                />
            )}
        </div>
    );
};

const BundleDetailModal: React.FC<{ bundle: Bundle, onClose: () => void, isDarkMode: boolean, getImageUrl: (url?: string) => string }> = ({ bundle, onClose, isDarkMode, getImageUrl }) => {
    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-500">
            <div className={`max-w-4xl w-full rounded-2xl overflow-hidden shadow-2xl shadow-emerald-500/20 transition-all border animate-in zoom-in-95 duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="relative h-64 overflow-hidden">
                    <img
                        src={getImageUrl(bundle.image_url)}
                        className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                        alt={bundle.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>

                    {bundle.discount > 0 && (
                        <div className="absolute top-6 left-6">
                            <div className="bg-gradient-to-r from-rose-600 to-pink-600 text-white p-3 rounded-xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-left duration-700">
                                <Tag size={18} />
                                <div>
                                    <span className="text-lg font-bold">{bundle.discount}%</span>
                                    <span className="text-xs font-bold block uppercase tracking-tighter">Discount</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 rounded-full bg-black/40 text-white hover:bg-rose-600 backdrop-blur-md transition-all duration-300"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 -mt-16 relative">
                    <div className="flex flex-col lg:flex-row items-end justify-between gap-6 mb-8">
                        <div>
                            <h2 className={`text-3xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{bundle.name}</h2>
                            <div className="flex items-center gap-3 mt-4">
                                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${bundle.is_active ? 'bg-emerald-500/20 text-emerald-500' : 'bg-slate-500/20 text-slate-500'}`}>
                                    {bundle.is_active ? 'Active' : 'Inactive'}
                                </div>
                                <div className="px-3 py-1 bg-emerald-500/20 text-emerald-500 rounded-full text-xs font-bold uppercase tracking-wider">
                                    Bundle
                                </div>
                            </div>
                        </div>
                        <div className={`p-4 rounded-xl text-right border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Price</p>
                            <div className="flex items-baseline justify-end gap-1">
                                <span className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{bundle.price.toLocaleString()}</span>
                                <span className="text-sm font-bold text-emerald-500 uppercase">ETB</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Description</h3>
                            <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                {bundle.description || "No description available for this bundle."}
                            </p>

                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 mt-6">Bundle Items ({bundle.items?.length || 0})</h3>
                            <div className={`rounded-xl border overflow-hidden ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                                <div className="divide-y divide-slate-700">
                                    {(bundle.items && bundle.items.length > 0) ? bundle.items.map((item, i) => (
                                        <div key={i} className="p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${isDarkMode ? 'bg-slate-700 text-emerald-500' : 'bg-slate-100 text-emerald-600'}`}>
                                                    {item.quantity}x
                                                </div>
                                                <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.product_name}</span>
                                            </div>
                                            <span className="text-sm font-bold text-slate-500">{item.price} ETB</span>
                                        </div>
                                    )) : (
                                        <div className="p-8 text-center">
                                            <Package className="mx-auto text-slate-500 mb-3" size={32} />
                                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">No items in this bundle</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Bundle Stats</h3>
                            <div className="space-y-3">
                                <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-500">
                                            <Activity size={16} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-500">Status</p>
                                            <p className={`text-sm font-bold ${bundle.is_active ? 'text-emerald-500' : 'text-slate-500'}`}>
                                                {bundle.is_active ? 'Active' : 'Inactive'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {bundle.discount > 0 && (
                                    <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-rose-500/20 rounded-lg text-rose-500">
                                                <Tag size={16} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-500">Discount</p>
                                                <p className="text-sm font-bold text-rose-500">{bundle.discount}%</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-amber-500/20 rounded-lg text-amber-500">
                                            <Star size={16} fill="currentColor" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-500">Rating</p>
                                            <div className="flex items-center gap-1">
                                                <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>4.8</p>
                                                <span className="text-[10px] text-slate-500 font-bold">(32 reviews)</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-500">
                                            <Zap size={16} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-500">Performance</p>
                                            <p className="text-sm font-bold text-emerald-500">Optimized</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SpecialPackages;