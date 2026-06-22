import React from 'react';
import { PortalActions } from '../../hooks/usePortalState';
import { BRANCHES } from '../../data/constants';

interface Props { actions: PortalActions; }

export function ContactPage({ actions }: Props) {
  return (
    <>
      <section className="py-[72px] pb-16 text-center" style={{ background: '#122056' }}>
        <div className="max-w-[700px] mx-auto px-10">
          <div className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1 mb-4" style={{ background: 'rgba(91,101,220,.25)', border: '1px solid rgba(91,101,220,.4)' }}>
            <span className="text-[11px] font-semibold uppercase tracking-[.08em]" style={{ color: '#A5B0FF' }}>Contact</span>
          </div>
          <h1 className="font-extrabold text-white leading-[1.1] tracking-[-0.025em] mb-[14px]" style={{ fontSize: 'clamp(28px,5vw,50px)' }}>
            We're here to help you.
          </h1>
        </div>
      </section>

      <section style={{ background: '#F4F6F9', padding: '64px 0 80px' }}>
        <div className="max-w-[1440px] mx-auto px-10 grid gap-12 contact-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          {/* Contact form */}
          <div className="bg-white rounded-lg p-9" style={{ border: '1px solid #E4E8EF' }}>
            <h2 className="text-xl font-extrabold mb-1.5" style={{ color: '#122056' }}>Send us a message</h2>
            <p className="text-sm mb-6" style={{ color: '#94A3B8' }}>We'll reply within 1 business day.</p>
            <div className="flex flex-col gap-[14px]">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12.5px] font-semibold mb-1.5" style={{ color: '#122056' }}>Full name</label>
                  <input type="text" className="f-input" placeholder="Enter your full name" />
                </div>
                <div>
                  <label className="block text-[12.5px] font-semibold mb-1.5" style={{ color: '#122056' }}>
                    Phone <span className="text-[11px] font-normal" style={{ color: '#94A3B8' }}>(Optional)</span>
                  </label>
                  <input type="tel" className="f-input" placeholder="+63 912 345 6789" />
                </div>
              </div>
              <div>
                <label className="block text-[12.5px] font-semibold mb-1.5" style={{ color: '#122056' }}>Email</label>
                <input type="email" className="f-input" placeholder="Enter your email" />
              </div>
              <div>
                <label className="block text-[12.5px] font-semibold mb-1.5" style={{ color: '#122056' }}>
                  Branch <span className="text-[11px] font-normal" style={{ color: '#94A3B8' }}>(Optional)</span>
                </label>
                <select className="f-select">
                  <option value="">Select branch or concern</option>
                  {['City Clinic', 'North Branch', 'East Clinic', 'West Branch', 'South Clinic', 'General Inquiry'].map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[12.5px] font-semibold mb-1.5" style={{ color: '#122056' }}>Message</label>
                <textarea className="f-textarea" placeholder="How can we help you?" />
              </div>
            </div>
            <button onClick={actions.sendMessage} className="btn-p w-full h-12 text-[15px] font-bold mt-[18px] justify-center">
              <span className="material-icons-outlined text-[18px]">send</span>Send Message
            </button>
          </div>

          {/* Contact info */}
          <div className="flex flex-col gap-[14px]">
            {/* Emergency */}
            <div className="rounded-lg p-[26px]" style={{ background: '#122056' }}>
              <h3 className="text-[15px] font-bold text-white mb-4">Emergency Hotline</h3>
              <div className="flex items-center gap-3">
                <div className="w-[42px] h-[42px] rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(91,101,220,.3)' }}>
                  <span className="material-icons-outlined text-xl" style={{ color: '#A5B0FF' }}>emergency</span>
                </div>
                <div>
                  <div className="text-xl font-extrabold text-white">(02) 8911-2345</div>
                  <div className="text-[12px]" style={{ color: 'rgba(255,255,255,.6)' }}>Available 24 hours · 7 days</div>
                </div>
              </div>
            </div>

            {/* Contact info card */}
            <div className="card p-[22px]">
              <h3 className="text-[14.5px] font-bold mb-[14px]" style={{ color: '#122056' }}>Contact Information</h3>
              <div className="flex flex-col gap-[11px]">
                {[
                  { icon: 'call',         main: '(02) 8123-4567',         sub: 'Mon–Sat 8AM–8PM' },
                  { icon: 'emergency',    main: '(02) 8911-2345',         sub: '24-hour hotline' },
                  { icon: 'mail_outline', main: 'info@medpoint.ph',       sub: 'appointments@medpoint.ph' },
                  { icon: 'location_on',  main: 'E. Rodriguez Sr. Ave., Quezon City', sub: 'Metro Manila, Philippines' },
                ].map(c => (
                  <div key={c.main} className="flex items-start gap-[10px]">
                    <span className="material-icons-outlined text-[17px] flex-shrink-0 mt-px" style={{ color: '#5B65DC' }}>{c.icon}</span>
                    <div>
                      <div className="text-[13.5px] font-semibold" style={{ color: '#122056' }}>{c.main}</div>
                      <div className="text-[12px]" style={{ color: '#94A3B8' }}>{c.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Branches */}
            <div className="card p-[22px]">
              <h3 className="text-[14.5px] font-bold mb-[14px]" style={{ color: '#122056' }}>Clinic Branches</h3>
              <div className="flex flex-col gap-2">
                {BRANCHES.map(br => (
                  <div key={br.name} className="flex items-center justify-between px-3 py-[9px] rounded-lg" style={{ background: '#F4F6F9' }}>
                    <div>
                      <div className="text-[13px] font-semibold" style={{ color: '#122056' }}>{br.name}</div>
                      <div className="text-[11.5px]" style={{ color: '#94A3B8' }}>{br.address}</div>
                    </div>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded" style={{ color: '#5B65DC', background: '#EEEFFD' }}>{br.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
