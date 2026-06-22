import React from 'react';
import { Screen } from '@/features/public-site/types';
import { PortalActions } from '@/features/public-site/hooks/usePortalState';

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
  return (
    <header
      className="fixed left-0 right-0 z-[400] bg-white transition-[top] duration-300"
      style={{ top: annOffset, borderBottom: '1px solid #E4E8EF', boxShadow: '0 2px 16px rgba(18,32,86,.06)' }}
    >
      <div className="max-w-[1440px] mx-auto px-10 h-16 flex items-center">
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
                className="absolute top-16 left-0 w-[480px] bg-white rounded-lg p-5 z-[500]"
                style={{ boxShadow: '0 12px 40px rgba(18,32,86,.14)', border: '1px solid #E4E8EF' }}
                onMouseEnter={actions.openDrMenu}
                onMouseLeave={actions.closeMenus}
              >
                <div className="grid grid-cols-2 gap-5 mb-[14px]">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[.07em] mb-2" style={{ color: '#94A3B8' }}>By Specialty</p>
                    {['Cardiology','Neurology','Orthopedics','Pediatrics'].map(sp => (
                      <button key={sp} onClick={actions.goBook} className="dd-item">
                        <span className="material-icons-outlined text-[15px]" style={{ color: '#5B65DC' }}>favorite</span>
                        {sp}
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
                        <span className="material-icons-outlined text-[15px]" style={{ color: '#5B65DC' }}>{q.icon}</span>
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

        {/* Desktop CTA */}
        <div className="desk items-center gap-2 ml-auto flex-shrink-0">
          <button onClick={actions.goBook} className="btn-p h-10 px-5 text-sm" data-tip="Book an appointment online">
            <span className="material-icons-outlined text-base">calendar_today</span>
            Book Now
          </button>
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
