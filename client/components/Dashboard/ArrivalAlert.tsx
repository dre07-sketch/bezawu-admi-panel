import React from 'react';
import { Order } from '../../types';
import { Car, X, MapPin, ScanLine, ArrowRight, Check } from 'lucide-react';

interface ArrivalAlertProps {
  order: Order;
  onClose: () => void;
  onComplete: () => void;
  isDarkMode: boolean;
}

const ArrivalAlert: React.FC<ArrivalAlertProps> = ({ order, onClose, onComplete, isDarkMode }) => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className={`max-w-[480px] w-full rounded-[3rem] shadow-2xl transition-all border overflow-hidden relative group ${isDarkMode ? 'bg-[#0F1115] border-slate-800 shadow-emerald-900/20' : 'bg-white border-slate-100 shadow-xl'
        }`}>
        {/* Ambient Background Glow */}
        <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />

        <div className="p-8 pt-10 flex flex-col items-center relative z-10">
          <button
            onClick={onClose}
            className={`absolute top-6 right-6 p-2 rounded-full transition-all ${isDarkMode
              ? 'text-slate-500 hover:text-white hover:bg-white/5'
              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
          >
            <X size={24} />
          </button>

          {/* Animated Icon */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full opacity-50 animate-pulse"></div>
            <div className={`w-24 h-24 rounded-3xl rotate-3 border flex items-center justify-center shadow-lg relative z-10 transition-transform hover:rotate-6 duration-500 ${isDarkMode ? 'bg-[#1A1D24] border-slate-800' : 'bg-white border-slate-50 shadow-emerald-100'
              }`}>
              <Car className="text-emerald-500 w-10 h-10" strokeWidth={1.5} />
            </div>
            {/* Status Indicator */}
            <div className="absolute -top-1 -right-1 flex h-6 w-6 z-20">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className={`relative inline-flex rounded-full h-6 w-6 bg-emerald-500 border-4 ${isDarkMode ? 'border-[#0F1115]' : 'border-white'
                }`}></span>
            </div>
          </div>

          <h2 className={`text-3xl font-bold tracking-tight text-center mb-2 ${isDarkMode ? 'text-white' : 'text-[#1e293b]'}`}>
            Customer Arrived
          </h2>
          <p className="text-slate-400 text-sm font-medium text-center max-w-[280px] leading-relaxed">
            Vehicle detected at the pickup zone. Please prepare for immediate handover.
          </p>
        </div>

        <div className="px-6 pb-6">
          <div className={`rounded-[2.5rem] p-1.5 ${isDarkMode ? 'bg-[#16181D]' : 'bg-slate-50'
            }`}>
            <div className={`rounded-[2rem] border px-6 py-8 relative overflow-hidden ${isDarkMode ? 'bg-[#0F1115] border-slate-800' : 'bg-white border-slate-200'
              }`}>
              {/* Pattern bg */}
              <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:16px_16px]"></div>

              <div className="space-y-8 relative">
                {/* Vehicle Info */}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Vehicle</p>
                    <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{order.car.model}</h3>
                    <p className="text-sm text-slate-500 mt-0.5">{order.car.color}</p>
                  </div>
                  <div className={`px-4 py-2 rounded-xl text-center border ${isDarkMode ? 'bg-[#1A1D24] border-slate-800' : 'bg-slate-100 border-slate-200'
                    }`}>
                    <p className="text-[10px] text-slate-500 font-bold mb-0.5 uppercase">Plate</p>
                    <span className={`font-mono text-lg font-bold tracking-wider ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                      }`}>{order.car.plate}</span>
                  </div>
                </div>

                {/* Divider */}
                <div className={`h-px w-full ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}></div>

                {/* Order Info */}
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
                    }`}>
                    <ScanLine size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Customer</p>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{order.customerName}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-500"></span>
                      <span className="text-sm text-slate-500">{order.items.length} items</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 w-full">
            <button
              onClick={onClose}
              className={`w-full py-4 rounded-2xl font-bold text-xs tracking-widest uppercase transition-all ${isDarkMode
                ? 'bg-[#16181D] text-slate-400 hover:bg-slate-800 hover:text-white'
                : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}
            >
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArrivalAlert;
