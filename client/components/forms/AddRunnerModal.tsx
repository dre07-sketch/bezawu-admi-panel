import React, { useState } from 'react';
import { X, User, Phone, Mail, Image as ImageIcon, Save, Loader2, UserCheck } from 'lucide-react';

interface AddRunnerModalProps {
    onClose: () => void;
    onSuccess: () => void;
    isDarkMode: boolean;
}

const AddRunnerModal: React.FC<AddRunnerModalProps> = ({ onClose, onSuccess, isDarkMode }) => {
    const generateId = () => {
        const random = Math.floor(100000 + Math.random() * 900000); // 6 random numbers
        return `BZWR-${random}`;
    };

    const [formData, setFormData] = useState({
        id: generateId(),
        full_name: '',
        phone: '',
        email: '',
        pro_image: '',
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            let imageUrl = formData.pro_image;

            // Upload image if file is selected
            if (imageFile) {
                const uploadData = new FormData();
                uploadData.append('image', imageFile);

                const uploadResponse = await fetch('http://localhost:5000/api/upload/image', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: uploadData
                });

                if (uploadResponse.ok) {
                    const uploadResult = await uploadResponse.json();
                    imageUrl = uploadResult.imageUrl;
                } else {
                    throw new Error('Image upload failed');
                }
            }

            const runnerData = {
                ...formData,
                pro_image: imageUrl
            };

            const response = await fetch('http://localhost:5000/api/runners/runners-post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(runnerData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create runner');
            }

            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
            <div className={`max-w-xl w-full rounded-[3rem] overflow-hidden shadow-2xl transition-all border animate-in zoom-in-95 duration-200 ${isDarkMode ? 'bg-[#121418] border-slate-800' : 'bg-white border-slate-100'
                }`}>
                <div className="px-10 pt-10 pb-6 flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <div className={`p-4 rounded-2xl border transition-colors ${isDarkMode ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-indigo-50 border-indigo-100'}`}>
                            <UserCheck className="text-indigo-500" size={32} />
                        </div>
                        <div>
                            <h2 className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Register Runner</h2>
                            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Operational Personnel Enrollment</p>
                        </div>
                    </div>
                    <button onClick={onClose} className={`p-2 transition-colors ${isDarkMode ? 'text-slate-600 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}>
                        <X size={28} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-10 pb-10 space-y-6">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 px-1">
                                    <User size={12} className="text-indigo-500" /> Full Name
                                </label>
                                <input
                                    required
                                    type="text"
                                    className={`w-full px-6 py-4 rounded-2xl border transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold ${isDarkMode ? 'bg-[#0f1115] border-slate-800 text-white placeholder:text-slate-700' : 'bg-slate-50 border-slate-200 text-slate-900'
                                        }`}
                                    value={formData.full_name}
                                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                    placeholder="e.g. Abebe Balcha"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 px-1">
                                    <Save size={12} className="text-indigo-500" /> Personnel ID
                                </label>
                                <input
                                    readOnly
                                    type="text"
                                    className={`w-full px-6 py-4 rounded-2xl border transition-all bg-opacity-50 cursor-not-allowed font-mono font-bold ${isDarkMode ? 'bg-[#0f1115] border-slate-800 text-indigo-400' : 'bg-slate-50 border-slate-200 text-indigo-600'
                                        }`}
                                    value={formData.id}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 px-1">
                                    <Phone size={12} className="text-indigo-500" /> Phone Number
                                </label>
                                <input
                                    required
                                    type="text"
                                    className={`w-full px-6 py-4 rounded-2xl border transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold ${isDarkMode ? 'bg-[#0f1115] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                                        }`}
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+251 ..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 px-1">
                                    <Mail size={12} className="text-indigo-500" /> Email (Optional)
                                </label>
                                <input
                                    type="email"
                                    className={`w-full px-6 py-4 rounded-2xl border transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold ${isDarkMode ? 'bg-[#0f1115] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                                        }`}
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="runner@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 px-1">
                                <ImageIcon size={12} className="text-indigo-500" /> Profile Image
                            </label>
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    id="runner-image"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setImageFile(file);
                                            setFormData({ ...formData, pro_image: URL.createObjectURL(file) });
                                        }
                                    }}
                                />
                                <label
                                    htmlFor="runner-image"
                                    className={`w-full px-6 py-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 hover:border-indigo-500 ${isDarkMode ? 'bg-[#0f1115] border-slate-800 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-600'
                                        }`}
                                >
                                    <ImageIcon size={18} className="text-indigo-500" />
                                    <span className="text-sm font-medium truncate">
                                        {imageFile ? imageFile.name : 'Select official identification photo...'}
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4">
                            <p className="text-rose-500 text-xs font-bold uppercase tracking-widest">{error}</p>
                        </div>
                    )}

                    <div className="pt-4 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                }`}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : (
                                <>
                                    <Save size={18} />
                                    Confirm Registration
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddRunnerModal;
