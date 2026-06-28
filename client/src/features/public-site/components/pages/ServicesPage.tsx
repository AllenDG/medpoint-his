import React from 'react';
import { PortalActions } from '../../hooks/usePortalState';
import { SERVICES_DETAILED, PROCESS_STEPS, INS_PARTNERS } from '../../data/constants';

interface Props { actions: PortalActions; }

export function ServicesPage({ actions }: Props) {
  return (
    <>
      {/* ── Hero ── */}
      <section className="py-[80px] pb-[72px] text-center relative overflow-hidden" style={{ background: '#122056' }}>
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle,#fff 1px,transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="max-w-[720px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
          <div className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1 mb-4" style={{ background: 'rgba(91,101,220,.25)', border: '1px solid rgba(91,101,220,.4)' }}>
            <span className="text-[11px] font-semibold uppercase tracking-[.08em]" style={{ color: '#A5B0FF' }}>Our Services</span>
          </div>
          <h1 className="font-extrabold text-white leading-[1.1] tracking-[-0.025em] mb-4" style={{ fontSize: 'clamp(28px,5vw,52px)' }}>
            Comprehensive medical care<br />under one roof.
          </h1>
          <p className="text-base leading-[1.75] max-w-[560px] mx-auto" style={{ color: 'rgba(255,255,255,.75)' }}>
            From routine consultations to complex specialist procedures — all available at your nearest MedPoint branch, insurance pre-verified, bookable in minutes.
          </p>
        </div>
      </section>

      {/* ── Service Cards ── */}
      <section style={{ background: '#F4F6F9', padding: '88px 0' }}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div data-animate="" className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1 mb-3" style={{ background: '#EEEFFD', border: '1px solid #C7CAEF' }}>
              <span className="text-[11px] font-bold uppercase tracking-[.07em]" style={{ color: '#5B65DC' }}>All Services</span>
            </div>
            <h2 className="font-extrabold tracking-[-0.025em] mb-3" style={{ fontSize: 'clamp(20px,3vw,36px)', color: '#122056' }}>
              Specialist care for every need.
            </h2>
            <p className="text-[15px] mx-auto" style={{ color: '#64748B', maxWidth: 500 }}>
              Every service is available across all 5 branches, with insurance eligibility verified before your visit.
            </p>
          </div>
          <div className="grid gap-5 svc-grid">
            {SERVICES_DETAILED.map((svc, i) => (
              <div key={svc.name} className="svc-card" data-animate="" data-delay={String(i * 60)}>
                <div className="px-6 py-[22px] pb-[18px] flex items-center gap-[14px]" style={{ background: '#122056' }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(91,101,220,.32)' }}>
                    <span className="material-icons-outlined text-2xl" style={{ color: '#A5B0FF' }}>{svc.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-white mb-[3px]">{svc.name}</h3>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded" style={{ color: 'rgba(255,255,255,.55)', background: 'rgba(255,255,255,.1)' }}>{svc.tag}</span>
                  </div>
                </div>
                <div className="px-6 py-5 pb-6">
                  <p className="text-sm leading-[1.7] mb-4" style={{ color: '#475569' }}>{svc.desc}</p>
                  <div className="flex flex-col gap-[9px] mb-5">
                    {svc.bullets.map(b => (
                      <div key={b} className="flex items-center gap-[8px] text-[13px] font-medium" style={{ color: '#122056' }}>
                        <span className="material-icons-outlined text-sm flex-shrink-0" style={{ color: '#16A34A' }}>check_circle</span>
                        {b}
                      </div>
                    ))}
                  </div>
                  <button onClick={actions.goBook} className="btn-p w-full justify-center" style={{ height: 42, fontSize: 13.5 }}>
                    <span className="material-icons-outlined text-sm">calendar_today</span>Book this Service
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How to Get Started ── */}
      <section className="bg-white py-[88px]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div data-animate="" className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1 mb-3" style={{ background: '#EEEFFD', border: '1px solid #C7CAEF' }}>
              <span className="text-[11px] font-bold uppercase tracking-[.07em]" style={{ color: '#5B65DC' }}>How to Get Started</span>
            </div>
            <h2 className="font-extrabold tracking-[-0.025em] mb-3" style={{ fontSize: 'clamp(20px,3vw,36px)', color: '#122056' }}>
              From search to consultation in minutes.
            </h2>
            <p className="text-[15px] mx-auto" style={{ color: '#64748B', maxWidth: 460 }}>
              No referral letter required. No phone queues. Just search, pick a slot, and show up.
            </p>
          </div>
          <div className="grid gap-6 proc-grid">
            {PROCESS_STEPS.map((step, i) => (
              <div key={step.num} data-animate="" data-delay={String(i * 80)}>
                <div className="rounded-2xl p-7 h-full flex flex-col" style={{ background: '#F4F6F9', border: '1.5px solid #E4E8EF' }}>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-sm" style={{ background: '#EEEFFD', color: '#5B65DC' }}>
                      {step.num}
                    </div>
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: '#5B65DC' }}>
                      <span className="material-icons-outlined text-[22px] text-white">{step.icon}</span>
                    </div>
                  </div>
                  <h3 className="text-[15px] font-bold mb-2" style={{ color: '#122056' }}>{step.title}</h3>
                  <p className="text-[13px] leading-[1.7]" style={{ color: '#64748B' }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div data-animate="" className="text-center mt-10">
            <button onClick={actions.goBook} className="btn-p" style={{ height: 48, paddingLeft: 32, paddingRight: 32, fontSize: 15 }}>
              <span className="material-icons-outlined text-[18px]">search</span>Find a Doctor Now
            </button>
          </div>
        </div>
      </section>

      {/* ── Insurance Partners ── */}
      <section style={{ background: '#122056', padding: '72px 0' }}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div data-animate="" className="text-center mb-10">
            <h2 className="font-extrabold text-white tracking-[-0.025em] mb-3" style={{ fontSize: 'clamp(20px,3vw,34px)' }}>
              We accept your insurance.
            </h2>
            <p className="text-[15px]" style={{ color: 'rgba(255,255,255,.65)', maxWidth: 500, margin: '0 auto' }}>
              Present your card at reception — we verify coverage before your appointment so there are no billing surprises.
            </p>
          </div>
          <div data-animate="" data-delay="80" className="flex flex-wrap justify-center gap-3">
            {INS_PARTNERS.map(ins => (
              <div key={ins.name}
                className="flex items-center gap-[10px] px-5 py-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,.08)', border: '1.5px solid rgba(255,255,255,.15)', color: '#fff', fontFamily: "'Poppins',sans-serif", fontSize: 14, fontWeight: 700 }}
              >
                <span className="material-icons-outlined text-[18px]" style={{ color: '#A5B0FF' }}>{ins.icon}</span>
                {ins.name}
              </div>
            ))}
          </div>
          <div data-animate="" data-delay="160" className="text-center mt-8">
            <p className="text-[13.5px] mb-4" style={{ color: 'rgba(255,255,255,.5)' }}>
              Don't see your insurance? Contact us to confirm your coverage — we may still accept it.
            </p>
            <button onClick={actions.goContact} className="btn-white" style={{ height: 44, paddingLeft: 24, paddingRight: 24, fontSize: 13.5 }}>
              <span className="material-icons-outlined text-[16px]">call</span>Contact for Coverage Check
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
