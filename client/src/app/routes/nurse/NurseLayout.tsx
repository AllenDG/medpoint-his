import React from 'react';
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
  const navigate = useNavigate();
  const { nurseId } = useParams<{ nurseId: string }>();

  function handleLogout() {
    logout();
    navigate('/nurse/login', { replace: true });
  }

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Poppins',sans-serif" }}>

      {/* Sidebar */}
      <aside className="w-[240px] flex-shrink-0 flex flex-col" style={{ background: '#0D3B2E', minHeight: '100vh' }}>
        <div className="px-6 py-5 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(255,255,255,.08)' }}>
          <img src="/images/medpoint_logo.png" alt="MedPoint" className="h-7 w-auto brightness-0 invert" />
        </div>
        <div className="px-6 py-3 mt-1" style={{ borderBottom: '1px solid rgba(255,255,255,.06)' }}>
          <div className="text-[10px] font-bold uppercase tracking-[.1em] mb-1" style={{ color: 'rgba(255,255,255,.3)' }}>Workspace</div>
          <div className="text-[12.5px] font-semibold" style={{ color: '#86EFAC' }}>
            /{nurseId}
          </div>
        </div>
        <nav className="flex-1 px-3 py-3 flex flex-col gap-0.5">
          {NAV_ITEMS.map(item => {
            const href = `/nurse/${nurseId}${item.path}`;
            return (
              <Link
                key={href}
                to={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-colors"
                style={{ color: 'rgba(255,255,255,.7)', textDecoration: 'none', fontFamily: "'Poppins',sans-serif" }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,.1)'; (e.currentTarget as HTMLAnchorElement).style.color = '#fff'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,.7)'; }}
              >
                <span className="material-icons-outlined text-[18px]">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 py-4" style={{ borderTop: '1px solid rgba(255,255,255,.08)' }}>
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0" style={{ background: '#16A34A' }}>
              {user?.name?.[0] ?? 'N'}
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-semibold text-white truncate">{user?.name}</div>
              <div className="text-[11px] truncate" style={{ color: 'rgba(255,255,255,.4)' }}>ID: {nurseId?.toUpperCase()}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-medium border-0 cursor-pointer"
            style={{ background: 'rgba(220,38,38,.15)', color: '#FCA5A5', fontFamily: "'Poppins',sans-serif" }}
          >
            <span className="material-icons-outlined text-[16px]">logout</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col" style={{ background: '#F4F6F9' }}>
        {/* Top bar */}
        <div className="h-16 px-8 flex items-center justify-between bg-white" style={{ borderBottom: '1.5px solid #E4E8EF' }}>
          <div>
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

        {/* Dashboard body */}
        <div className="flex-1 p-8">
          {/* Stat cards */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { label: 'In Queue',       value: '12', icon: 'queue',           color: '#16A34A', bg: '#ECFDF5' },
              { label: 'Vitals Pending', value: '5',  icon: 'monitor_heart',   color: '#F59E0B', bg: '#FFFBEB' },
              { label: 'In Triage',      value: '3',  icon: 'medical_services', color: '#5B65DC', bg: '#EEEFFD' },
              { label: 'Completed Today', value: '28', icon: 'check_circle',    color: '#64748B', bg: '#F4F6F9' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl p-5" style={{ border: '1.5px solid #E4E8EF' }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[12.5px] font-semibold" style={{ color: '#64748B' }}>{s.label}</span>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: s.bg }}>
                    <span className="material-icons-outlined text-[18px]" style={{ color: s.color }}>{s.icon}</span>
                  </div>
                </div>
                <div className="text-[28px] font-extrabold" style={{ color: '#122056' }}>{s.value}</div>
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
