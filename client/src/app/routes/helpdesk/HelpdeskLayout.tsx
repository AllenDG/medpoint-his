import React, { useState } from 'react';
import { NavLink, useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import DashboardPage    from '@/features/helpdesk/components/DashboardPage';
import AppointmentsPage from '@/features/helpdesk/components/AppointmentsPage';
import PatientsPage     from '@/features/helpdesk/components/PatientsPage';
import InsightsPage     from '@/features/helpdesk/components/InsightsPage';
import SettingsPage     from '@/features/helpdesk/components/SettingsPage';

const NAV = [
  { icon: 'dashboard',           label: 'Dashboard',    to: '/helpdesk',              end: true  },
  { icon: 'confirmation_number', label: 'Appointments', to: '/helpdesk/appointments', end: false },
  { icon: 'groups',              label: 'Patients',     to: '/helpdesk/patients',     end: false },
  { icon: 'insights',            label: 'Insights',     to: '/helpdesk/reports',      end: false },
  { icon: 'settings',            label: 'Settings',     to: '/helpdesk/settings',     end: false },
];

export default function HelpdeskLayout() {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('hd-sb') === '1');

  function toggleSidebar() {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem('hd-sb', next ? '1' : '0');
  }

  function handleLogout() {
    logout();
    navigate('/helpdesk/login', { replace: true });
  }

  const activeNav = NAV.find(n => n.end ? location.pathname === n.to : location.pathname.startsWith(n.to));

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Poppins',sans-serif" }}>
      <a href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[9999] focus:bg-white focus:px-4 focus:py-2 focus:rounded focus:font-bold"
        style={{ color: '#5B65DC' }}>
        Skip to main content
      </a>

      {/* ── Sidebar ── */}
      <aside className="flex flex-col flex-shrink-0 transition-all duration-200"
        style={{ width: collapsed ? 56 : 220, background: '#0D1B3E', borderRight: '1px solid rgba(255,255,255,.06)' }}>

        {/* Brand */}
        <div className="flex items-center flex-shrink-0 overflow-hidden"
          style={{ height: 52, borderBottom: '1px solid rgba(255,255,255,.07)', padding: collapsed ? '0 12px' : '0 16px' }}>
          <img src="/images/medpoint_logo.png" alt="" className="h-6 w-auto brightness-0 invert flex-shrink-0" />
          {!collapsed && (
            <div className="ml-2.5 overflow-hidden">
              <div className="text-[12px] font-bold text-white leading-tight whitespace-nowrap">MedPoint HIS</div>
              <div className="text-[9.5px] whitespace-nowrap" style={{ color: 'rgba(255,255,255,.35)' }}>Helpdesk Portal</div>
            </div>
          )}
        </div>

        {/* ── Collapse toggle — TOP of sidebar ── */}
        <button onClick={toggleSidebar}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="flex items-center border-0 cursor-pointer flex-shrink-0 transition-colors"
          style={{ height: 34, padding: collapsed ? '0 0' : '0 10px', justifyContent: collapsed ? 'center' : 'flex-start',
            background: 'rgba(255,255,255,.04)', borderBottom: '1px solid rgba(255,255,255,.06)',
            color: 'rgba(255,255,255,.45)', fontFamily: "'Poppins',sans-serif", gap: 6 }}>
          <span className="material-icons-outlined" style={{ fontSize: 16 }}>
            {collapsed ? 'chevron_right' : 'chevron_left'}
          </span>
          {!collapsed && <span style={{ fontSize: 11 }}>Collapse</span>}
        </button>

        {/* Nav */}
        <nav className="flex-1 py-3 flex flex-col gap-0.5 px-2 overflow-y-auto">
          {NAV.map(item => (
            <NavLink key={item.to} to={item.to} end={item.end}
              title={collapsed ? item.label : undefined}
              className="flex items-center gap-3 rounded transition-colors"
              style={({ isActive }) => ({
                height: 36, padding: '0 10px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                background: isActive ? 'rgba(91,101,220,.22)' : 'transparent',
                color: isActive ? '#A5B0FF' : 'rgba(255,255,255,.48)',
                textDecoration: 'none', borderRadius: 6,
                fontFamily: "'Poppins',sans-serif",
                fontSize: 13, fontWeight: isActive ? 600 : 500,
              })}>
              <span className="material-icons-outlined flex-shrink-0" style={{ fontSize: 18 }}>{item.icon}</span>
              {!collapsed && <span className="whitespace-nowrap truncate">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User row — bottom */}
        <div className="flex-shrink-0 pb-3" style={{ borderTop: '1px solid rgba(255,255,255,.07)' }}>
          {!collapsed ? (
            <div className="flex items-center gap-2 mx-2 mt-3 px-2 py-2 rounded"
              style={{ background: 'rgba(255,255,255,.05)', borderRadius: 6 }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                style={{ background: '#5B65DC' }}>
                {user?.name?.[0] ?? 'A'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11.5px] font-semibold text-white truncate">{user?.name}</div>
                <div className="text-[9.5px] truncate" style={{ color: 'rgba(255,255,255,.3)' }}>Helpdesk</div>
              </div>
              <button onClick={handleLogout} title="Sign out"
                className="w-6 h-6 flex items-center justify-center rounded bg-transparent border-0 cursor-pointer flex-shrink-0"
                style={{ color: 'rgba(255,255,255,.35)' }}>
                <span className="material-icons-outlined" style={{ fontSize: 15 }}>logout</span>
              </button>
            </div>
          ) : (
            <div className="flex justify-center mt-3">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold cursor-pointer"
                style={{ background: '#5B65DC', fontSize: 11 }} title={user?.name}>
                {user?.name?.[0] ?? 'A'}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center gap-3 flex-shrink-0 bg-white px-5"
          style={{ height: 52, borderBottom: '1px solid #E4E8EF' }}>
          <div className="flex items-center gap-1.5 text-[12.5px] flex-1">
            <span style={{ color: '#94A3B8' }}>Helpdesk</span>
            <span className="material-icons-outlined" style={{ fontSize: 14, color: '#CBD5E1' }}>chevron_right</span>
            <span className="font-semibold" style={{ color: '#122056' }}>{activeNav?.label ?? 'Dashboard'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-[11.5px] font-medium px-2.5 py-1 rounded" style={{ background: '#F4F6F9', color: '#64748B', borderRadius: 6 }}>
              Mon, Jun 22 · 10:42 AM
            </div>
            <button aria-label="View notifications (3 unread)" className="w-8 h-8 flex items-center justify-center relative bg-transparent border-0 cursor-pointer rounded"
              style={{ border: '1px solid #E4E8EF', color: '#64748B', borderRadius: 6 }}>
              <span className="material-icons-outlined" style={{ fontSize: 17 }} aria-hidden="true">notifications_none</span>
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full text-white flex items-center justify-center"
                style={{ background: '#DC2626', fontSize: 8, fontWeight: 700 }}>3</span>
            </button>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded" style={{ background: '#ECFDF5', borderRadius: 6 }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#16A34A' }} />
              <span className="text-[11.5px] font-semibold" style={{ color: '#16A34A' }}>Online</span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div id="main-content" className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <Routes>
            <Route index              element={<DashboardPage />}    />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="patients"    element={<PatientsPage />}     />
            <Route path="reports"     element={<InsightsPage />}     />
            <Route path="settings"    element={<SettingsPage />}     />
          </Routes>
        </div>
      </div>
    </div>
  );
}
