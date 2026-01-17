import React, { useState } from 'react';
import { X, Film, Link as LinkIcon, Type, FileVideo, Save, Loader2 } from 'lucide-react';

interface AddStoryModalProps {
    onClose: () => void;
    isDarkMode: boolean;
}

const AddStoryModal: React.FC<AddStoryModalProps> = ({ onClose, isDarkMode }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        link: '',
        video_url: ''
    });
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (!videoFile) {
                throw new Error('Please select a video file');
            }

            const token = localStorage.getItem('token');
            let uploadedVideoUrl = '';

            // Upload Video
            const uploadData = new FormData();
            uploadData.append('image', videoFile); // using 'image' field as that's what backend expects currently, although we modified it to accept videos. Ideally rename param but 'image' works if Multer field is 'image'.

            const uploadResponse = await fetch('https://branchapi.ristestate.com/api/upload/image', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: uploadData
            });

            if (uploadResponse.ok) {
                const data = await uploadResponse.json();
                uploadedVideoUrl = data.imageUrl; // contains relative path like /uploads/...
            } else {
                throw new Error('Video upload failed');
            }

            // Create Story
            const response = await fetch('https://branchapi.ristestate.com/api/stories/stories-post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    video_url: uploadedVideoUrl
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create story');
            }

            onClose();
            // Optionally trigger refresh logic via context or prop, but simple reload or parent refresh works
            window.location.reload();
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
            <div className={`max-w-2xl w-full rounded-3xl overflow-hidden shadow-2xl transition-all border animate-in zoom-in-95 duration-200 ${isDarkMode ? 'bg-[#121418] border-slate-800' : 'bg-white border-slate-100'}`}>
                <div className="px-8 pt-8 pb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl border ${isDarkMode ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-100'}`}>
                            <Film className="text-emerald-500" size={24} />
                        </div>
                        <div>
                            <h2 className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>New Story</h2>
                            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-0.5">Mobile App Content</p>
                        </div>
                    </div>
                    <button onClick={onClose} className={`p-2 transition-colors ${isDarkMode ? 'text-slate-600 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 px-1">Title</label>
                            <div className="relative">
                                <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input
                                    required
                                    type="text"
                                    placeholder="Story Headline..."
                                    className={`w-full pl-12 pr-4 py-4 rounded-xl border transition-all font-bold text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 ${isDarkMode ? 'bg-[#0f1115] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 px-1">Video File</label>
                            <div className="relative">
                                <input
                                    required
                                    type="file"
                                    accept="video/*"
                                    className="hidden"
                                    id="video-upload"
                                    onChange={e => setVideoFile(e.target.files?.[0] || null)}
                                />
                                <label
                                    htmlFor="video-upload"
                                    className={`w-full flex items-center justify-between px-6 py-4 rounded-xl border border-dashed transition-all cursor-pointer ${isDarkMode ? 'bg-[#0f1115] border-slate-800 hover:border-emerald-500' : 'bg-slate-50 border-slate-200 hover:border-emerald-500'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <FileVideo className={videoFile ? 'text-emerald-500' : 'text-slate-400'} size={20} />
                                        <span className={`text-sm font-medium ${videoFile ? (isDarkMode ? 'text-white' : 'text-slate-900') : 'text-slate-500'}`}>
                                            {videoFile ? videoFile.name : 'Select video file... (MP4, MOV)'}
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-bold uppercase text-slate-500 bg-slate-500/10 px-2 py-1 rounded">Browse</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 px-1">Deep Link (Optional)</label>
                            <div className="relative">
                                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input
                                    type="text"
                                    placeholder="https://..."
                                    className={`w-full pl-12 pr-4 py-4 rounded-xl border transition-all font-bold text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 ${isDarkMode ? 'bg-[#0f1115] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                    value={formData.link}
                                    onChange={e => setFormData({ ...formData, link: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 px-1">Description</label>
                            <textarea
                                rows={3}
                                placeholder="What's happening in this story?"
                                className={`w-full px-6 py-4 rounded-xl border transition-all font-medium text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 ${isDarkMode ? 'bg-[#0f1115] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm font-bold">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-4 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className={`flex-1 py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                            {loading ? 'Uploading...' : 'Publish Story'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStoryModal;
