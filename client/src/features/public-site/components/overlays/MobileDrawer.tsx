import React from 'react';
import { Screen } from '../../types';
import { PortalActions } from '../../hooks/usePortalState';

interface Props {
  open: boolean;
  screen: Screen;
  actions: PortalActions;
}

const NAV_ITEMS: { label: string; screen: Screen; key: keyof PortalActions }[] = [
  { label: 'Home',       screen: 'home',     key: 'goHome' },
  { label: 'About Us',   screen: 'about',    key: 'goAbout' },
  { label: 'Our Services', screen: 'services', key: 'goServices' },
  { label: 'News',       screen: 'news',     key: 'goNews' },
  { label: 'Contact Us', screen: 'contact',  key: 'goContact' },
];

export function MobileDrawer({ open, screen, actions }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[500]" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(18,32,86,.45)' }}
        onClick={actions.closeMobile}
        aria-hidden="true"
      />
      <div
        className="drawer-enter absolute top-0 right-0 bottom-0 w-[280px] bg-white flex flex-col"
        style={{ boxShadow: '-20px 0 60px rgba(18,32,86,.15)' }}
      >
        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between flex-shrink-0" style={{ borderBottom: '1px solid #E4E8EF' }}>
          <div className="flex items-center gap-2">
            <img src="/images/medpoint_logo.png" alt="MedPoint Hospital" className="h-8 w-auto" />
          </div>
          <button onClick={actions.closeMobile} className="flex items-center bg-transparent border-0 cursor-pointer" aria-label="Close">
            <span className="material-icons-outlined text-[22px]" style={{ color: '#475569' }}>close</span>
          </button>
        </div>

        {/* Nav items */}
        <div className="p-[10px] flex flex-col gap-0.5 flex-1 overflow-y-auto">
          {NAV_ITEMS.map(item => (
            <button
              key={item.key}
              onClick={(actions[item.key] as () => void)}
              className="text-left px-[14px] py-3 rounded-lg text-[15px] font-medium cursor-pointer bg-transparent"
              style={{
                fontFamily: "'Poppins',sans-serif",
                color: '#122056',
                borderLeft: screen === item.screen ? '3px solid #5B65DC' : '3px solid transparent',
                borderTop: 'none', borderRight: 'none', borderBottom: 'none',
              }}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={actions.goBook}
            className="text-left px-[14px] py-3 rounded-lg text-[15px] font-semibold cursor-pointer bg-transparent border-0"
            style={{ fontFamily: "'Poppins',sans-serif", color: '#5B65DC' }}
          >
            Find a Doctor →
          </button>
        </div>

        {/* CTA */}
        <div className="px-4 py-[14px] flex-shrink-0" style={{ borderTop: '1px solid #E4E8EF' }}>
          <button onClick={actions.goBook} className="btn-p w-full h-[46px] text-sm justify-center">
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
}
