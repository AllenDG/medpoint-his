import React from 'react';
import { PortalActions } from '../../hooks/usePortalState';
import { SERVICES_DETAILED } from '../../data/constants';

interface Props { actions: PortalActions; }

export function ServicesPage({ actions }: Props) {
  return (
    <>
      <section className="py-[72px] pb-16 text-center" style={{ background: '#122056' }}>
        <div className="max-w-[700px] mx-auto px-10">
          <div className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1 mb-4" style={{ background: 'rgba(91,101,220,.25)', border: '1px solid rgba(91,101,220,.4)' }}>
            <span className="text-[11px] font-semibold uppercase tracking-[.08em]" style={{ color: '#A5B0FF' }}>Our Services</span>
          </div>
          <h1 className="font-extrabold text-white leading-[1.1] tracking-[-0.025em] mb-[14px]" style={{ fontSize: 'clamp(28px,5vw,50px)' }}>
            Comprehensive medical care under one roof.
          </h1>
        </div>
      </section>

      <section style={{ background: '#F4F6F9', padding: '88px 0' }}>
        <div className="max-w-[1440px] mx-auto px-10 grid gap-4 svc-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
          {SERVICES_DETAILED.map(svc => (
            <div key={svc.name} className="svc-card">
              <div className="px-6 py-[22px] pb-[18px] flex items-center gap-[14px]" style={{ background: '#122056' }}>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(91,101,220,.3)' }}>
                  <span className="material-icons-outlined text-2xl" style={{ color: '#A5B0FF' }}>{svc.icon}</span>
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-white mb-[3px]">{svc.name}</h3>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded" style={{ color: 'rgba(255,255,255,.5)', background: 'rgba(255,255,255,.1)' }}>{svc.tag}</span>
                </div>
              </div>
              <div className="px-6 py-5 pb-6">
                <p className="text-sm leading-[1.7] mb-3" style={{ color: '#475569' }}>{svc.desc}</p>
                <div className="flex flex-col gap-1.5 mb-[18px]">
                  {svc.bullets.map(b => (
                    <div key={b} className="flex items-center gap-[7px] text-[13px] font-medium" style={{ color: '#122056' }}>
                      <span className="material-icons-outlined text-sm flex-shrink-0" style={{ color: '#5B65DC' }}>check_circle</span>
                      {b}
                    </div>
                  ))}
                </div>
                <button onClick={actions.goBook} className="btn-p h-10 px-5 text-[13.5px] w-full justify-center">
                  <span className="material-icons-outlined text-[15px]">calendar_today</span>Book this Service
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
