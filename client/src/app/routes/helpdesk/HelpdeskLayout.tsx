import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';

const NAV_ITEMS = [
  { icon: 'dashboard',           label: 'Dashboard',     path: '/helpdesk' },
  { icon: 'confirmation_number', label: 'Tickets',       path: '/helpdesk/tickets' },
  { icon: 'calendar_month',      label: 'Appointments',  path: '/helpdesk/appointments' },
  { icon: 'groups',              label: 'Patients',      path: '/helpdesk/patients' },
  { icon: 'bar_chart',           label: 'Reports',       path: '/helpdesk/reports' },
  { icon: 'settings',            label: 'Settings',      path: '/helpdesk/settings' },
];

export default function HelpdeskLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/helpdesk/login', { replace: true });
  }

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Poppins',sans-serif" }}>

      {/* Sidebar */}
      <aside className="w-[240px] flex-shrink-0 flex flex-col" style={{ background: '#122056', minHeight: '100vh' }}>
        <div className="px-6 py-5 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(255,255,255,.08)' }}>
          <img src="/images/medpoint_logo.png" alt="MedPoint" className="h-7 w-auto brightness-0 invert" />
        </div>
        <div className="px-3 py-2 mt-1 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-[.1em] px-3" style={{ color: 'rgba(255,255,255,.3)' }}>Main Menu</span>
        </div>
        <nav className="flex-1 px-3 flex flex-col gap-0.5">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-colors"
              style={{
                color: 'rgba(255,255,255,.7)',
                textDecoration: 'none',
                fontFamily: "'Poppins',sans-serif",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,.1)'; (e.currentTarget as HTMLAnchorElement).style.color = '#fff'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,.7)'; }}
            >
              <span className="material-icons-outlined text-[18px]">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-3 py-4 mt-auto" style={{ borderTop: '1px solid rgba(255,255,255,.08)' }}>
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0" style={{ background: '#5B65DC' }}>
              {user?.name?.[0] ?? 'A'}
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-semibold text-white truncate">{user?.name}</div>
              <div className="text-[11px] truncate" style={{ color: 'rgba(255,255,255,.45)' }}>Helpdesk Staff</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-medium border-0 cursor-pointer transition-colors"
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
          <h1 className="text-[18px] font-extrabold" style={{ color: '#122056' }}>Helpdesk Dashboard</h1>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-lg flex items-center justify-center bg-transparent border-0 cursor-pointer" style={{ border: '1.5px solid #E4E8EF', color: '#475569' }}>
              <span className="material-icons-outlined text-[18px]">notifications_none</span>
            </button>
            <div className="text-[13px] font-semibold" style={{ color: '#122056' }}>
              Welcome, {user?.name?.split(' ')[0]}
            </div>
          </div>
        </div>

        {/* Dashboard body */}
        <div className="flex-1 p-8">
          {/* Stat cards */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Open Tickets',      value: '24',  icon: 'confirmation_number', color: '#5B65DC', bg: '#EEEFFD' },
              { label: 'Appointments Today', value: '87',  icon: 'calendar_today',      color: '#16A34A', bg: '#ECFDF5' },
              { label: 'Avg. Response Time', value: '4m',  icon: 'timer',               color: '#F59E0B', bg: '#FFFBEB' },
              { label: 'SLA Breached',       value: '2',   icon: 'warning_amber',       color: '#DC2626', bg: '#FFF5F5' },
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

          {/* Placeholder message */}
          <div className="bg-white rounded-2xl p-12 text-center" style={{ border: '1.5px solid #E4E8EF' }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: '#EEEFFD' }}>
              <span className="material-icons-outlined text-[30px]" style={{ color: '#5B65DC' }}>construction</span>
            </div>
            <h2 className="text-[18px] font-extrabold mb-2" style={{ color: '#122056' }}>Helpdesk module in development</h2>
            <p className="text-[14px]" style={{ color: '#64748B', maxWidth: 420, margin: '0 auto' }}>
              Full ticket management, appointment controls, and reports will be implemented in the next phase. The portal structure and authentication are live.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
