
import React, { useState } from 'react';
import { X, Plus, Gift, Tag, DollarSign, Image as ImageIcon, TextQuote, Save, Trash2, ListPlus } from 'lucide-react';

interface BundleItemInput {
  product_name: string;
  quantity: string;
}

interface AddBundleModalProps {
  onClose: () => void;
  isDarkMode: boolean;
}

const AddBundleModal: React.FC<AddBundleModalProps> = ({ onClose, isDarkMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
  });

  const [items, setItems] = useState<BundleItemInput[]>([]);
  const [newItem, setNewItem] = useState<BundleItemInput>({ product_name: '', quantity: '1' });

  const handleAddItem = () => {
    if (newItem.product_name && newItem.quantity) {
      setItems([...items, newItem]);
      setNewItem({ product_name: '', quantity: '1' });
    }
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Deploying Bundle:', { ...formData, items });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className={`max-w-4xl w-full rounded-[3rem] overflow-hidden shadow-[0_60px_100px_-30px_rgba(0,0,0,0.5)] transition-all border animate-in zoom-in-95 duration-200 ${
        isDarkMode ? 'bg-[#121418] border-slate-800' : 'bg-white border-slate-100'
      }`}>
        <div className="px-12 pt-12 pb-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className={`p-4 rounded-2xl border transition-colors ${isDarkMode ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-100'}`}>
              <Gift className="text-emerald-500" size={36} />
            </div>
            <div>
              <h2 className={`text-3xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Initiate Package</h2>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.3em] mt-1">Bundle Manifest Definition Protocol</p>
            </div>
          </div>
          <button onClick={onClose} className={`p-3 transition-colors ${isDarkMode ? 'text-slate-600 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}>
            <X size={32} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-12 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Left: Basic Info */}
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 px-1">
                  <Tag size={12} className="text-emerald-500" /> Manifest Label
                </label>
                <input 
                  required
                  type="text"
                  placeholder="e.g. Tactical Family Provisioning"
                  className={`w-full px-8 py-5 rounded-2xl border transition-all focus:outline-none focus:ring-4 focus:ring-emerald-500/10 font-bold ${
                    isDarkMode ? 'bg-[#0f1115] border-slate-800 text-white placeholder:text-slate-700' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 px-1">
                  <TextQuote size={12} className="text-emerald-500" /> Tactical Briefing
                </label>
                <textarea 
                  required
                  rows={3}
                  placeholder="Detailed description for the customer catalog..."
                  className={`w-full px-8 py-5 rounded-2xl border transition-all focus:outline-none focus:ring-4 focus:ring-emerald-500/10 font-medium leading-relaxed ${
                    isDarkMode ? 'bg-[#0f1115] border-slate-800 text-white placeholder:text-slate-700' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 px-1">
                    <DollarSign size={12} className="text-emerald-500" /> Target Price (ETB)
                  </label>
                  <input 
                    required
                    type="number"
                    placeholder="0.00"
                    className={`w-full px-8 py-5 rounded-2xl border transition-all focus:outline-none focus:ring-4 focus:ring-emerald-500/10 font-black ${
                      isDarkMode ? 'bg-[#0f1115] border-slate-800 text-white placeholder:text-slate-700' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 px-1">
                    <ImageIcon size={12} className="text-emerald-500" /> Visual Link (URL)
                  </label>
                  <input 
                    type="url"
                    placeholder="https://..."
                    className={`w-full px-8 py-5 rounded-2xl border transition-all focus:outline-none focus:ring-4 focus:ring-emerald-500/10 font-medium ${
                      isDarkMode ? 'bg-[#0f1115] border-slate-800 text-white placeholder:text-slate-700' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                    value={formData.image_url}
                    onChange={e => setFormData({...formData, image_url: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Right: Item Manifest Addition */}
            <div className="space-y-8 flex flex-col">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 px-1">
                  <ListPlus size={12} className="text-emerald-500" /> Manifest Inventory
                </label>
                
                <div className="flex gap-4">
                  <input 
                    type="text"
                    placeholder="Search product..."
                    className={`flex-1 px-6 py-4 rounded-xl border transition-all focus:outline-none font-bold text-sm ${
                      isDarkMode ? 'bg-[#0f1115] border-slate-800 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                    value={newItem.product_name}
                    onChange={e => setNewItem({...newItem, product_name: e.target.value})}
                  />
                  <input 
                    type="number"
                    placeholder="Qty"
                    className={`w-24 px-4 py-4 rounded-xl border transition-all focus:outline-none font-black text-center text-sm ${
                      isDarkMode ? 'bg-[#0f1115] border-slate-800 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                    value={newItem.quantity}
                    onChange={e => setNewItem({...newItem, quantity: e.target.value})}
                  />
                  <button 
                    type="button"
                    onClick={handleAddItem}
                    className="p-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-all shadow-lg shadow-emerald-500/20 active:scale-90"
                  >
                    <Plus size={24} />
                  </button>
                </div>
              </div>

              <div className={`flex-1 rounded-[2rem] border overflow-y-auto max-h-[300px] custom-scrollbar ${
                isDarkMode ? 'bg-[#0f1115] border-slate-800/50' : 'bg-slate-50 border-slate-200'
              }`}>
                {items.length === 0 ? (
                  <div className="h-full flex flex-shrink-0 items-center justify-center flex-col text-slate-600 italic p-10">
                    <ListPlus size={40} className="opacity-10 mb-4" />
                    <p className="text-xs font-bold uppercase tracking-widest">No assets in manifest</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-800/20">
                    {items.map((item, index) => (
                      <div key={index} className="p-5 flex items-center justify-between group hover:bg-emerald-500/5 transition-colors">
                        <div className="flex items-center gap-4">
                          <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-black text-xs">{item.quantity}</span>
                          <span className={`text-sm font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>{item.product_name}</span>
                        </div>
                        <button 
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="p-2 text-slate-600 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-12 flex gap-6">
            <button 
              type="button" 
              onClick={onClose}
              className={`flex-1 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 ${
                isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              Abort Entry
            </button>
            <button 
              type="submit"
              className="flex-[2] bg-emerald-600 hover:bg-emerald-700 text-white font-black py-5 rounded-2xl text-xs transition-all shadow-[0_20px_40px_-10px_rgba(5,150,105,0.4)] active:scale-[0.98] uppercase tracking-[0.4em] flex items-center justify-center gap-3"
            >
              <Save size={20} />
              Commit Bundle Manifest
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBundleModal;
