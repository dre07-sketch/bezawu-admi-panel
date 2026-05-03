
import React, { useState, useEffect } from 'react';
import { Landmark, Save, AlertCircle, CheckCircle2, Loader2, User, Building, Hash, ChevronDown, Eye, EyeOff, Plus, ArrowRight } from 'lucide-react';
import { BASE_API_URL } from '../../constants';

interface BankOption {
    name: string;
    code: string;
    acct_length?: number;
}

interface AddBankAccountProps {
    isDarkMode: boolean;
    user: any;
}

const AddBankAccount: React.FC<AddBankAccountProps> = ({ isDarkMode, user }) => {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [accounts, setAccounts] = useState<any[]>([]);
    const [showNumbers, setShowNumbers] = useState<Record<string, boolean>>({});
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [bankOptions, setBankOptions] = useState<BankOption[]>([]);
    const [chapaSubaccounts, setChapaSubaccounts] = useState<any[]>([]);
    const [isFetchingChapa, setIsFetchingChapa] = useState(false);
    const [isVerifyingSubaccount, setIsVerifyingSubaccount] = useState(false);

    const [formData, setFormData] = useState({
        account_name: '',
        account_number: '',
        bank_name: '',
        bank_code: '',
        chapa_subaccount_id: ''
    });
    const [subaccountSearch, setSubaccountSearch] = useState('');

    const fetchBankAccounts = async () => {
        setFetching(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASE_API_URL}/api/bank`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data)) {
                    setAccounts(data);
                    if (data.length === 0) {
                        setIsAddingNew(true);
                    }
                }
            }
        } catch (err) {
            console.error('Failed to fetch bank accounts:', err);
        } finally {
            setFetching(false);
        }
    };

    const fetchBankOptions = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASE_API_URL}/api/bank/list`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setBankOptions(await response.json());
            }
        } catch (err) {
            console.error('Failed to fetch bank options:', err);
        }
    };

    const fetchChapaSubaccounts = async () => {
        setIsFetchingChapa(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASE_API_URL}/api/bank/chapa-list`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setChapaSubaccounts(await response.json());
            }
        } catch (err) {
            console.error('Failed to fetch Chapa subaccounts:', err);
        } finally {
            setIsFetchingChapa(false);
        }
    };

    const verifySubaccount = async (id: string) => {
        if (!id) return;
        setIsVerifyingSubaccount(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASE_API_URL}/api/bank/chapa/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const sub = await response.json();
                handleSelectSubaccount(sub);
            } else {
                const data = await response.json();
                setError(data.message || 'Subaccount not found on Chapa');
            }
        } catch (err) {
            setError('Connection error while verifying subaccount');
        } finally {
            setIsVerifyingSubaccount(false);
        }
    };

    useEffect(() => {
        fetchBankAccounts();
        fetchBankOptions();
    }, []);

    const toggleShowNumber = (id: string) => {
        setShowNumbers(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleSelectSubaccount = (sub: any) => {
        const bankCode = sub.bank_code || sub.bank_id;
        const matchedBank = bankOptions.find(b => b.code === String(bankCode));
        
        setFormData({
            ...formData,
            chapa_subaccount_id: sub.subaccount_id,
            account_name: sub.account_name,
            account_number: sub.account_number,
            bank_code: String(bankCode),
            bank_name: matchedBank ? matchedBank.name : (sub.business_name || '')
        });
    };

    const filteredSubaccounts = chapaSubaccounts.filter(sub => 
        sub.business_name?.toLowerCase().includes(subaccountSearch.toLowerCase()) ||
        sub.account_name?.toLowerCase().includes(subaccountSearch.toLowerCase()) ||
        sub.account_number?.includes(subaccountSearch) ||
        sub.subaccount_id?.toLowerCase().includes(subaccountSearch.toLowerCase())
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASE_API_URL}/api/bank`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to save bank account');
            }

            await fetchBankAccounts();
            setSuccess(true);
            setIsAddingNew(false);
            setFormData({ account_name: '', account_number: '', bank_name: '', bank_code: '', chapa_subaccount_id: '' });
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (fetching && accounts.length === 0) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-black tracking-tight flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 rounded-xl">
                            <Landmark className="text-emerald-500" size={24} />
                        </div>
                        Financial Hub
                    </h1>
                    <p className="text-slate-400 text-sm font-medium">Manage settlement accounts and payout preferences via Chapa.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchBankAccounts}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all
                            ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                    >
                        <Loader2 size={14} className={fetching ? 'animate-spin text-emerald-500' : ''} />
                        Refresh
                    </button>
                    {!isAddingNew && (
                        <button
                            onClick={() => setIsAddingNew(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-600/20"
                        >
                            <Plus size={14} />
                            Link New
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Accounts List */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="flex items-center gap-2 ml-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Active Channels ({accounts.length})</h3>
                    </div>

                    <div className="space-y-4">
                        {accounts.map((account) => (
                            <div key={account.id} className={`relative overflow-hidden p-6 rounded-[2rem] border transition-all duration-500 group
                                ${isDarkMode ? 'bg-[#1a1d23] border-slate-800' : 'bg-white border-slate-100 shadow-lg shadow-slate-200/50'}`}>

                                <div className="relative z-10 space-y-6">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Bank Name</p>
                                            <h4 className={`text-base font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{account.bank_name}</h4>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => toggleShowNumber(account.id)}
                                                className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-50 text-slate-400 hover:text-slate-600'}`}
                                            >
                                                {showNumbers[account.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                            {account.chapa_subaccount_id && (
                                                <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 rounded-lg">
                                                    <CheckCircle2 className="text-emerald-500" size={12} />
                                                    <span className="text-[8px] font-black text-emerald-500 uppercase tracking-tighter">Live</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Account Holder</p>
                                        <p className={`text-sm font-bold tracking-tight uppercase ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{account.account_name}</p>
                                    </div>

                                    <div className="pt-4 border-t border-slate-800/10 dark:border-slate-800/50">
                                        <div className="flex justify-between items-end">
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Account Number</p>
                                                <p className={`text-lg font-mono font-black tracking-[0.1em] ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                                    {showNumbers[account.id]
                                                        ? account.account_number
                                                        : `•••• •••• ${account.account_number.slice(-4)}`}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {accounts.length === 0 && !fetching && (
                            <div className={`p-10 rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center text-center gap-4
                                ${isDarkMode ? 'bg-[#1a1d23]/50 border-slate-800 text-slate-600' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                                <div className="p-4 bg-slate-500/5 rounded-full">
                                    <Landmark size={32} />
                                </div>
                                <p className="text-sm font-bold">No settlement accounts found</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Form Section */}
                <div className="lg:col-span-7">
                    {isAddingNew ? (
                        <div className={`rounded-[2.5rem] border ${isDarkMode ? 'bg-[#1a1d23] border-slate-800' : 'bg-white border-slate-100'} shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500`}>
                            <div className="p-8 md:p-10">
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 ml-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Chapa Subaccount Sync</h3>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => accounts.length > 0 && setIsAddingNew(false)}
                                            className="text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors"
                                        >
                                            Close
                                        </button>
                                    </div>

                                    {error && (
                                        <div className="flex items-center gap-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 p-4 rounded-2xl text-sm font-bold animate-in shake duration-500">
                                            <AlertCircle size={18} />
                                            {error}
                                        </div>
                                    )}

                                    <div className="space-y-6">
                                        <div className="flex flex-col gap-6">
                                            <div className="flex flex-col gap-4">
                                                <div className="flex items-center justify-between">
                                                    <label className={`text-xs font-black uppercase tracking-wider ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                                        Browse Subaccounts
                                                    </label>
                                                    <button 
                                                        type="button"
                                                        onClick={fetchChapaSubaccounts}
                                                        disabled={isFetchingChapa}
                                                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl text-[10px] font-black transition-all shadow-lg shadow-emerald-500/20"
                                                    >
                                                        {isFetchingChapa ? <Loader2 size={12} className="animate-spin" /> : <Landmark size={12} />}
                                                        SYNC FROM CHAPA
                                                    </button>
                                                </div>

                                                {chapaSubaccounts.length > 0 && (
                                                    <div className="relative">
                                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                                            <Hash size={14} />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            placeholder="Search subaccounts..."
                                                            value={subaccountSearch}
                                                            onChange={(e) => setSubaccountSearch(e.target.value)}
                                                            className={`w-full pl-10 pr-4 py-3 rounded-xl text-xs font-bold outline-none border transition-all ${
                                                                isDarkMode ? 'bg-[#14171c] border-slate-800 text-white focus:border-emerald-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500'
                                                            }`}
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            {chapaSubaccounts.length > 0 ? (
                                                <div className={`grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto p-1 pr-3 scrollbar-thin ${isDarkMode ? 'scrollbar-thumb-slate-800' : 'scrollbar-thumb-slate-200'}`}>
                                                    {filteredSubaccounts.map(sub => (
                                                        <div 
                                                            key={sub.id} 
                                                            onClick={() => handleSelectSubaccount(sub)}
                                                            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer group relative
                                                                ${formData.chapa_subaccount_id === sub.subaccount_id 
                                                                    ? 'border-emerald-500 bg-emerald-500/5' 
                                                                    : isDarkMode ? 'border-slate-800 bg-[#14171c] hover:border-slate-700' : 'border-slate-100 bg-slate-50 hover:border-slate-200'}`}
                                                        >
                                                            <div className="flex items-start justify-between">
                                                                <div className="space-y-1">
                                                                    <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{sub.business_name}</div>
                                                                    <div className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{sub.account_name}</div>
                                                                    <div className="text-[9px] font-mono font-bold text-slate-500">{sub.account_number}</div>
                                                                </div>
                                                                {formData.chapa_subaccount_id === sub.subaccount_id && <CheckCircle2 size={16} className="text-emerald-500" />}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className={`p-10 rounded-3xl border-2 border-dashed text-center ${isDarkMode ? 'border-slate-800 bg-[#14171c]' : 'border-slate-100 bg-slate-50'}`}>
                                                    <p className="text-xs font-bold text-slate-500">Fetch from Chapa or enter ID manually below.</p>
                                                </div>
                                            )}

                                            <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                                                <div className="flex flex-col gap-2">
                                                    <label className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Direct Subaccount Link</label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={formData.chapa_subaccount_id}
                                                            onChange={(e) => setFormData({ ...formData, chapa_subaccount_id: e.target.value })}
                                                            placeholder="Enter Subaccount ID (e.g. SUB_xxxx)"
                                                            className={`flex-1 px-4 py-4 rounded-xl text-xs font-bold outline-none border ${isDarkMode ? 'bg-[#14171c] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => verifySubaccount(formData.chapa_subaccount_id)}
                                                            disabled={isVerifyingSubaccount || !formData.chapa_subaccount_id}
                                                            className="px-6 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-xl text-[10px] font-black uppercase transition-all"
                                                        >
                                                            {isVerifyingSubaccount ? <Loader2 size={14} className="animate-spin" /> : 'Verify'}
                                                        </button>
                                                    </div>
                                                </div>

                                                {formData.account_name && (
                                                    <div className={`p-6 rounded-2xl border animate-in zoom-in-95 ${isDarkMode ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-emerald-50 border-emerald-100'}`}>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="space-y-1">
                                                                <div className="text-[8px] font-black text-slate-500 uppercase">Holder</div>
                                                                <div className={`text-xs font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{formData.account_name}</div>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <div className="text-[8px] font-black text-slate-500 uppercase">Bank</div>
                                                                <div className={`text-xs font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{formData.bank_name}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-slate-800/10 dark:border-slate-800/50 flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={loading || !formData.chapa_subaccount_id || !formData.account_name}
                                            className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black px-8 py-4 rounded-2xl transition-all shadow-xl shadow-emerald-600/20 text-xs tracking-widest uppercase"
                                        >
                                            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Link Account'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <div className={`rounded-[2.5rem] border ${isDarkMode ? 'bg-[#1a1d23] border-slate-800' : 'bg-white border-slate-100'} p-12 text-center space-y-6 flex flex-col items-center justify-center min-h-[400px]`}>
                            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500">
                                <Plus size={32} />
                            </div>
                            <div className="space-y-2 max-w-sm">
                                <h3 className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Add Payout Source</h3>
                                <p className="text-sm text-slate-400 font-medium">Link your Chapa subaccount to receive automated payouts directly to your bank.</p>
                            </div>
                            <button
                                onClick={() => setIsAddingNew(true)}
                                className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black px-8 py-4 rounded-2xl transition-all shadow-xl shadow-emerald-600/20 text-xs tracking-widest uppercase"
                            >
                                <Plus size={18} /> Connect Chapa
                            </button>
                        </div>
                    )}

                    {success && !isAddingNew && (
                        <div className="mt-6 flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-4 rounded-2xl text-sm font-bold animate-in slide-in-from-top-4">
                            <CheckCircle2 size={18} />
                            Success! Your payout channel is active.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddBankAccount;
