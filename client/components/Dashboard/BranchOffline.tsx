
import React from 'react';
import { ShieldAlert, RefreshCw, MapPin, Database, Cpu } from 'lucide-react';

interface BranchOfflineProps {
    branchName: string;
    onRestore: () => void;
}

const BranchOffline: React.FC<BranchOfflineProps> = ({ branchName, onRestore }) => {
    return (
        <div className="absolute inset-0 flex items-center justify-center p-8 bg-[#0a0a0c] overflow-hidden">
            {/* Background Digital Matrix Effect */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden font-mono text-[8px] leading-none text-red-500 break-all select-none">
                {Array.from({ length: 100 }).map((_, i) => (
                    <div key={i} className="whitespace-nowrap animate-pulse" style={{ animationDelay: `${Math.random() * 2}s` }}>
                        {Array.from({ length: 200 }).map(() => (Math.random() > 0.5 ? '1' : '0')).join('')}
                    </div>
                ))}
            </div>

            {/* Glowing Orbs */}
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-red-900/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>

            <div className="max-w-xl w-full relative z-10 text-center space-y-10">
                {/* Status Indicator */}
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 shadow-lg shadow-red-500/5">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Operational Vacuum Detected</span>
                </div>

                {/* Main Visual */}
                <div className="relative inline-block">
                    <div className="p-10 rounded-[3rem] bg-gradient-to-b from-red-500/5 to-transparent border border-red-500/20 shadow-2xl relative z-10">
                        <ShieldAlert size={80} className="text-red-500 animate-[pulse_3s_infinite]" strokeWidth={1} />
                    </div>
                    <div className="absolute -inset-4 border border-red-500/10 rounded-[3.5rem] animate-[spin_20s_linear_infinite]"></div>
                </div>

                {/* Identity Header */}
                <div className="space-y-3">
                    <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
                        {branchName} <br />
                        <span className="text-red-500 not-italic">DE-COUPLED</span>
                    </h1>
                    <p className="text-slate-500 text-[11px] font-bold uppercase tracking-[0.4em]">Node Protocol: SHUTDOWN_SEQUENCE_BZW_BRA</p>
                </div>

                {/* Telemetry Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] flex flex-col items-center gap-3 backdrop-blur-md">
                        <MapPin size={24} className="text-red-500/40" />
                        <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Grid Proximity</p>
                            <p className="text-xs font-bold text-white uppercase tracking-tighter">Local Island Mode</p>
                        </div>
                    </div>
                    <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] flex flex-col items-center gap-3 backdrop-blur-md">
                        <Database size={24} className="text-red-500/40" />
                        <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Data State</p>
                            <p className="text-xs font-bold text-white uppercase tracking-tighter">Write Locked</p>
                        </div>
                    </div>
                </div>

                {/* Restore Control */}
                <div className="pt-6">
                    <button
                        onClick={onRestore}
                        className="group relative px-12 py-5 rounded-2xl bg-red-600 hover:bg-red-500 transition-all active:scale-95 shadow-2xl shadow-red-600/20 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                        <div className="flex items-center gap-4 text-white">
                            <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-700" />
                            <span className="font-black text-xs uppercase tracking-[0.3em]">Re-Initiate Node Handshake</span>
                        </div>
                    </button>
                    <p className="mt-6 text-[9px] text-slate-600 font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                        <Cpu size={12} /> Hardware ID: 0x88-AD-C2-44-BF
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
};

export default BranchOffline;
