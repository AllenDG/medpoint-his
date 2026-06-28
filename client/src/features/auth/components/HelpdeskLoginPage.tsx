import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { useAuthStore } from '../store/auth.store';

// ── Forgot Password Modal ─────────────────────────────────────────────────────
function ForgotPasswordModal({ onClose, accent }: { onClose: () => void; accent: string }) {
  const [step,         setStep]         = useState<'email'|'code'|'reset'>('email');
  const [fpEmail,      setFpEmail]      = useState('');
  const [code,         setCode]         = useState('');
  const [generated,    setGenerated]    = useState('');
  const [newPwd,       setNewPwd]       = useState('');
  const [confirmPwd,   setConfirmPwd]   = useState('');
  const [showNewPwd,   setShowNewPwd]   = useState(false);
  const [fpError,      setFpError]      = useState('');
  const [fpLoading,    setFpLoading]    = useState(false);
  const [done,         setDone]         = useState(false);

  function sendCode() {
    setFpError('');
    if (!fpEmail.trim() || !fpEmail.includes('@')) { setFpError('Enter a valid email address.'); return; }
    setFpLoading(true);
    const c = String(Math.floor(100000 + Math.random() * 900000));
    setGenerated(c);
    setTimeout(() => { setFpLoading(false); setStep('code'); }, 1000);
  }

  function verifyCode() {
    setFpError('');
    if (code.trim() !== generated) { setFpError('Incorrect code. Use the code shown above.'); return; }
    setStep('reset');
  }

  function resetPassword() {
    setFpError('');
    if (newPwd.length < 6) { setFpError('Password must be at least 6 characters.'); return; }
    if (newPwd !== confirmPwd) { setFpError('Passwords do not match.'); return; }
    setFpLoading(true);
    setTimeout(() => { setFpLoading(false); setDone(true); }, 900);
  }

  const STEPS = ['email', 'code', 'reset'] as const;
  const stepIdx = STEPS.indexOf(step);

  return (
    <div className="fixed inset-0 z-[900] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,.5)', backdropFilter: 'blur(4px)', fontFamily: "'Poppins',sans-serif" }}>
      <div className="bg-white w-full max-w-sm" style={{ borderRadius: 18, boxShadow: '0 24px 64px rgba(0,0,0,.22)', overflow: 'hidden' }}>

        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4" style={{ borderBottom: '1px solid #F1F5F9' }}>
          {step !== 'email' && !done && (
            <button onClick={() => { setStep(step === 'reset' ? 'code' : 'email'); setFpError(''); }}
              className="w-7 h-7 flex items-center justify-center border-0 cursor-pointer shrink-0"
              style={{ background: '#F4F6F9', borderRadius: 6, color: '#6B7280' }}>
              <span className="material-icons-outlined" style={{ fontSize: 15 }}>arrow_back</span>
            </button>
          )}
          <div className="flex-1">
            <div className="text-[14px] font-bold" style={{ color: '#111827' }}>
              {done ? 'Password Reset!' : step === 'email' ? 'Reset Password' : step === 'code' ? 'Verify Your Email' : 'Set New Password'}
            </div>
            <div className="text-[11px] mt-0.5" style={{ color: '#9CA3AF' }}>
              {done ? 'You can now sign in with your new password.' : step === 'email' ? 'Enter your registered email to receive a code.' : step === 'code' ? `Code sent to ${fpEmail}` : 'Create a strong new password.'}
            </div>
          </div>
          <button onClick={onClose}
            className="w-7 h-7 flex items-center justify-center border-0 cursor-pointer shrink-0"
            style={{ background: '#F4F6F9', borderRadius: 6, color: '#6B7280' }}>
            <span className="material-icons-outlined" style={{ fontSize: 15 }}>close</span>
          </button>
        </div>

        {/* Step progress */}
        {!done && (
          <div className="flex items-center gap-1 px-6 py-3">
            {STEPS.map((s, i) => (
              <React.Fragment key={s}>
                <div className="rounded-full transition-all duration-300" style={{
                  width: step === s ? 24 : 8, height: 8,
                  background: i <= stepIdx ? accent : '#E4E8EF',
                  flexShrink: 0,
                }} />
                {i < STEPS.length - 1 && <div className="flex-1 h-px" style={{ background: i < stepIdx ? accent : '#E4E8EF' }} />}
              </React.Fragment>
            ))}
          </div>
        )}

        <div className="px-6 pb-6">
          {/* ── Success ── */}
          {done && (
            <div className="flex flex-col items-center py-6 gap-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: `${accent}18` }}>
                <span className="material-icons-outlined" style={{ fontSize: 32, color: accent }}>check_circle</span>
              </div>
              <button onClick={onClose}
                className="w-full h-10 border-0 cursor-pointer font-semibold text-[13px] text-white"
                style={{ background: accent, borderRadius: 8, fontFamily: "'Poppins',sans-serif" }}>
                Back to Sign In
              </button>
            </div>
          )}

          {/* ── Email step ── */}
          {!done && step === 'email' && (
            <div className="flex flex-col gap-4 pt-1">
              <div>
                <label className="block text-[12.5px] font-semibold mb-1.5" style={{ color: '#122056' }}>Email address</label>
                <input type="email" className="f-input"
                  placeholder="your@email.com"
                  value={fpEmail} onChange={e => setFpEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendCode()} />
              </div>
              {fpError && <p className="text-[12px]" style={{ color: '#EF4444' }}>{fpError}</p>}
              <button onClick={sendCode} disabled={fpLoading}
                className="w-full h-10 flex items-center justify-center gap-2 border-0 cursor-pointer font-semibold text-[13px] text-white"
                style={{ background: accent, borderRadius: 8, fontFamily: "'Poppins',sans-serif", opacity: fpLoading ? .7 : 1 }}>
                {fpLoading
                  ? <><span className="material-icons-outlined" style={{ fontSize: 16, animation: 'portalSpin .75s linear infinite' }}>autorenew</span> Sending…</>
                  : <><span className="material-icons-outlined" style={{ fontSize: 16 }}>send</span> Send Verification Code</>}
              </button>
            </div>
          )}

          {/* ── Code step ── */}
          {!done && step === 'code' && (
            <div className="flex flex-col gap-4 pt-1">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: '#F8FAFC', border: '1px solid #E4E8EF' }}>
                <span className="material-icons-outlined shrink-0" style={{ fontSize: 20, color: accent }}>mark_email_read</span>
                <div>
                  <div className="text-[11px]" style={{ color: '#6B7280' }}>Demo — your verification code:</div>
                  <div className="text-[22px] font-extrabold tracking-[.25em] mt-0.5"
                    style={{ color: '#111827', fontFamily: 'monospace' }}>{generated}</div>
                </div>
              </div>
              <div>
                <label className="block text-[12.5px] font-semibold mb-1.5" style={{ color: '#122056' }}>Enter 6-digit code</label>
                <input type="text" inputMode="numeric" maxLength={6} className="f-input text-center font-bold"
                  style={{ fontSize: 20, letterSpacing: '0.3em' }}
                  placeholder="------"
                  value={code} onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  onKeyDown={e => e.key === 'Enter' && verifyCode()} />
              </div>
              {fpError && <p className="text-[12px]" style={{ color: '#EF4444' }}>{fpError}</p>}
              <button onClick={verifyCode}
                className="w-full h-10 flex items-center justify-center gap-2 border-0 cursor-pointer font-semibold text-[13px] text-white"
                style={{ background: accent, borderRadius: 8, fontFamily: "'Poppins',sans-serif" }}>
                <span className="material-icons-outlined" style={{ fontSize: 16 }}>verified</span> Verify Code
              </button>
              <button onClick={sendCode}
                className="w-full text-[12px] border-0 cursor-pointer bg-transparent py-1"
                style={{ color: '#9CA3AF', fontFamily: "'Poppins',sans-serif" }}>
                Resend code
              </button>
            </div>
          )}

          {/* ── Reset step ── */}
          {!done && step === 'reset' && (
            <div className="flex flex-col gap-4 pt-1">
              <div>
                <label className="block text-[12.5px] font-semibold mb-1.5" style={{ color: '#122056' }}>New Password</label>
                <div className="relative">
                  <input type={showNewPwd ? 'text' : 'password'} className="f-input"
                    placeholder="Min. 6 characters"
                    value={newPwd} onChange={e => setNewPwd(e.target.value)}
                    style={{ paddingRight: 44 }} />
                  <button type="button" onClick={() => setShowNewPwd(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 border-0 cursor-pointer bg-transparent flex items-center p-0"
                    style={{ color: '#94A3B8' }}>
                    <span className="material-icons-outlined" style={{ fontSize: 19 }}>{showNewPwd ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[12.5px] font-semibold mb-1.5" style={{ color: '#122056' }}>Confirm Password</label>
                <input type={showNewPwd ? 'text' : 'password'} className="f-input"
                  placeholder="Repeat password"
                  value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} />
              </div>
              {fpError && <p className="text-[12px]" style={{ color: '#EF4444' }}>{fpError}</p>}
              <button onClick={resetPassword} disabled={fpLoading}
                className="w-full h-10 flex items-center justify-center gap-2 border-0 cursor-pointer font-semibold text-[13px] text-white"
                style={{ background: accent, borderRadius: 8, fontFamily: "'Poppins',sans-serif", opacity: fpLoading ? .7 : 1 }}>
                {fpLoading
                  ? <><span className="material-icons-outlined" style={{ fontSize: 16, animation: 'portalSpin .75s linear infinite' }}>autorenew</span> Saving…</>
                  : <><span className="material-icons-outlined" style={{ fontSize: 16 }}>lock_reset</span> Reset Password</>}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const MOCK_ADMINS: Record<string, { name: string; id: string }> = {
  'allen@gmail.com': { name: 'Allen Walter', id: 'admin-001' },
};
const MOCK_PASSWORD = 'admindesk@123';

const RECAPTCHA_SITE_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

export function HelpdeskLoginPage() {
  const navigate = useNavigate();
  const setAuth  = useAuthStore(s => s.setAuth);

  const [email,        setEmail]        = useState('');
  const [password,     setPassword]     = useState('');
  const [showPwd,      setShowPwd]      = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaErr,   setCaptchaErr]   = useState(false);
  const [showForgot,   setShowForgot]   = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!captchaToken) {
      setCaptchaErr(true);
      return;
    }
    setCaptchaErr(false);
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
      recaptchaRef.current?.reset();
      setCaptchaToken(null);
      navigate('/helpdesk', { replace: true });
    }, 900);
  }

  return (
    <>
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
                  <button type="button" onClick={() => setShowForgot(true)} className="text-[12px] font-semibold bg-transparent border-0 cursor-pointer p-0" style={{ color: '#5B65DC', fontFamily: "'Poppins',sans-serif" }}>
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

              {/* CAPTCHA */}
              <div className="flex flex-col items-center gap-2">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={RECAPTCHA_SITE_KEY}
                  onChange={token => { setCaptchaToken(token); setCaptchaErr(false); }}
                  onExpired={() => setCaptchaToken(null)}
                />
                {captchaErr && (
                  <div className="flex items-center gap-1.5 text-[12px]" style={{ color: '#EF4444' }}>
                    <span className="material-icons-outlined text-[14px]">error_outline</span>
                    Please complete the captcha
                  </div>
                )}
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
    {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} accent="#5B65DC" />}
    </>
  );
}
