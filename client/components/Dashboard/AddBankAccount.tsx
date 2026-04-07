
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

    const [formData, setFormData] = useState({
        account_name: '',
        account_number: '',
        bank_name: '',
        bank_code: '',
        chapa_subaccount_id: ''
    });

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
                    // If we have accounts, but none are being edited, don't show the form immediately
                    if (data.length > 0 && !isAddingNew) {
                        setIsAddingNew(false);
                    } else if (data.length === 0) {
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

    useEffect(() => {
        fetchBankAccounts();
        fetchBankOptions();
    }, []);

    const toggleShowNumber = (id: string) => {
        setShowNumbers(prev => ({ ...prev, [id]: !prev[id] }));
    };

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
            setFormData({ account_name: '', account_number: '', bank_name: '', bank_code: '' });
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
                    <p className="text-slate-400 text-sm font-medium">Manage multiple settlement accounts and payout preferences.</p>
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
                            Add Account
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Accounts List */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="flex items-center gap-2 ml-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Linked Accounts ({accounts.length})</h3>
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
                                            {account.chapa_subaccount_id ? (
                                                <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 rounded-lg">
                                                    <CheckCircle2 className="text-emerald-500" size={12} />
                                                    <span className="text-[8px] font-black text-emerald-500 uppercase tracking-tighter">Verified</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-500/10 rounded-lg">
                                                    <Loader2 className="text-amber-500 animate-spin" size={12} />
                                                    <span className="text-[8px] font-black text-amber-500 uppercase tracking-tighter">Syncing...</span>
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
                                            {account.is_primary && (
                                                <div className={`px-2 py-1 rounded-full text-[8px] font-black tracking-widest uppercase
                                                    ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                                                    Default
                                                </div>
                                            )}
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
                                <p className="text-sm font-bold">No accounts linked</p>
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
                                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Account Configuration</h3>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => accounts.length > 0 && setIsAddingNew(false)}
                                            className="text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors"
                                        >
                                            Cancel
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
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <label className={`text-xs font-black uppercase tracking-wider ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                                        Select Chapa Subaccount
                                                    </label>
                                                    <button 
                                                        type="button"
                                                        onClick={fetchChapaSubaccounts}
                                                        disabled={isFetchingChapa}
                                                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl text-[10px] font-black transition-all shadow-lg shadow-emerald-500/20"
                                                    >
                                                        {isFetchingChapa ? <Loader2 size={12} className="animate-spin" /> : <Landmark size={12} />}
                                                        GET FROM CHAPA
                                                    </button>
                                                </div>

                                                {/* Fetched List (The primary way to add) */}
                                                {chapaSubaccounts.length > 0 ? (
                                                    <div className={`grid grid-cols-1 gap-3 max-h-[350px] overflow-y-auto p-1 scrollbar-thin ${isDarkMode ? 'scrollbar-thumb-slate-800' : 'scrollbar-thumb-slate-200'}`}>
                                                        {chapaSubaccounts.map(sub => (
                                                            <div 
                                                                key={sub.id} 
                                                                onClick={() => setFormData({ 
                                                                    ...formData, 
                                                                    chapa_subaccount_id: sub.subaccount_id,
                                                                    account_name: sub.account_name,
                                                                    account_number: sub.account_number,
                                                                    bank_name: sub.business_name
                                                                })}
                                                                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer group
                                                                    ${formData.chapa_subaccount_id === sub.subaccount_id 
                                                                        ? 'border-emerald-500 bg-emerald-500/5' 
                                                                        : isDarkMode ? 'border-slate-800 bg-[#14171c] hover:border-slate-700' : 'border-slate-100 bg-slate-50 hover:border-slate-200'}`}
                                                            >
                                                                <div className="flex items-start justify-between">
                                                                    <div>
                                                                        <div className="text-sm font-black text-emerald-500 mb-1">{sub.business_name}</div>
                                                                        <div className={`text-[10px] font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                                                            {sub.account_name}
                                                                        </div>
                                                                        <div className={`text-[10px] font-mono mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                                                            {sub.account_number}
                                                                        </div>
                                                                    </div>
                                                                    <div className={`px-2 py-1 rounded-lg text-[9px] font-black ${isDarkMode ? 'bg-slate-800 text-slate-500' : 'bg-white text-slate-400'}`}>
                                                                        {sub.subaccount_id}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className={`p-12 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center text-center
                                                        ${isDarkMode ? 'border-slate-800 bg-[#14171c]' : 'border-slate-100 bg-slate-50'}`}>
                                                        <Landmark size={32} className="text-slate-700 mb-3 opacity-20" />
                                                        <p className={`text-xs font-bold leading-relaxed max-w-[200px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                                            Click the button above to load your subaccounts from Chapa.
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Manual ID Input (Safety Net) */}
                                                <div className="space-y-3 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                                                    <label className={`text-xs font-black uppercase tracking-wider ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                                        Manual Subaccount ID
                                                    </label>
                                                    <div className="relative">
                                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500">
                                                            <CheckCircle2 size={18} />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            value={formData.chapa_subaccount_id}
                                                            onChange={(e) => setFormData({ ...formData, chapa_subaccount_id: e.target.value })}
                                                            placeholder="Paste SUB_xxxx ID manually"
                                                            className={`w-full pl-12 pr-4 py-4 rounded-2xl text-sm font-bold outline-none transition-all border-2 
                                                                ${isDarkMode
                                                                    ? 'bg-[#14171c] border-slate-800 focus:border-emerald-500/30 focus:bg-[#1a1d23] text-white'
                                                                    : 'bg-slate-50 border-slate-100 focus:border-emerald-500/20 focus:bg-white text-slate-900'}`}
                                                        />
                                                    </div>
                                                    <p className="text-[9px] font-bold text-slate-500 opacity-60">
                                                        Note: You must have created this subaccount in the Chapa Dashboard first.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-slate-800/10 dark:border-slate-800/50 flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={loading || !formData.chapa_subaccount_id}
                                            className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black px-8 py-4 rounded-2xl transition-all shadow-xl shadow-emerald-600/20 text-xs tracking-widest uppercase"
                                        >
                                            {loading ? <Loader2 size={18} className="animate-spin" /> : <><Plus size={18} /> Link Account</>}
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
                                <h3 className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Add New Bank Source</h3>
                                <p className="text-sm text-slate-400 font-medium leading-relaxed">Diversify your payout options by adding more bank accounts. You can manage and switch between them easily.</p>
                            </div>
                            <button
                                onClick={() => setIsAddingNew(true)}
                                className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black px-8 py-4 rounded-2xl transition-all shadow-xl shadow-emerald-600/20 text-xs tracking-widest uppercase"
                            >
                                <Plus size={18} /> Get Started
                            </button>
                        </div>
                    )}

                    {success && !isAddingNew && (
                        <div className="mt-6 flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-4 rounded-2xl text-sm font-bold animate-in slide-in-from-top-4">
                            <CheckCircle2 size={18} />
                            Success! Your new financial vault is ready.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddBankAccount;
