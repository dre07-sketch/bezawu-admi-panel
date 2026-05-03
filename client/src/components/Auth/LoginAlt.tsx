import React, { useState, useEffect, useRef } from 'react';
import { Lock, Mail, ArrowRight, Eye, EyeOff, ChevronLeft, ChevronRight } from 'lucide-react';
import LogoImage from '../../assets/Bezaw logo (2).png';

interface LoginProps {
  onLogin: (user: any) => void;
  onForgot: () => void;
  isDarkMode: boolean;
}

const BANNERS = [
  '/background banner.jpg',
  '/background banner2.jpg.png',
];

const Login: React.FC<LoginProps> = ({ onLogin, onForgot }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeBanner, setActiveBanner] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    setMounted(true);
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => changeBanner('next'), 5000);
  };

  const changeBanner = (dir: 'next' | 'prev') => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setActiveBanner(prev =>
        dir === 'next' ? (prev + 1) % BANNERS.length : (prev - 1 + BANNERS.length) % BANNERS.length
      );
      setTransitioning(false);
    }, 700);
    startTimer();
  };

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
        headers: { 'Authorization': `Bearer ${data.token}` },
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
    <div className="h-screen w-screen relative overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── Full-screen banner background ── */}
      {BANNERS.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 w-full h-full transition-all duration-700"
          style={{
            opacity: activeBanner === i ? 1 : 0,
            transform: activeBanner === i ? 'scale(1)' : 'scale(1.04)',
            zIndex: activeBanner === i ? 1 : 0,
          }}
        >
          <img
            src={src}
            alt=""
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.35) saturate(1.2)' }}
          />
        </div>
      ))}

      {/* ── Overlay gradients ── */}
      <div className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(6,78,59,0.6) 0%, rgba(2,20,14,0.85) 100%)' }}
      />
      {/* Bottom vignette */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(2,12,8,0.95), transparent)' }}
      />
      {/* Top bar */}
      <div className="absolute inset-x-0 top-0 h-1/4 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(2,12,8,0.7), transparent)' }}
      />

      {/* ── Animated scan line ── */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden opacity-[0.03]">
        <div className="w-full" style={{
          height: '2px', background: '#4ade80',
          boxShadow: '0 0 20px #4ade80',
          animation: 'scanline 4s linear infinite'
        }} />
      </div>

      {/* ── Corner arrows (banner nav) ── */}
      <button onClick={() => changeBanner('prev')}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full flex items-center justify-center border border-white/10 text-white/40 hover:text-white hover:border-white/30 hover:bg-white/10 transition-all backdrop-blur-sm">
        <ChevronLeft size={18} />
      </button>
      <button onClick={() => changeBanner('next')}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full flex items-center justify-center border border-white/10 text-white/40 hover:text-white hover:border-white/30 hover:bg-white/10 transition-all backdrop-blur-sm">
        <ChevronRight size={18} />
      </button>

      {/* ── Top bar with logo ── */}
      <div className="absolute top-0 inset-x-0 z-30 flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-3">
          <img src={LogoImage} alt="Bezaw" className="w-9 h-9 object-contain drop-shadow-lg" />
          <div>
            <p className="text-white font-black text-sm tracking-tight leading-none">Bezaw</p>
            <p className="text-emerald-400 text-[9px] font-black uppercase tracking-[0.2em]">Admin Portal</p>
          </div>
        </div>
        {/* Live indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-400/20 bg-black/20 backdrop-blur-md">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"
            style={{ boxShadow: '0 0 6px #4ade80', animation: 'pulseFast 1.5s ease infinite' }} />
          <span className="text-[9px] font-black text-emerald-300 uppercase tracking-[0.2em]">System Live</span>
        </div>
      </div>

      {/* ── Centered glass card ── */}
      <div className="relative z-20 h-full flex items-center justify-center px-4"
        style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)' }}>

        <div className="w-full max-w-[400px]"
          style={{
            background: 'rgba(5, 20, 14, 0.75)',
            backdropFilter: 'blur(40px) saturate(1.5)',
            WebkitBackdropFilter: 'blur(40px) saturate(1.5)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '2rem',
            boxShadow: '0 40px 120px -20px rgba(0,0,0,0.8), 0 0 0 1px rgba(52,211,153,0.05) inset, 0 1px 0 rgba(255,255,255,0.05) inset',
            padding: '2.5rem',
          }}>

          {/* Card inner glow */}
          <div className="absolute inset-0 rounded-[2rem] pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at top, rgba(16,185,129,0.07) 0%, transparent 60%)' }} />

          {/* Heading */}
          <div className="text-center mb-8 space-y-1.5">
            <h2 className="text-2xl font-black text-white tracking-tight">Sign In</h2>
            <p className="text-sm text-white/30 font-medium">Access your management dashboard</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-bold py-3 px-4 text-center">
              ⚠ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">

            {/* Email field */}
            <div className="relative">
              <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${focusedField === 'email' ? 'text-emerald-400' : 'text-white/20'}`}>
                <Mail size={15} />
              </div>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                required
                placeholder="Email address"
                className="w-full pl-10 pr-4 py-3.5 text-sm font-semibold text-white placeholder:text-white/20 outline-none rounded-xl transition-all duration-200"
                style={{
                  background: focusedField === 'email' ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${focusedField === 'email' ? 'rgba(52,211,153,0.4)' : 'rgba(255,255,255,0.07)'}`,
                  boxShadow: focusedField === 'email' ? '0 0 0 3px rgba(16,185,129,0.08), 0 0 20px rgba(16,185,129,0.05)' : 'none',
                }}
              />
            </div>

            {/* Password field */}
            <div className="relative">
              <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${focusedField === 'pass' ? 'text-emerald-400' : 'text-white/20'}`}>
                <Lock size={15} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocusedField('pass')}
                onBlur={() => setFocusedField(null)}
                required
                placeholder="Password"
                className="w-full pl-10 pr-11 py-3.5 text-sm font-semibold text-white placeholder:text-white/20 outline-none rounded-xl transition-all duration-200"
                style={{
                  background: focusedField === 'pass' ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${focusedField === 'pass' ? 'rgba(52,211,153,0.4)' : 'rgba(255,255,255,0.07)'}`,
                  boxShadow: focusedField === 'pass' ? '0 0 0 3px rgba(16,185,129,0.08), 0 0 20px rgba(16,185,129,0.05)' : 'none',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-emerald-400 transition-colors"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {/* Forgot */}
            <div className="flex justify-end pt-1">
              <button type="button" onClick={onForgot}
                className="text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-emerald-400 transition-colors">
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="relative w-full overflow-hidden flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-black uppercase tracking-wider text-white transition-all duration-300 active:scale-95 mt-2 group"
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669 60%, #047857)',
                boxShadow: loading ? 'none' : '0 8px 32px rgba(16,185,129,0.35), 0 0 0 1px rgba(16,185,129,0.2)',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {/* shimmer sweep on hover */}
              <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }} />
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

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
            <span className="text-[9px] font-black text-white/15 uppercase tracking-[0.25em]">Bezaw Secure Access</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
          </div>

          {/* Mini stats */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { val: '50K+', lbl: 'Orders' },
              { val: '99.9%', lbl: 'Uptime' },
              { val: '<2m', lbl: 'Handover' },
            ].map((s, i) => (
              <div key={i} className="text-center p-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <p className="text-sm font-black text-white">{s.val}</p>
                <p className="text-[8px] font-bold text-emerald-400/50 uppercase tracking-widest">{s.lbl}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom: carousel dots & tagline ── */}
      <div className="absolute bottom-0 inset-x-0 z-30 flex flex-col items-center gap-3 pb-8">
        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">The Addis Drive-Thru</p>
        <div className="flex items-center gap-2">
          {BANNERS.map((_, i) => (
            <button key={i}
              onClick={() => changeBanner(i > activeBanner ? 'next' : 'prev')}
              className="rounded-full transition-all duration-300"
              style={{
                width: activeBanner === i ? '24px' : '6px',
                height: '6px',
                background: activeBanner === i ? '#34d399' : 'rgba(255,255,255,0.2)',
                boxShadow: activeBanner === i ? '0 0 8px rgba(52,211,153,0.7)' : 'none',
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100vh); }
          100% { transform: translateY(100vh); }
        }
        @keyframes pulseFast {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};

export default Login;
