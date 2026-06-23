import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';

const MOCK_ADMINS: Record<string, { name: string; id: string }> = {
  'admin@medpoint.com.ph':   { name: 'System Admin',        id: 'admin-001' },
  'helpdesk@medpoint.com.ph': { name: 'Helpdesk Supervisor', id: 'hd-001'   },
  'support@medpoint.com.ph':  { name: 'Support Agent',       id: 'hd-002'   },
};
const MOCK_PASSWORD = 'Admin@2024';

export function HelpdeskLoginPage() {
  const navigate = useNavigate();
  const setAuth  = useAuthStore(s => s.setAuth);

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const admin = MOCK_ADMINS[email.toLowerCase()];
    if (!admin || password !== MOCK_PASSWORD) {
      setError('Invalid email or password. Please try again.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setAuth(
        { id: admin.id, name: admin.name, email: email.toLowerCase(), role: 'HELPDESK' },
        `mock-helpdesk-token-${admin.id}`
      );
      setLoading(false);
      navigate('/helpdesk', { replace: true });
    }, 900);
  }

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Poppins',sans-serif" }}>

      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] flex-shrink-0 p-10" style={{ background: '#122056' }}>
        <div>
          <img src="/images/medpoint_logo.png" alt="MedPoint" className="h-9 w-auto brightness-0 invert mb-12" />
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg mb-6" style={{ background: 'rgba(91,101,220,.3)', border: '1px solid rgba(91,101,220,.5)' }}>
            <span className="material-icons-outlined text-[14px]" style={{ color: '#A5B0FF' }}>support_agent</span>
            <span className="text-[11px] font-bold uppercase tracking-[.08em]" style={{ color: '#A5B0FF' }}>Admin Portal</span>
          </div>
          <h2 className="text-[28px] font-extrabold text-white leading-[1.15] tracking-[-0.025em] mb-4">
            Helpdesk &<br />Admin Dashboard
          </h2>
          <p className="text-[14px] leading-[1.75]" style={{ color: 'rgba(255,255,255,.6)' }}>
            Manage appointments, patient queries, escalations, and branch operations from a single secure portal.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          {[
            { icon: 'confirmation_number', text: 'Ticket management & SLA tracking' },
            { icon: 'calendar_month',      text: 'Appointment oversight & rescheduling' },
            { icon: 'bar_chart',           text: 'Branch performance reports' },
            { icon: 'security',            text: 'Role-based access control' },
          ].map(f => (
            <div key={f.text} className="flex items-center gap-3 text-[13px]" style={{ color: 'rgba(255,255,255,.65)' }}>
              <span className="material-icons-outlined text-[16px]" style={{ color: '#A5B0FF' }}>{f.icon}</span>
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
            <h1 className="text-[22px] font-extrabold mb-1.5" style={{ color: '#122056' }}>Admin Sign In</h1>
            <p className="text-[13.5px] mb-7" style={{ color: '#64748B' }}>Enter your staff credentials to access the dashboard.</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-[14px]">
              <div>
                <label className="block text-[12.5px] font-semibold mb-1.5" style={{ color: '#122056' }}>Email address</label>
                <input
                  type="email"
                  className="f-input"
                  placeholder="admin@medpoint.com.ph"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="username"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[12.5px] font-semibold" style={{ color: '#122056' }}>Password</label>
                  <button type="button" className="text-[12px] font-semibold bg-transparent border-0 cursor-pointer p-0" style={{ color: '#5B65DC', fontFamily: "'Poppins',sans-serif" }}>
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
              <div className="rounded-lg px-4 py-3 text-[12.5px]" style={{ background: '#EEEFFD', border: '1px solid #C7CAEF', color: '#5B65DC' }}>
                <strong>Demo credentials:</strong><br />
                Email: <code>admin@medpoint.com.ph</code><br />
                Password: <code>Admin@2024</code>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-p w-full justify-center mt-1"
                style={{ height: 48, fontSize: 15, opacity: loading ? .7 : 1 }}
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
            <Link to="/nurse/login" className="text-[12.5px] font-medium" style={{ color: '#64748B', textDecoration: 'none' }}>
              Nurse portal →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
