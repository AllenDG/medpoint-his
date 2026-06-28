import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen } from '@/features/public-site/types';
import { PortalActions } from '@/features/public-site/hooks/usePortalState';
import { useAuthStore } from '@/features/auth/store/auth.store';

interface Props {
  screen: Screen;
  annOffset: number;
  isDrOpen: boolean;
  actions: PortalActions;
}

const NAV_LINKS: { label: string; screen: Screen; action: keyof PortalActions }[] = [
  { label: 'Home',         screen: 'home',     action: 'goHome' },
  { label: 'About Us',     screen: 'about',    action: 'goAbout' },
  { label: 'Our Services', screen: 'services', action: 'goServices' },
  { label: 'News',         screen: 'news',     action: 'goNews' },
  { label: 'Contact Us',   screen: 'contact',  action: 'goContact' },
];

export function Navbar({ screen, annOffset, isDrOpen, actions }: Props) {
  const navigate  = useNavigate();
  const user      = useAuthStore(s => s.user);
  const clearAuth = useAuthStore(s => s.clearAuth);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const dashboardPath =
    user?.role === 'HELPDESK' || user?.role === 'ADMIN' ? '/helpdesk' :
    user?.role === 'NURSE' ? `/nurse/${user.id}` : null;

  function handleLogout() {
    clearAuth();
    setUserMenuOpen(false);
  }

  return (
    <header
      className="fixed left-0 right-0 z-[400] bg-white transition-[top] duration-300"
      style={{ top: annOffset, borderBottom: '1px solid #E4E8EF', boxShadow: '0 2px 16px rgba(18,32,86,.06)' }}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center">
        {/* Logo */}
        <button
          onClick={actions.goHome}
          className="bg-transparent border-0 cursor-pointer flex items-center flex-shrink-0 mr-8 p-0 gap-2"
          aria-label="MedPoint Hospital home"
        >
          <img src="/images/medpoint_logo.png" alt="MedPoint Hospital" className="h-9 w-auto" />
        </button>

        {/* Desktop nav */}
        <div className="desk items-stretch flex-1 gap-0">
          {NAV_LINKS.map(link => (
            <button
              key={link.label}
              onClick={actions[link.action] as () => void}
              className={`nav-link ${screen === link.screen ? 'active' : ''}`}
            >
              {link.label}
            </button>
          ))}

          {/* Find a Doctor mega-menu */}
          <div
            className="relative flex"
            onMouseEnter={actions.openDrMenu}
            onMouseLeave={actions.closeMenus}
          >
            <button className={`nav-link ${screen === 'book' ? 'active' : ''}`}>
              Find a Doctor
              <span className="material-icons-outlined text-[15px]">expand_more</span>
            </button>

            {isDrOpen && (
              <div
                className="absolute top-16 left-0 w-[500px] bg-white rounded-2xl p-5 z-[500]"
                style={{ boxShadow: '0 16px 48px rgba(18,32,86,.16)', border: '1.5px solid #E4E8EF' }}
                onMouseEnter={actions.openDrMenu}
                onMouseLeave={actions.closeMenus}
              >
                <div className="grid grid-cols-2 gap-5 mb-[14px]">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[.07em] mb-2" style={{ color: '#94A3B8' }}>By Specialty</p>
                    {[
                      { label: 'Cardiology',  icon: 'favorite' },
                      { label: 'Neurology',   icon: 'psychology' },
                      { label: 'Orthopedics', icon: 'accessibility_new' },
                      { label: 'Pediatrics',  icon: 'child_care' },
                    ].map(sp => (
                      <button key={sp.label} onClick={actions.goBook} className="dd-item">
                        <span className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#EEEFFD' }}>
                          <span className="material-icons-outlined text-[14px]" style={{ color: '#5B65DC' }}>{sp.icon}</span>
                        </span>
                        {sp.label}
                      </button>
                    ))}
                    <button onClick={actions.goBook} className="flex items-center px-3 py-1.5 text-[13px] font-semibold bg-transparent border-0 cursor-pointer w-full text-left" style={{ color: '#5B65DC', fontFamily: "'Poppins',sans-serif" }}>
                      View all specialties →
                    </button>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[.07em] mb-2" style={{ color: '#94A3B8' }}>Quick Actions</p>
                    {[
                      { icon: 'timer',            label: 'Live Queue Status' },
                      { icon: 'pending_actions',  label: 'Check Appointment' },
                      { icon: 'medical_services', label: 'All Services' },
                    ].map(q => (
                      <button key={q.label} onClick={actions.goBook} className="dd-item">
                        <span className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#EEEFFD' }}>
                          <span className="material-icons-outlined text-[14px]" style={{ color: '#5B65DC' }}>{q.icon}</span>
                        </span>
                        {q.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-[10px] rounded-lg px-3 py-[10px]" style={{ background: '#F4F6F9', borderTop: '1px solid #E4E8EF' }}>
                  <span className="material-icons-outlined text-[17px]" style={{ color: '#94A3B8' }}>search</span>
                  <input
                    type="text"
                    placeholder="Search by doctor name or specialty…"
                    className="flex-1 border-0 bg-transparent text-sm outline-none"
                    style={{ fontFamily: "'Poppins',sans-serif", color: '#122056' }}
                  />
                  <button onClick={actions.goBook} className="btn-p h-8 px-[14px] text-[13px]">Search</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Desktop CTA — auth-aware */}
        <div className="desk items-center gap-2 ml-auto flex-shrink-0">
          {!user ? (
            /* Not logged in → Login button */
            <button
              onClick={() => navigate('/login')}
              className="btn-p h-10 px-5 text-sm"
            >
              <span className="material-icons-outlined text-base">login</span>
              Login
            </button>
          ) : dashboardPath ? (
            /* Staff user → Go to Dashboard */
            <button
              onClick={() => navigate(dashboardPath)}
              className="btn-p h-10 px-5 text-sm"
            >
              <span className="material-icons-outlined text-base">dashboard</span>
              Dashboard
            </button>
          ) : (
            /* Patient → avatar + dropdown */
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(v => !v)}
                className="flex items-center gap-2 h-10 px-3 rounded-xl border-0 cursor-pointer transition-colors"
                style={{ background: '#F4F6F9', border: '1.5px solid #E4E8EF', fontFamily: "'Poppins',sans-serif" }}
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: '#5B65DC' }}>
                  {user.name[0]}
                </div>
                <span className="text-[13.5px] font-semibold" style={{ color: '#122056' }}>
                  {user.name.split(' ')[0]}
                </span>
                <span className="material-icons-outlined text-[16px]" style={{ color: '#94A3B8' }}>expand_more</span>
              </button>

              {userMenuOpen && (
                <div
                  className="absolute top-12 right-0 bg-white rounded-xl py-1.5 z-[600] min-w-[200px]"
                  style={{ boxShadow: '0 12px 40px rgba(18,32,86,.14)', border: '1.5px solid #E4E8EF' }}
                >
                  <div className="px-4 py-2.5 mb-1" style={{ borderBottom: '1px solid #E4E8EF' }}>
                    <div className="text-[13px] font-semibold" style={{ color: '#122056' }}>{user.name}</div>
                    <div className="text-[11.5px]" style={{ color: '#94A3B8' }}>{user.email}</div>
                  </div>
                  {[
                    { icon: 'calendar_today', label: 'My Appointments', action: actions.goBook },
                    { icon: 'person_outline', label: 'My Profile',       action: actions.goBook },
                  ].map(item => (
                    <button
                      key={item.label}
                      onClick={() => { item.action(); setUserMenuOpen(false); }}
                      className="dd-item w-full"
                    >
                      <span className="material-icons-outlined text-[15px]" style={{ color: '#5B65DC' }}>{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                  <div style={{ borderTop: '1px solid #E4E8EF', marginTop: 4, paddingTop: 4 }}>
                    <button
                      onClick={handleLogout}
                      className="dd-item w-full"
                      style={{ color: '#DC2626' }}
                    >
                      <span className="material-icons-outlined text-[15px]">logout</span>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="mob ml-auto items-center justify-center bg-transparent cursor-pointer rounded-lg w-10 h-10"
          onClick={actions.toggleMobile}
          style={{ border: '1.5px solid #E4E8EF', color: '#122056' }}
          aria-label="Menu"
        >
          <span className="material-icons-outlined text-[22px]">menu</span>
        </button>
      </div>
    </header>
  );
}
