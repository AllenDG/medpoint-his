import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';

const MOCK_NURSES: Record<string, { name: string }> = {
  'NURSE001': { name: 'Nurse Maria Santos'   },
  'NURSE002': { name: 'Nurse Ana Cruz'       },
  'NURSE003': { name: 'Nurse Jose Reyes'     },
  'NURSE004': { name: 'Nurse Elena Garcia'   },
  'NURSE005': { name: 'Nurse Kevin Lim'      },
  'NURSE006': { name: 'Nurse Patricia Tan'   },
};
const MOCK_PASSWORD = 'Nurse@2024';

export function NurseLoginPage() {
  const navigate = useNavigate();
  const setAuth  = useAuthStore(s => s.setAuth);

  const [employeeId, setEmployeeId] = useState('');
  const [password,   setPassword]   = useState('');
  const [showPwd,    setShowPwd]    = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const uid = employeeId.trim().toUpperCase();
    const nurse = MOCK_NURSES[uid];
    if (!nurse || password !== MOCK_PASSWORD) {
      setError('Invalid Employee ID or password. Please check your credentials.');
      return;
    }
    setLoading(true);
    const nurseId = uid.toLowerCase();
    setTimeout(() => {
      setAuth(
        { id: nurseId, name: nurse.name, email: `${nurseId}@medpoint.com.ph`, role: 'NURSE' },
        `mock-nurse-token-${nurseId}`
      );
      setLoading(false);
      // Each nurse has their own URL path
      navigate(`/nurse/${nurseId}`, { replace: true });
    }, 900);
  }

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Poppins',sans-serif" }}>

      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] flex-shrink-0 p-10" style={{ background: '#0D3B2E' }}>
        <div>
          <img src="/images/medpoint_logo.png" alt="MedPoint" className="h-9 w-auto brightness-0 invert mb-12" />
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg mb-6" style={{ background: 'rgba(22,163,74,.25)', border: '1px solid rgba(22,163,74,.4)' }}>
            <span className="material-icons-outlined text-[14px]" style={{ color: '#86EFAC' }}>medical_services</span>
            <span className="text-[11px] font-bold uppercase tracking-[.08em]" style={{ color: '#86EFAC' }}>Nurse Portal</span>
          </div>
          <h2 className="text-[28px] font-extrabold text-white leading-[1.15] tracking-[-0.025em] mb-4">
            Nurse Assistant<br />Dashboard
          </h2>
          <p className="text-[14px] leading-[1.75]" style={{ color: 'rgba(255,255,255,.6)' }}>
            Access your personal triage queue, patient vitals, and handover notes. Each nurse has a dedicated workspace.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          {[
            { icon: 'monitor_heart',     text: 'Real-time patient vitals entry' },
            { icon: 'queue',             text: 'Personal triage queue management' },
            { icon: 'assignment',        text: 'Shift handover notes & reports' },
            { icon: 'person_pin',        text: 'Your own secure workspace URL' },
          ].map(f => (
            <div key={f.text} className="flex items-center gap-3 text-[13px]" style={{ color: 'rgba(255,255,255,.65)' }}>
              <span className="material-icons-outlined text-[16px]" style={{ color: '#86EFAC' }}>{f.icon}</span>
              {f.text}
            </div>
          ))}
        </div>
      </div>

      {/* Right panel: form */}
      <div className="flex-1 flex items-center justify-center p-8" style={{ background: '#F4F6F9' }}>
        <div className="w-full max-w-[420px]">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <img src="/images/medpoint_logo.png" alt="MedPoint" className="h-9 w-auto mx-auto mb-3" />
          </div>

          <div className="bg-white rounded-2xl p-9" style={{ border: '1.5px solid #E4E8EF', boxShadow: '0 12px 40px rgba(18,32,86,.07)' }}>
            <h1 className="text-[22px] font-extrabold mb-1.5" style={{ color: '#122056' }}>Nurse Sign In</h1>
            <p className="text-[13.5px] mb-7" style={{ color: '#64748B' }}>Enter your Employee ID to access your personal dashboard.</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-[14px]">
              <div>
                <label className="block text-[12.5px] font-semibold mb-1.5" style={{ color: '#122056' }}>Employee ID</label>
                <input
                  type="text"
                  className="f-input"
                  placeholder="e.g. NURSE001"
                  value={employeeId}
                  onChange={e => setEmployeeId(e.target.value)}
                  required
                  autoComplete="username"
                  style={{ textTransform: 'uppercase', letterSpacing: '.04em' }}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[12.5px] font-semibold" style={{ color: '#122056' }}>Password</label>
                  <button type="button" className="text-[12px] font-semibold bg-transparent border-0 cursor-pointer p-0" style={{ color: '#16A34A', fontFamily: "'Poppins',sans-serif" }}>
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPwd ? 'text' : 'password'}
                    className="f-input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    style={{ paddingRight: 44 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-0 cursor-pointer flex items-center p-0"
                    style={{ color: '#94A3B8' }}
                  >
                    <span className="material-icons-outlined text-[19px]">{showPwd ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-lg px-4 py-3 text-[13px] flex items-center gap-2" style={{ background: '#FFF5F5', border: '1px solid #FDE8E8', color: '#DC2626' }}>
                  <span className="material-icons-outlined text-[16px]">error_outline</span>
                  {error}
                </div>
              )}

              {/* Demo hint */}
              <div className="rounded-lg px-4 py-3 text-[12.5px]" style={{ background: '#ECFDF5', border: '1px solid #BBF7D0', color: '#166534' }}>
                <strong>Demo credentials:</strong><br />
                Employee ID: <code>NURSE001</code> to <code>NURSE006</code><br />
                Password: <code>Nurse@2024</code>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl font-bold text-[15px] text-white border-0 cursor-pointer transition-all mt-1"
                style={{
                  height: 48,
                  background: loading ? '#15803d' : '#16A34A',
                  opacity: loading ? .85 : 1,
                  fontFamily: "'Poppins',sans-serif",
                }}
              >
                {loading
                  ? <><span className="material-icons-outlined text-[18px]" style={{ animation: 'portalSpin .75s linear infinite' }}>autorenew</span> Signing in…</>
                  : <><span className="material-icons-outlined text-[18px]">login</span> Sign In</>
                }
              </button>
            </form>
          </div>

          <div className="flex items-center justify-between mt-5">
            <Link to="/" className="text-[12.5px] font-medium inline-flex items-center gap-1" style={{ color: '#94A3B8', textDecoration: 'none' }}>
              <span className="material-icons-outlined text-[14px]">arrow_back</span> Back to website
            </Link>
            <Link to="/helpdesk/login" className="text-[12.5px] font-medium" style={{ color: '#64748B', textDecoration: 'none' }}>
              Admin portal →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
