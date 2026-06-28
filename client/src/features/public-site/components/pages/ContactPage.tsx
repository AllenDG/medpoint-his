import React, { useState } from 'react';
import { PortalActions } from '../../hooks/usePortalState';
import { BRANCHES, FAQS } from '../../data/constants';

interface Props { actions: PortalActions; }

export function ContactPage({ actions }: Props) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      {/* ── Hero ── */}
      <section className="py-[80px] pb-[72px] text-center relative overflow-hidden" style={{ background: '#122056' }}>
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle,#fff 1px,transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="max-w-[700px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
          <div className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1 mb-4" style={{ background: 'rgba(91,101,220,.25)', border: '1px solid rgba(91,101,220,.4)' }}>
            <span className="text-[11px] font-semibold uppercase tracking-[.08em]" style={{ color: '#A5B0FF' }}>Contact</span>
          </div>
          <h1 className="font-extrabold text-white leading-[1.1] tracking-[-0.025em] mb-4" style={{ fontSize: 'clamp(28px,5vw,52px)' }}>
            We're here to help you.
          </h1>
          <p className="text-base leading-[1.75] max-w-[520px] mx-auto" style={{ color: 'rgba(255,255,255,.72)' }}>
            Reach out for appointments, insurance queries, branch information, or anything else. Our patient care team responds within 1 business day.
          </p>
          <div className="flex items-center justify-center gap-3 mt-8 flex-wrap">
            <a
              href="tel:+6328881234"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm"
              style={{ background: 'rgba(255,255,255,.12)', border: '1.5px solid rgba(255,255,255,.22)', color: '#fff', textDecoration: 'none', fontFamily: "'Poppins',sans-serif" }}
            >
              <span className="material-icons-outlined text-[16px]">call</span>+63 2 8888-1234
            </a>
            <a
              href="mailto:info@medpoint.com.ph"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm"
              style={{ background: 'rgba(255,255,255,.12)', border: '1.5px solid rgba(255,255,255,.22)', color: '#fff', textDecoration: 'none', fontFamily: "'Poppins',sans-serif" }}
            >
              <span className="material-icons-outlined text-[16px]">mail_outline</span>info@medpoint.com.ph
            </a>
          </div>
        </div>
      </section>

      {/* ── Form + Info ── */}
      <section style={{ background: '#F4F6F9', padding: '72px 0 80px' }}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 grid gap-10 contact-grid">

          {/* Contact form */}
          <div data-animate="" className="bg-white rounded-2xl p-9" style={{ border: '1.5px solid #E4E8EF' }}>
            <div className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1 mb-4" style={{ background: '#EEEFFD', border: '1px solid #C7CAEF' }}>
              <span className="text-[11px] font-bold uppercase tracking-[.07em]" style={{ color: '#5B65DC' }}>Send a Message</span>
            </div>
            <h2 className="text-[20px] font-extrabold mb-1.5" style={{ color: '#122056' }}>How can we help?</h2>
            <p className="text-sm mb-7" style={{ color: '#94A3B8' }}>Fill in the form and our patient care team will reply within 1 business day.</p>
            <div className="flex flex-col gap-[14px]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                <input type="email" className="f-input" placeholder="Enter your email address" />
              </div>
              <div>
                <label className="block text-[12.5px] font-semibold mb-1.5" style={{ color: '#122056' }}>Concern type</label>
                <select className="f-select">
                  <option value="">Select a topic</option>
                  {['Appointment Inquiry','Insurance & Billing','Medical Records','Branch Information','Feedback / Complaint','General Inquiry'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[12.5px] font-semibold mb-1.5" style={{ color: '#122056' }}>
                  Branch <span className="text-[11px] font-normal" style={{ color: '#94A3B8' }}>(Optional)</span>
                </label>
                <select className="f-select">
                  <option value="">Select branch or general</option>
                  {['City Clinic (Main)','North Branch','East Clinic','West Branch','South Clinic','General / All Branches'].map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[12.5px] font-semibold mb-1.5" style={{ color: '#122056' }}>Message</label>
                <textarea className="f-textarea" rows={4} placeholder="Tell us how we can help you…" />
              </div>
            </div>
            <button onClick={actions.sendMessage} className="btn-p w-full justify-center mt-[18px]" style={{ height: 48, fontSize: 15 }}>
              <span className="material-icons-outlined text-[18px]">send</span>Send Message
            </button>
          </div>

          {/* Contact info column */}
          <div data-animate="" data-delay="100" className="flex flex-col gap-4">

            {/* Emergency */}
            <div className="rounded-2xl p-7" style={{ background: '#122056' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,71,87,.2)' }}>
                  <span className="material-icons-outlined text-xl" style={{ color: '#FF4757' }}>emergency</span>
                </div>
                <h3 className="text-[15px] font-bold text-white">Emergency Hotline</h3>
              </div>
              <div className="text-[26px] font-extrabold text-white mb-1">(02) 8911-2345</div>
              <div className="text-[13px]" style={{ color: 'rgba(255,255,255,.55)' }}>Available 24 hours · 7 days a week · ER & ICU</div>
            </div>

            {/* Contact info */}
            <div className="card p-[26px]">
              <h3 className="text-[14.5px] font-bold mb-4" style={{ color: '#122056' }}>Contact Information</h3>
              <div className="flex flex-col gap-4">
                {[
                  { icon: 'call',         main: '(02) 8123-4567',         sub: 'Mon–Sat, 8AM – 8PM' },
                  { icon: 'mail_outline', main: 'info@medpoint.com.ph',    sub: 'appointments@medpoint.com.ph' },
                  { icon: 'location_on',  main: 'E. Rodriguez Sr. Ave., Quezon City', sub: 'Metro Manila 1100, Philippines' },
                  { icon: 'schedule',     main: 'Mon – Saturday',          sub: 'Walk-in: 6AM–9PM · ER: 24/7' },
                ].map(c => (
                  <div key={c.main} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#EEEFFD' }}>
                      <span className="material-icons-outlined text-[17px]" style={{ color: '#5B65DC' }}>{c.icon}</span>
                    </div>
                    <div>
                      <div className="text-[13.5px] font-semibold" style={{ color: '#122056' }}>{c.main}</div>
                      <div className="text-[12px]" style={{ color: '#94A3B8' }}>{c.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social links */}
            <div className="card p-[22px]">
              <h3 className="text-[13px] font-bold mb-3" style={{ color: '#122056' }}>Follow Us</h3>
              <div className="flex gap-2">
                {[
                  { icon: 'facebook', label: 'Facebook' },
                  { icon: 'twitter',  label: 'Twitter' },
                  { icon: 'linkedin', label: 'LinkedIn' },
                  { icon: 'youtube',  label: 'YouTube' },
                ].map(s => (
                  <button
                    key={s.label}
                    aria-label={s.label}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12.5px] font-semibold cursor-pointer border-0 transition-colors"
                    style={{ background: '#F4F6F9', color: '#475569', fontFamily: "'Poppins',sans-serif" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#EEEFFD'; (e.currentTarget as HTMLButtonElement).style.color = '#5B65DC'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#F4F6F9'; (e.currentTarget as HTMLButtonElement).style.color = '#475569'; }}
                  >
                    <span className="material-icons-outlined text-[15px]">{s.icon}</span>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Branch Locations ── */}
      <section className="bg-white py-[80px]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div data-animate="" className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1 mb-3" style={{ background: '#EEEFFD', border: '1px solid #C7CAEF' }}>
              <span className="text-[11px] font-bold uppercase tracking-[.07em]" style={{ color: '#5B65DC' }}>Branch Locations</span>
            </div>
            <h2 className="font-extrabold tracking-[-0.025em]" style={{ fontSize: 'clamp(20px,3vw,34px)', color: '#122056' }}>
              Find the branch nearest to you.
            </h2>
          </div>
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
            {BRANCHES.map((br, i) => (
              <div key={br.name} className="card p-6" data-animate="" data-delay={String(i * 60)}>
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#EEEFFD' }}>
                    <span className="material-icons-outlined text-[19px]" style={{ color: '#5B65DC' }}>location_on</span>
                  </div>
                  <div>
                    <div className="text-[14px] font-bold" style={{ color: '#122056' }}>{br.name}</div>
                    <div className="text-[12px] mt-0.5" style={{ color: '#64748B' }}>{br.address}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-4" style={{ borderTop: '1px solid #E4E8EF' }}>
                  <span className="material-icons-outlined text-[14px]" style={{ color: '#16A34A' }}>schedule</span>
                  <span className="text-[12.5px] font-semibold" style={{ color: '#16A34A' }}>{br.hours}</span>
                  <span className="ml-auto text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: '#ECFDF5', color: '#16A34A' }}>Open</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ background: '#F4F6F9', padding: '80px 0' }}>
        <div className="max-w-[820px] mx-auto px-4 sm:px-6 lg:px-10">
          <div data-animate="" className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1 mb-3" style={{ background: '#EEEFFD', border: '1px solid #C7CAEF' }}>
              <span className="text-[11px] font-bold uppercase tracking-[.07em]" style={{ color: '#5B65DC' }}>FAQ</span>
            </div>
            <h2 className="font-extrabold tracking-[-0.025em] mb-3" style={{ fontSize: 'clamp(20px,3vw,34px)', color: '#122056' }}>
              Frequently Asked Questions
            </h2>
            <p className="text-[15px]" style={{ color: '#64748B' }}>
              Can't find the answer? <button onClick={actions.sendMessage} className="bg-transparent border-0 cursor-pointer p-0 text-[15px] font-semibold underline" style={{ color: '#5B65DC', fontFamily: "'Poppins',sans-serif" }}>Send us a message</button>
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className={`faq-item${openFaq === i ? ' open' : ''}`}
                data-animate=""
                data-delay={String(i * 50)}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-[18px] bg-transparent border-0 cursor-pointer text-left"
                  style={{ fontFamily: "'Poppins',sans-serif" }}
                >
                  <span className="text-[14.5px] font-semibold" style={{ color: '#122056' }}>{faq.q}</span>
                  <span
                    className="material-icons-outlined flex-shrink-0 text-[20px] transition-transform"
                    style={{
                      color: openFaq === i ? '#5B65DC' : '#94A3B8',
                      transform: openFaq === i ? 'rotate(180deg)' : 'none',
                    }}
                  >
                    expand_more
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6" style={{ borderTop: '1px solid #E4E8EF' }}>
                    <p className="text-[13.5px] leading-[1.75] pt-4" style={{ color: '#475569' }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
