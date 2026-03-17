import React, { useState, useEffect } from 'react';
import { Lock, Mail, ArrowRight, Eye, EyeOff, ShieldCheck, Zap, Star } from 'lucide-react';
import LogoImage from '../../assets/Bezaw logo (2).png';

interface LoginProps {
  onLogin: (user: any) => void;
  onForgot: () => void;
  isDarkMode: boolean;
}

const TICKS = [
  'Order BZWOR-112 → Ready for pickup',
  'New arrival: BZWOR-098 → Arrived',
  'BZWOR-134 completed in 1m 42s',
  'Payment verified: BZWOR-117',
  '12 orders fulfilled this hour',
];

const Login: React.FC<LoginProps> = ({ onLogin, onForgot }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [tickIdx, setTickIdx] = useState(0);
  const [tickVisible, setTickVisible] = useState(true);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    setMounted(true);
    const h = new Date().getHours();
    setGreeting(h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening');
    const tickTimer = setInterval(() => {
      setTickVisible(false);
      setTimeout(() => { setTickIdx(p => (p + 1) % TICKS.length); setTickVisible(true); }, 400);
    }, 3500);
    return () => clearInterval(tickTimer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('https://branchapi.bezawcurbside.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('token', data.token);
      const profileRes = await fetch('https://branchapi.bezawcurbside.com/api/auth/me', {
        headers: { Authorization: `Bearer ${data.token}` },
      });
      if (!profileRes.ok) throw new Error('Failed to fetch security clearance');
      onLogin(await profileRes.json());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden relative flex"
      style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: '#030f09' }}>

      {/* ══════════════════════════════════════════
          AMBIENT BG — subtle dark green mesh
      ══════════════════════════════════════════ */}
      <div className="absolute inset-0 pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(6,78,59,0.35) 0%, transparent 80%)' }} />
      <div className="absolute inset-0 pointer-events-none z-0"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(52,211,153,0.06) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

      {/* ══════════════════════════════════════════
          LEFT PANEL — Enhanced logo exhibit
      ══════════════════════════════════════════ */}
      <div className="hidden lg:flex flex-col items-center justify-center flex-1 relative z-10 overflow-hidden">
        
        {/* Large atmospheric glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(16,185,129,0.05) 40%, transparent 70%)' }} />

        {/* Floating light streaks */}
        <div className="absolute top-[-20%] left-[-10%] w-[140%] h-[140%] pointer-events-none opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-1 bg-emerald-400/30 blur-2xl rotate-45 animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-1 bg-emerald-500/20 blur-3xl -rotate-45 animate-pulse delay-700" />
        </div>

        {/* Logo Exhibit */}
        <div className="relative flex flex-col items-center">
          {/* Pulsing ring behind logo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-emerald-500/10 rounded-full animate-ping-slow" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-emerald-500/5 rounded-full animate-pulse" />

          {/* Large Hero Logo */}
          <div className="relative group">
            <div className="absolute inset-0 bg-emerald-500/20 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <img
              src="/logo.png"
              alt="Bezaw Logo"
              className="w-[320px] max-w-[90%] object-contain select-none relative z-10 transition-all duration-1000"
              style={{ 
                opacity: 0.25, 
                filter: 'brightness(1.5) saturate(0.8)', 
                animation: 'floatSoft 6s ease-in-out infinite' 
              }}
            />
          </div>

        
        </div>

        {/* Brand footer in left panel */}
        <div className="absolute bottom-12 text-center">
          <div className="flex items-center gap-3 px-5 py-2 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-sm">
            <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">Bezaw Curbside</p>
            <div className="w-1 h-1 rounded-full bg-emerald-500/30" />
            <p className="text-[8px] font-bold text-white/20 uppercase tracking-[0.2em]">Est. 2026</p>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          CENTER — the combined card
      ══════════════════════════════════════════ */}
      <div className="relative z-20 flex items-center justify-center py-6 px-4 flex-shrink-0"
        style={{ width: '100%', maxWidth: 580 }}>
        <div
          className="w-full overflow-hidden"
          style={{
            borderRadius: 28,
            boxShadow: '0 50px 150px -30px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.07)',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.97)',
            transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s',
            display: 'flex',
            flexDirection: 'column',
            height: 'min(680px, calc(100vh - 48px))',
          }}
        >
          {/* ── TOP: Banner 1 image ── */}
          <div className="relative flex-shrink-0" style={{ height: '42%' }}>
            <img
              src="/background banner.jpg"
              alt="Bezaw Curbside"
              className="w-full h-full object-cover"
              style={{ objectPosition: 'center 20%' }}
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0"
              style={{ background: 'linear-gradient(to bottom, rgba(2,20,12,0.30) 0%, rgba(2,20,12,0.15) 35%, rgba(2,20,12,0.88) 100%)' }} />

            {/* ── LOGO inside card on the banner ── */}
            <div className="absolute bottom-0 inset-x-0 px-8 pb-6 flex flex-col items-start gap-3">
              {/* Logo container with glow ring */}
              <div className="relative">
                {/* Strong glow blob behind */}
                <div className="absolute -inset-4 rounded-full blur-3xl pointer-events-none"
                  style={{ background: 'rgba(52,211,153,0.5)' }} />
                {/* Outer ring */}
                <div className="absolute -inset-1.5 rounded-[22px] pointer-events-none"
                  style={{ background: 'rgba(52,211,153,0.2)', backdropFilter: 'blur(4px)', border: '1px solid rgba(52,211,153,0.3)' }} />
                {/* Logo tile */}
                <div className="relative w-20 h-20 rounded-[20px] flex items-center justify-center shadow-2xl"
                  style={{
                    background: 'rgba(255,255,255,0.18)',
                    backdropFilter: 'blur(20px)',
                    border: '1.5px solid rgba(255,255,255,0.35)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.15) inset',
                  }}>
                  <img src={LogoImage} alt="Bezaw" className="w-14 h-14 object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]" />
                </div>
              </div>

              {/* Text below logo */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                 
                  <p className="text-[9px] font-black text-emerald-300 uppercase tracking-[0.22em]">Bezaw Curbside </p>
                </div>
                <p className="text-[18px] font-black text-white tracking-tight leading-snug">
                  Ethiopia's Premier<br />Curbside Drive-Thru
                </p>
              </div>
            </div>

            
            
          </div>

          {/* ── BOTTOM: Login form ── */}
          <div className="flex-1 flex flex-col justify-center px-9 py-7 relative overflow-hidden bg-white">
            {/* Subtle corner glow */}
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.07), transparent 70%)' }} />

            {/* Greeting */}
            <div className="mb-5">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.18em] mb-1">{greeting} 👋</p>
              <h2 className="text-[22px] font-black text-slate-900 tracking-tight leading-tight">Welcome back</h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Sign in to your workspace</p>
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
              <div className="relative">
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-200 ${focusedField === 'email' ? 'text-emerald-500' : 'text-slate-300'}`}>
                  <Mail size={15} />
                </div>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)}
                  required placeholder="Email address"
                  className="w-full pl-10 pr-4 py-3.5 text-sm font-semibold text-slate-800 placeholder:text-slate-300 outline-none rounded-[12px] transition-all duration-200"
                  style={{
                    background: focusedField === 'email' ? '#fff' : '#f8fafb',
                    border: `1.5px solid ${focusedField === 'email' ? '#10b981' : '#eef2f7'}`,
                    boxShadow: focusedField === 'email' ? '0 0 0 3px rgba(16,185,129,0.08)' : 'none',
                  }}
                />
              </div>

              {/* Password */}
              <div className="relative">
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-200 ${focusedField === 'pass' ? 'text-emerald-500' : 'text-slate-300'}`}>
                  <Lock size={15} />
                </div>
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('pass')} onBlur={() => setFocusedField(null)}
                  required placeholder="Password"
                  className="w-full pl-10 pr-11 py-3.5 text-sm font-semibold text-slate-800 placeholder:text-slate-300 outline-none rounded-[12px] transition-all duration-200"
                  style={{
                    background: focusedField === 'pass' ? '#fff' : '#f8fafb',
                    border: `1.5px solid ${focusedField === 'pass' ? '#10b981' : '#eef2f7'}`,
                    boxShadow: focusedField === 'pass' ? '0 0 0 3px rgba(16,185,129,0.08)' : 'none',
                  }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-emerald-500 transition-colors">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              <div className="flex justify-end">
                <button type="button" onClick={onForgot}
                  className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-emerald-600 transition-colors">
                  Forgot password?
                </button>
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading}
                className="w-full relative overflow-hidden flex items-center justify-center gap-2 py-[14px] rounded-[12px] text-sm font-black uppercase tracking-widest text-white transition-all duration-300 active:scale-[0.98] group"
                style={{
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  boxShadow: '0 8px 28px -6px rgba(5,150,105,0.42)',
                  opacity: loading ? 0.75 : 1,
                }}>
                <span className="absolute inset-0 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-700 pointer-events-none"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)' }} />
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Authenticating...
                  </span>
                ) : (
                  <>Access Dashboard <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </form>

           
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          RIGHT PANEL — banner2 image
      ══════════════════════════════════════════ */}
      <div className="hidden lg:block flex-1 relative z-10 overflow-hidden">
        <img
          src="/background banner2.jpg.png"
          alt=""
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center center', opacity: 0.55, filter: 'brightness(0.75) saturate(1.15)' }}
        />
        {/* Left fade — blends into the dark bg near the card */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, rgba(3,15,9,1) 0%, rgba(3,15,9,0.35) 30%, transparent 75%)' }} />
        {/* bottom vignette */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(3,15,9,0.7) 0%, transparent 40%)' }} />

        {/* Floating caption bottom-right */}
        <div className="absolute bottom-10 right-8 text-right space-y-1"
          style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.6s ease 1s' }}>
          <p className="text-[9px] font-black text-emerald-400/50 uppercase tracking-[0.25em]">Bezaw Curbside</p>
          <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">© 2026 All Rights Reserved</p>
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
        @keyframes pingSlow {
          75%, 100% { transform: scale(1.5); opacity: 0; }
        }
        .animate-ping-slow {
          animation: pingSlow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default Login;
