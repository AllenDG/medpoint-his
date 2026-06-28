import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';

const NAV_ITEMS = [
  { icon: 'dashboard',       label: 'My Dashboard',    path: '' },
  { icon: 'queue',           label: 'Triage Queue',    path: '/queue' },
  { icon: 'monitor_heart',   label: 'Vitals Entry',    path: '/vitals' },
  { icon: 'assignment',      label: 'Handover Notes',  path: '/handover' },
  { icon: 'history',         label: 'Shift History',   path: '/history' },
];

export default function NurseLayout() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const navigate = useNavigate();
  const { nurseId } = useParams<{ nurseId: string }>();

  function handleLogout() {
    logout();
    navigate('/nurse/login', { replace: true });
  }

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Poppins',sans-serif" }}>
      <a href="#nurse-main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[9999] focus:bg-white focus:px-4 focus:py-2 focus:rounded focus:font-bold"
        style={{ color: '#16A34A' }}>
        Skip to main content
      </a>

      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-48 lg:hidden"
          style={{ background: 'rgba(0,0,0,.45)' }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`shrink-0 flex flex-col fixed inset-y-0 left-0 z-49 w-60 transition-transform duration-300 lg:relative lg:inset-auto ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
        style={{ background: '#fff', borderRight: '1px solid #E4E8EF', minHeight: '100vh' }}>
        <div className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: '1px solid #F1F5F9' }}>
          <img src="/images/medpoint_logo.png" alt="MedPoint" className="h-6 w-auto shrink-0" />
          <div>
            <div className="text-[12px] font-bold leading-tight" style={{ color: '#111827' }}>MedPoint HIS</div>
            <div className="text-[9.5px]" style={{ color: '#9CA3AF' }}>Nurse Portal</div>
          </div>
        </div>
        <div className="px-5 py-3" style={{ borderBottom: '1px solid #F1F5F9' }}>
          <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#9CA3AF' }}>Workspace</div>
          <div className="text-[12.5px] font-semibold" style={{ color: '#16A34A' }}>
            /{nurseId}
          </div>
        </div>
        <nav className="flex-1 px-3 py-3 flex flex-col gap-0.5" onClick={() => setMobileOpen(false)}>
          {NAV_ITEMS.map(item => {
            const href = `/nurse/${nurseId}${item.path}`;
            return (
              <Link
                key={href}
                to={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors"
                style={{ color: '#6B7280', textDecoration: 'none', fontFamily: "'Poppins',sans-serif" }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#ECFDF5'; (e.currentTarget as HTMLAnchorElement).style.color = '#16A34A'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; (e.currentTarget as HTMLAnchorElement).style.color = '#6B7280'; }}
              >
                <span className="material-icons-outlined text-[18px]">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 py-4" style={{ borderTop: '1px solid #F1F5F9' }}>
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[12px] font-bold shrink-0" style={{ background: '#16A34A' }}>
              {user?.name?.[0] ?? 'N'}
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-semibold truncate" style={{ color: '#111827' }}>{user?.name}</div>
              <div className="text-[11px] truncate" style={{ color: '#9CA3AF' }}>ID: {nurseId?.toUpperCase()}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-medium border-0 cursor-pointer"
            style={{ background: '#FEE2E2', color: '#EF4444', fontFamily: "'Poppins',sans-serif" }}
          >
            <span className="material-icons-outlined text-[16px]">logout</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col" style={{ background: '#F4F6F9' }}>
        {/* Top bar */}
        <div className="h-16 px-4 sm:px-8 flex items-center gap-3 bg-white" style={{ borderBottom: '1.5px solid #E4E8EF' }}>
          <button
            onClick={() => setMobileOpen(v => !v)}
            className="lg:hidden flex items-center justify-center bg-transparent border-0 cursor-pointer rounded shrink-0"
            style={{ width: 36, height: 36, border: '1.5px solid #E4E8EF', color: '#475569' }}
            aria-label="Toggle sidebar"
          >
            <span className="material-icons-outlined" style={{ fontSize: 18 }}>menu</span>
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-[18px] font-extrabold" style={{ color: '#122056' }}>Nurse Dashboard</h1>
            <p className="text-[12px]" style={{ color: '#94A3B8' }}>Workspace: /nurse/{nurseId}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold" style={{ background: '#ECFDF5', color: '#16A34A' }}>
              <div className="w-2 h-2 rounded-full" style={{ background: '#16A34A' }} />
              On shift
            </div>
            <button className="w-9 h-9 rounded-lg flex items-center justify-center bg-transparent border-0 cursor-pointer" style={{ border: '1.5px solid #E4E8EF', color: '#475569' }}>
              <span className="material-icons-outlined text-[18px]">notifications_none</span>
            </button>
          </div>
        </div>

        {/* Event banner */}
        {!bannerDismissed && (
          <div className="flex items-center gap-3 px-5 py-2.5" style={{ background: 'linear-gradient(90deg,#FFFBEB,#FEF9EE)', borderBottom: '1px solid #FDE68A' }}>
            <span className="material-icons-outlined shrink-0 text-[17px]" style={{ color: '#D97706' }}>campaign</span>
            <div className="flex-1 text-[12px] leading-snug" style={{ color: '#92400E' }}>
              <strong>System Notice:</strong> Scheduled maintenance on <strong>July 5, 2026 · 10PM–2AM PHT</strong>. All services temporarily unavailable.
            </div>
            <button onClick={() => setBannerDismissed(true)} aria-label="Dismiss"
              className="w-6 h-6 flex items-center justify-center border-0 cursor-pointer shrink-0"
              style={{ background: 'transparent', color: '#D97706' }}>
              <span className="material-icons-outlined text-[16px]">close</span>
            </button>
          </div>
        )}

        {/* Dashboard body */}
        <div id="nurse-main-content" className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'In Queue',        value: '12', icon: 'queue',            color: '#16A34A', bg: '#ECFDF5' },
              { label: 'Vitals Pending',  value: '5',  icon: 'monitor_heart',    color: '#F59E0B', bg: '#FFFBEB' },
              { label: 'In Triage',       value: '3',  icon: 'medical_services', color: '#5B65DC', bg: '#EEEFFD' },
              { label: 'Completed Today', value: '28', icon: 'check_circle',     color: '#64748B', bg: '#F4F6F9' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl p-5" style={{ border: '1.5px solid #E4E8EF' }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: s.bg }}>
                  <span className="material-icons-outlined text-[20px]" style={{ color: s.color }}>{s.icon}</span>
                </div>
                <div className="text-[28px] font-extrabold leading-none mb-1" style={{ color: '#122056' }}>{s.value}</div>
                <div className="text-[12px] font-semibold" style={{ color: '#64748B' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Placeholder */}
          <div className="bg-white rounded-2xl p-12 text-center" style={{ border: '1.5px solid #E4E8EF' }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: '#ECFDF5' }}>
              <span className="material-icons-outlined text-[30px]" style={{ color: '#16A34A' }}>construction</span>
            </div>
            <h2 className="text-[18px] font-extrabold mb-2" style={{ color: '#122056' }}>Nurse module in development</h2>
            <p className="text-[14px]" style={{ color: '#64748B', maxWidth: 420, margin: '0 auto' }}>
              Triage queue, vitals entry, and handover notes will be implemented in the next phase. Your personal workspace URL (<strong>/nurse/{nurseId}</strong>) is live and secured.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
