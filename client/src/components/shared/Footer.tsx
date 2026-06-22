import React from 'react';
import { PortalActions } from '@/features/public-site/hooks/usePortalState';

interface Props { actions: PortalActions; }

const FOOTER_LINKS = {
  'Quick Links': [
    { label: 'Home',           action: 'goHome'     as const },
    { label: 'About Us',       action: 'goAbout'    as const },
    { label: 'Our Services',   action: 'goServices' as const },
    { label: 'News',           action: 'goNews'     as const },
    { label: 'Contact Us',     action: 'goContact'  as const },
  ],
  'Patient Services': [
    { label: 'Book Appointment',   action: 'goBook'    as const },
    { label: 'Find a Doctor',      action: 'goBook'    as const },
    { label: 'Emergency Services', action: 'goContact' as const },
    { label: 'Insurance',          action: 'goBook'    as const },
    { label: 'Patient Portal',     action: 'goBook'    as const },
  ],
};

const SOCIALS = [
  { icon: 'facebook', label: 'Facebook' },
  { icon: 'twitter',  label: 'Twitter'  },
  { icon: 'linkedin', label: 'LinkedIn' },
  { icon: 'youtube',  label: 'YouTube'  },
];

export function Footer({ actions }: Props) {
  return (
    <footer className="pt-16 pb-8 text-white" style={{ background: '#0B163A' }}>
      <div className="max-w-[1440px] mx-auto px-10">
        <div className="grid gap-10 mb-12" style={{ gridTemplateColumns: '2fr 1fr 1fr 1.2fr' }}>

          {/* Brand */}
          <div>
            <div className="flex items-center mb-4">
              <img src="/images/medpoint_logo.png" alt="MedPoint Hospital" className="h-10 w-auto brightness-0 invert" />
            </div>
            <p className="text-sm leading-[1.75] mb-5" style={{ color: 'rgba(255,255,255,.55)', maxWidth: 280 }}>
              Delivering world-class healthcare with compassion. Your health is our priority — from routine check-ups to complex procedures.
            </p>
            <div className="flex gap-3 mb-6">
              {SOCIALS.map(s => (
                <button key={s.label} aria-label={s.label}
                  className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer border-0 transition-colors"
                  style={{ background: 'rgba(255,255,255,.1)', color: 'rgba(255,255,255,.7)' }}
                >
                  <span className="material-icons-outlined text-[18px]">{s.icon}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-[10px] px-[14px] py-[10px] rounded-xl"
              style={{ background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.12)' }}
            >
              <span className="material-icons-outlined text-[20px]" style={{ color: '#FF4757' }}>emergency</span>
              <div>
                <div className="text-[10.5px] font-semibold uppercase tracking-[.07em] mb-0.5" style={{ color: 'rgba(255,255,255,.45)' }}>Emergency Hotline 24/7</div>
                <div className="text-[17px] font-extrabold tracking-tight">+63 2 8888-MEDI</div>
              </div>
            </div>
          </div>

          {/* Nav cols */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-[12px] font-bold uppercase tracking-[.09em] mb-4" style={{ color: 'rgba(255,255,255,.4)' }}>{heading}</h4>
              <ul className="list-none p-0 m-0 flex flex-col gap-[9px]">
                {links.map(l => (
                  <li key={l.label}>
                    <button
                      onClick={actions[l.action]}
                      className="bg-transparent border-0 cursor-pointer text-sm p-0 text-left transition-colors"
                      style={{ fontFamily: "'Poppins',sans-serif", color: 'rgba(255,255,255,.6)' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,.6)')}
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h4 className="text-[12px] font-bold uppercase tracking-[.09em] mb-4" style={{ color: 'rgba(255,255,255,.4)' }}>Contact Us</h4>
            <div className="flex flex-col gap-3">
              {[
                { icon: 'location_on', text: '123 Medical Drive\nQuezon City, Metro Manila 1100' },
                { icon: 'phone',       text: '+63 2 8888-1234' },
                { icon: 'email',       text: 'info@medpoint.com.ph' },
                { icon: 'schedule',    text: 'Mon–Sat, 6 AM – 9 PM\nER & ICU open 24/7' },
              ].map(item => (
                <div key={item.icon} className="flex gap-[10px]">
                  <span className="material-icons-outlined text-base shrink-0 mt-0.5" style={{ color: '#5B65DC' }}>{item.icon}</span>
                  <span className="text-sm leading-[1.65]" style={{ color: 'rgba(255,255,255,.6)', whiteSpace: 'pre-line' }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between pt-6 text-[12.5px]"
          style={{ borderTop: '1px solid rgba(255,255,255,.1)', color: 'rgba(255,255,255,.35)' }}
        >
          <span>© {new Date().getFullYear()} MedPoint Hospital. All rights reserved.</span>
          <div className="flex gap-5">
            {['Privacy Policy', 'Terms of Service', 'Sitemap'].map(t => (
              <button key={t} className="bg-transparent border-0 cursor-pointer p-0 text-[12.5px]"
                style={{ fontFamily: "'Poppins',sans-serif", color: 'rgba(255,255,255,.35)' }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
