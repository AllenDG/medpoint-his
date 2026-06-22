import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// Staff portals are accessed via direct URL only:
//   /helpdesk/login  →  Helpdesk / Admin
//   /nurse/login     →  Nurse Assistant
import { useAuthStore } from '../store/auth.store';

export function PublicLoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore(s => s.setAuth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleGoogleLogin() {
    setLoading(true);
    setError('');
    // TODO: replace with real Google OAuth redirect when backend is ready:
    // window.location.href = '/api/auth/google';
    //
    // Mock: simulate OAuth callback
    setTimeout(() => {
      setAuth(
        { id: 'patient-001', name: 'Patient User', email: 'patient@gmail.com', role: 'PATIENT' },
        'mock-patient-token'
      );
      setLoading(false);
      navigate('/', { replace: true });
    }, 1200);
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#F4F6F9' }}>
      <div className="w-full max-w-[420px] mx-4">

        {/* Card */}
        <div className="bg-white rounded-2xl p-10" style={{ border: '1.5px solid #E4E8EF', boxShadow: '0 20px 60px rgba(18,32,86,.08)' }}>

          {/* Logo */}
          <div className="text-center mb-8">
            <img src="/images/medpoint_logo.png" alt="MedPoint Hospital" className="h-10 w-auto mx-auto mb-5" />
            <h1 className="text-[22px] font-extrabold tracking-[-0.025em] mb-2" style={{ color: '#122056' }}>
              Welcome to MedPoint
            </h1>
            <p className="text-[14px] leading-[1.6]" style={{ color: '#64748B' }}>
              Sign in with your Google account to manage your appointments and health records.
            </p>
          </div>

          {/* Google button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 rounded-xl font-semibold text-[15px] transition-all"
            style={{
              height: 52,
              background: loading ? '#F4F6F9' : '#fff',
              border: '1.5px solid #E4E8EF',
              color: '#122056',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: "'Poppins',sans-serif",
              boxShadow: '0 2px 8px rgba(18,32,86,.06)',
            }}
          >
            {loading ? (
              <span className="material-icons-outlined text-[20px] animate-spin" style={{ color: '#5B65DC' }}>autorenew</span>
            ) : (
              <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#4285F4" d="M44.5 20H24v8.5h11.8C34.4 33.6 29.7 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 6 1.1 8.2 3l6-6C34.5 5.2 29.5 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.9 0 20-7.9 20-21 0-1.4-.1-2.7-.5-4z"/>
                <path fill="#34A853" d="M6.3 14.7l7 5.1C15.1 16.4 19.2 13 24 13c3.1 0 6 1.1 8.2 3l6-6C34.5 5.2 29.5 3 24 3 16.1 3 9.3 8.1 6.3 14.7z"/>
                <path fill="#FBBC05" d="M24 45c5.4 0 10.3-1.8 14.1-4.9l-6.5-5.3C29.7 36.3 27 37 24 37c-5.7 0-10.4-3.4-11.8-8.5l-7 5.4C8.3 40.5 15.6 45 24 45z"/>
                <path fill="#EA4335" d="M44.5 20H24v8.5h11.8c-.8 2.3-2.3 4.3-4.3 5.8l6.5 5.3C42.3 36 45 30.5 45 24c0-1.4-.1-2.7-.5-4z"/>
              </svg>
            )}
            {loading ? 'Signing in…' : 'Continue with Google'}
          </button>

          {error && (
            <div className="mt-4 rounded-lg px-4 py-3 text-[13.5px]" style={{ background: '#FFF5F5', border: '1px solid #FDE8E8', color: '#DC2626' }}>
              {error}
            </div>
          )}

          {/* Back */}
          <div className="text-center mt-7">
            <Link
              to="/"
              className="text-[13px] font-medium inline-flex items-center gap-1"
              style={{ color: '#94A3B8', textDecoration: 'none', fontFamily: "'Poppins',sans-serif" }}
            >
              <span className="material-icons-outlined text-[15px]">arrow_back</span>
              Back to MedPoint website
            </Link>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-[11.5px] mt-5" style={{ color: '#94A3B8', fontFamily: "'Poppins',sans-serif" }}>
          By signing in, you agree to MedPoint's{' '}
          <a href="#" style={{ color: '#5B65DC' }}>Privacy Policy</a> and{' '}
          <a href="#" style={{ color: '#5B65DC' }}>Terms of Service</a>
        </p>
      </div>
    </div>
  );
}
