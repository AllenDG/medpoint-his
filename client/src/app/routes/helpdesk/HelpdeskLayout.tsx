import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ACTIVITY_LOG, ACTIVITY_ICON } from '@/features/helpdesk/data/mock';
import { useUIStore } from '@/store/ui.store';
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
  const { toasts, removeToast } = useUIStore();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [collapsed,        setCollapsed]        = useState(() => localStorage.getItem('hd-sb') === '1');
  const [mobileOpen,       setMobileOpen]       = useState(false);
  const [now,              setNow]              = useState(() => new Date());
  const [online,           setOnline]           = useState(navigator.onLine);
  const [notifOpen,        setNotifOpen]        = useState(false);
  const [readIds,          setReadIds]          = useState<Set<number>>(() => new Set());
  const [bannerDismissed,  setBannerDismissed]  = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Live clock — update every minute
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  // Online/offline indicator
  useEffect(() => {
    const goOn  = () => setOnline(true);
    const goOff = () => setOnline(false);
    window.addEventListener('online',  goOn);
    window.addEventListener('offline', goOff);
    return () => { window.removeEventListener('online', goOn); window.removeEventListener('offline', goOff); };
  }, []);

  // Close notifications dropdown on outside click
  useEffect(() => {
    if (!notifOpen) return;
    function onDown(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [notifOpen]);

  const unread = ACTIVITY_LOG.length - readIds.size;
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  function toggleSidebar() {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem('hd-sb', next ? '1' : '0');
  }

  function handleLogout() {
    logout();
    navigate('/helpdesk/login', { replace: true });
  }

  function openNotif() {
    setNotifOpen(v => !v);
    setReadIds(new Set(ACTIVITY_LOG.map(l => l.id)));
  }

  const activeNav = NAV.find(n => n.end ? location.pathname === n.to : location.pathname.startsWith(n.to));

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Poppins',sans-serif" }}>
      <a href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[9999] focus:bg-white focus:px-4 focus:py-2 focus:rounded focus:font-bold"
        style={{ color: '#5B65DC' }}>
        Skip to main content
      </a>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[48] lg:hidden"
          style={{ background: 'rgba(0,0,0,.45)' }}
          onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`flex flex-col shrink-0 transition-all duration-300 fixed inset-y-0 left-0 z-[49] lg:relative lg:inset-auto ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
        style={{ width: collapsed ? 56 : 220, background: '#fff', borderRight: '1px solid #E4E8EF' }}>

        <div className="flex items-center shrink-0 overflow-hidden"
          style={{ height: 52, borderBottom: '1px solid #F1F5F9', padding: collapsed ? '0 12px' : '0 16px' }}>
          <img src="/images/medpoint_logo.png" alt="MedPoint HIS" className="h-6 w-auto shrink-0" />
          {!collapsed && (
            <div className="ml-2.5 overflow-hidden">
              <div className="text-[12px] font-bold leading-tight whitespace-nowrap" style={{ color: '#111827' }}>MedPoint HIS</div>
              <div className="text-[9.5px] whitespace-nowrap" style={{ color: '#9CA3AF' }}>Helpdesk Portal</div>
            </div>
          )}
        </div>

        <button onClick={toggleSidebar}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="flex items-center border-0 cursor-pointer shrink-0 transition-colors"
          style={{ height: 30, padding: collapsed ? '0' : '0 10px', justifyContent: collapsed ? 'center' : 'flex-start',
            background: '#F8FAFC', borderBottom: '1px solid #F1F5F9',
            color: '#9CA3AF', fontFamily: "'Poppins',sans-serif", gap: 6 }}>
          <span className="material-icons-outlined" style={{ fontSize: 16 }}>
            {collapsed ? 'chevron_right' : 'chevron_left'}
          </span>
          {!collapsed && <span style={{ fontSize: 11 }}>Collapse</span>}
        </button>

        <nav className="flex-1 py-3 flex flex-col gap-0.5 px-2 overflow-y-auto" onClick={() => setMobileOpen(false)}>
          {NAV.map(item => (
            <NavLink key={item.to} to={item.to} end={item.end}
              title={collapsed ? item.label : undefined}
              className="flex items-center gap-3 rounded transition-colors"
              style={({ isActive }) => ({
                height: 36, padding: '0 10px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                background: isActive ? '#EEEFFD' : 'transparent',
                color: isActive ? '#5B65DC' : '#6B7280',
                textDecoration: 'none', borderRadius: 6,
                fontFamily: "'Poppins',sans-serif",
                fontSize: 13, fontWeight: isActive ? 600 : 500,
              })}>
              <span className="material-icons-outlined shrink-0" style={{ fontSize: 18 }}>{item.icon}</span>
              {!collapsed && <span className="whitespace-nowrap truncate">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="shrink-0 pb-3" style={{ borderTop: '1px solid #F1F5F9' }}>
          {!collapsed ? (
            <div className="flex items-center gap-2 mx-2 mt-3 px-2 py-2 rounded"
              style={{ background: '#F8FAFC', borderRadius: 6 }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                style={{ background: '#5B65DC' }}>
                {user?.name?.[0] ?? 'A'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11.5px] font-semibold truncate" style={{ color: '#111827' }}>{user?.name}</div>
                <div className="text-[9.5px] truncate" style={{ color: '#9CA3AF' }}>Helpdesk</div>
              </div>
              <button onClick={handleLogout} title="Sign out"
                className="w-6 h-6 flex items-center justify-center rounded bg-transparent border-0 cursor-pointer shrink-0"
                style={{ color: '#9CA3AF' }}>
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

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center gap-3 shrink-0 bg-white px-5"
          style={{ height: 52, borderBottom: '1px solid #E4E8EF' }}>
          <button
            onClick={() => setMobileOpen(v => !v)}
            className="lg:hidden flex items-center justify-center bg-transparent border-0 cursor-pointer rounded mr-1 shrink-0"
            style={{ width: 32, height: 32, border: '1px solid #E4E8EF', color: '#64748B' }}
            aria-label="Toggle sidebar">
            <span className="material-icons-outlined" style={{ fontSize: 18 }}>menu</span>
          </button>
          <div className="flex items-center gap-1.5 text-[12.5px] flex-1 min-w-0">
            <span className="material-icons-outlined" style={{ fontSize: 15, color: '#CBD5E1' }}>home</span>
            <span className="hidden sm:inline" style={{ color: '#CBD5E1' }}>/</span>
            <span className="hidden sm:inline" style={{ color: '#94A3B8' }}>Helpdesk</span>
            <span className="hidden sm:inline" style={{ color: '#CBD5E1' }}>/</span>
            <span className="font-semibold truncate" style={{ color: '#122056' }}>{activeNav?.label ?? 'Dashboard'}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {/* Live clock */}
            <div className="hidden md:block text-[11.5px] font-medium px-2.5 py-1 rounded"
              style={{ background: '#F4F6F9', color: '#64748B', borderRadius: 6 }}>
              {dateStr} · {timeStr}
            </div>

            {/* Notifications bell + dropdown */}
            <div className="relative" ref={notifRef}>
              <button onClick={openNotif}
                aria-label={`Notifications${unread > 0 ? ` (${unread} unread)` : ''}`}
                aria-expanded={notifOpen}
                aria-haspopup="true"
                className="w-8 h-8 flex items-center justify-center relative bg-transparent border-0 cursor-pointer rounded"
                style={{ border: '1px solid #E4E8EF', color: '#64748B', borderRadius: 6 }}>
                <span className="material-icons-outlined" style={{ fontSize: 17 }} aria-hidden="true">notifications_none</span>
                {unread > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white flex items-center justify-center"
                    style={{ background: '#DC2626', fontSize: 8, fontWeight: 700 }}>
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-12 z-[200] bg-white rounded-lg overflow-hidden"
                  style={{ width: 320, border: '1px solid #E4E8EF', boxShadow: '0 8px 32px rgba(0,0,0,.12)', marginRight: '-4px' }}>
                  <div className="flex items-center justify-between px-4 py-3"
                    style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <span className="text-[13px] font-bold" style={{ color: '#111827' }}>Notifications</span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded"
                      style={{ background: '#ECFDF5', color: '#16A34A', borderRadius: 4 }}>All read</span>
                  </div>
                  <div className="overflow-y-auto" style={{ maxHeight: 340 }}>
                    {ACTIVITY_LOG.map(log => {
                      const meta = ACTIVITY_ICON[log.type];
                      return (
                        <div key={log.id} className="flex gap-3 px-4 py-3"
                          style={{ borderBottom: '1px solid #F8FAFC' }}>
                          <div className="w-7 h-7 rounded flex items-center justify-center shrink-0"
                            style={{ background: `${meta.color}18`, borderRadius: 6 }}>
                            <span className="material-icons-outlined" style={{ fontSize: 14, color: meta.color }}>{meta.icon}</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-[12px] leading-[1.45]" style={{ color: '#374151' }}>{log.action}</div>
                            <div className="text-[11px] mt-0.5" style={{ color: '#9CA3AF' }}>{log.user} · {log.time}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Online/offline */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded"
              style={{ background: online ? '#ECFDF5' : '#FEF2F2', borderRadius: 6 }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: online ? '#16A34A' : '#EF4444' }} />
              <span className="text-[11.5px] font-semibold" style={{ color: online ? '#16A34A' : '#EF4444' }}>
                {online ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>

        {/* Event banner */}
        {!bannerDismissed && (
          <div className="shrink-0 flex items-center gap-3 px-5 py-2.5"
            style={{ background: 'linear-gradient(90deg,#FFFBEB,#FEF9EE)', borderBottom: '1px solid #FDE68A' }}>
            <span className="material-icons-outlined shrink-0" style={{ fontSize: 17, color: '#D97706' }}>campaign</span>
            <div className="flex-1 text-[12px] leading-snug" style={{ color: '#92400E' }}>
              <strong>System Notice:</strong> MedPoint HIS scheduled maintenance on <strong>July 5, 2026 · 10PM–2AM PHT</strong>. All services temporarily unavailable during this window.
            </div>
            <button onClick={() => setBannerDismissed(true)} aria-label="Dismiss notice"
              className="w-6 h-6 flex items-center justify-center border-0 cursor-pointer shrink-0"
              style={{ background: 'transparent', color: '#D97706', borderRadius: 4 }}>
              <span className="material-icons-outlined" style={{ fontSize: 16 }}>close</span>
            </button>
          </div>
        )}

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

      {/* Toast notifications */}
      <div className="fixed bottom-5 right-5 z-999 flex flex-col gap-2 pointer-events-none"
        aria-live="polite" aria-atomic="false">
        {toasts.map(t => {
          const cfg = {
            success: { bg: '#ECFDF5', border: '#BBF7D0', text: '#15803D', icon: 'check_circle' },
            error:   { bg: '#FEF2F2', border: '#FEE2E2', text: '#DC2626', icon: 'error'        },
            warning: { bg: '#FFFBEB', border: '#FDE68A', text: '#92400E', icon: 'warning'      },
            info:    { bg: '#F0F9FF', border: '#BAE6FD', text: '#0369A1', icon: 'info'         },
          }[t.type];
          return (
            <div key={t.id} role="status"
              className="flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg pointer-events-auto"
              style={{
                background: cfg.bg, border: `1px solid ${cfg.border}`,
                color: cfg.text, minWidth: 260, maxWidth: 400,
                fontFamily: "'Poppins',sans-serif",
              }}>
              <span className="material-icons-outlined shrink-0" style={{ fontSize: 18 }}>{cfg.icon}</span>
              <span className="text-[13px] font-semibold flex-1">{t.message}</span>
              <button onClick={() => removeToast(t.id)} aria-label="Dismiss notification"
                className="w-5 h-5 flex items-center justify-center bg-transparent border-0 cursor-pointer shrink-0"
                style={{ color: cfg.text, opacity: 0.6 }}>
                <span className="material-icons-outlined" style={{ fontSize: 14 }}>close</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
