import React, { useState, useEffect } from 'react';
import { Mail, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import LogoImage from '../../assets/Bezaw logo (2).png';

interface ForgotPasswordProps {
  onBack: () => void;
  onSuccess: (email: string) => void;
  isDarkMode: boolean;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focused, setFocused] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('https://branchapi.bezawcurbside.com/api/forget/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to send OTP');
      onSuccess(email);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden relative flex"
      style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: '#030f09' }}>

      {/* ── Ambient background ── */}
      <div className="absolute inset-0 pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(6,78,59,0.4) 0%, transparent 80%)' }} />
      <div className="absolute inset-0 pointer-events-none z-0"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(52,211,153,0.06) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

      {/* ── Background banner2 clipped right ── */}
      <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[38%] z-0 overflow-hidden">
        <img src="/background banner.jpg" alt="" className="w-full h-full object-cover"
          style={{ opacity: 0.5, filter: 'brightness(0.65) saturate(1.1)', objectPosition: 'center' }} />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, rgba(3,15,9,1) 0%, rgba(3,15,9,0.4) 35%, transparent 100%)' }} />
      </div>

      {/* ── Faded logo left background ── */}
      <div className="hidden lg:flex items-center justify-center absolute left-0 top-0 bottom-0 w-[28%] z-0 pointer-events-none">
        <img src="/logo.png" alt="" className="w-64 object-contain select-none"
          style={{ opacity: 0.1, filter: 'brightness(2) saturate(0.2)', animation: 'floatSoft 8s ease-in-out infinite' }} />
        <div className="absolute w-80 h-80 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)' }} />
      </div>

      {/* ── Centered card ── */}
      <div className="relative z-20 h-full w-full flex items-center justify-center px-4">
        <div
          className="w-full overflow-hidden"
          style={{
            maxWidth: 480,
            borderRadius: 28,
            boxShadow: '0 50px 150px -30px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.07)',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.97)',
            transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* ── TOP banner section ── */}
          <div className="relative flex-shrink-0" style={{ height: 220 }}>
            <img src="/background banner2.jpg.png" alt="" className="w-full h-full object-cover"
              style={{ objectPosition: 'center 25%' }} />
            <div className="absolute inset-0"
              style={{ background: 'linear-gradient(to bottom, rgba(2,20,12,0.25) 0%, rgba(2,20,12,0.10) 35%, rgba(2,20,12,0.90) 100%)' }} />

            {/* Logo on banner */}
            <div className="absolute bottom-0 inset-x-0 px-8 pb-5 flex items-end gap-4">
              <div className="relative flex-shrink-0">
                <div className="absolute -inset-3 rounded-full blur-3xl" style={{ background: 'rgba(52,211,153,0.45)' }} />
                <div className="absolute -inset-1 rounded-[18px]"
                  style={{ background: 'rgba(52,211,153,0.18)', border: '1px solid rgba(52,211,153,0.28)' }} />
                <div className="relative w-16 h-16 rounded-[16px] flex items-center justify-center"
                  style={{
                    background: 'rgba(255,255,255,0.16)',
                    backdropFilter: 'blur(20px)',
                    border: '1.5px solid rgba(255,255,255,0.32)',
                    boxShadow: '0 10px 36px rgba(0,0,0,0.4)',
                  }}>
                  <img src={LogoImage} alt="Bezaw" className="w-11 h-11 object-contain drop-shadow-[0_3px_12px_rgba(0,0,0,0.5)]" />
                </div>
              </div>
              <div className="pb-1">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                    style={{ animation: 'pulseDot 1.5s infinite', boxShadow: '0 0 5px #34d399' }} />
                  <p className="text-[9px] font-black text-emerald-300 uppercase tracking-[0.22em]">Bezaw Vendor</p>
                </div>
                <p className="text-[15px] font-black text-white tracking-tight leading-tight">Account Recovery</p>
              </div>
            </div>
          </div>

          {/* ── BOTTOM: Form section ── */}
          <div className="flex flex-col justify-center px-9 py-8 bg-white relative overflow-hidden">
            {/* Corner glow */}
            <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.07), transparent 70%)' }} />

            {/* Back button */}
            <button onClick={onBack}
              className="flex items-center gap-2 mb-6 group w-fit"
            >
              <div className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center bg-slate-50 group-hover:border-emerald-200 group-hover:bg-emerald-50 transition-all">
                <ArrowLeft size={14} className="text-slate-400 group-hover:text-emerald-600 group-hover:-translate-x-0.5 transition-all" />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] group-hover:text-emerald-600 transition-colors">
                Back to Login
              </span>
            </button>

            <div className="mb-6">
              <h2 className="text-[22px] font-black text-slate-900 tracking-tight leading-tight">Reset password</h2>
              <p className="text-xs text-slate-400 font-medium mt-1.5 leading-relaxed">
                Enter your email and we'll send a one-time code to reset your password.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 rounded-2xl text-xs font-bold py-2.5 px-4 text-center"
                style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444' }}>
                ⚠ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Email */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.18em] mb-1.5 ml-1">
                  Email address
                </label>
                <div className="relative">
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-200 ${focused ? 'text-emerald-500' : 'text-slate-300'}`}>
                    <Mail size={15} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    required
                    placeholder="you@bezawcurbside.com"
                    className="w-full pl-10 pr-4 py-3.5 text-sm font-semibold text-slate-800 placeholder:text-slate-300 outline-none rounded-[12px] transition-all duration-200"
                    style={{
                      background: focused ? '#fff' : '#f8fafb',
                      border: `1.5px solid ${focused ? '#10b981' : '#eef2f7'}`,
                      boxShadow: focused ? '0 0 0 3px rgba(16,185,129,0.08)' : 'none',
                    }}
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full relative overflow-hidden flex items-center justify-center gap-2 py-[14px] rounded-[12px] text-sm font-black uppercase tracking-widest text-white transition-all duration-300 active:scale-[0.98] group mt-1"
                style={{
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  boxShadow: '0 8px 28px -6px rgba(5,150,105,0.42)',
                  opacity: loading ? 0.75 : 1,
                }}
              >
                {/* shimmer */}
                <span className="absolute inset-0 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-700 pointer-events-none"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)' }} />
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Sending code...
                  </span>
                ) : (
                  <>Send Reset Code <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </form>

            {/* Info card */}
            <div className="mt-5 flex items-start gap-3 p-3.5 rounded-2xl"
              style={{ background: '#f0fdf7', border: '1px solid #d1fae5' }}>
              <ShieldCheck size={15} className="text-emerald-500 mt-0.5 shrink-0" />
              <p className="text-[10px] text-emerald-700 font-semibold leading-relaxed">
                A 6-digit code will be sent to your email. It expires in 10 minutes. Check your spam folder if you don't see it.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.75); }
        }
        @keyframes floatSoft {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;
