import React from 'react';
import { MILESTONES, STATS, VALUES } from '../../data/constants';

export function AboutPage() {
  return (
    <>
      {/* Hero banner */}
      <section className="py-[72px] pb-16 text-center" style={{ background: '#122056' }}>
        <div className="max-w-[800px] mx-auto px-10">
          <div className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1 mb-4" style={{ background: 'rgba(91,101,220,.25)', border: '1px solid rgba(91,101,220,.4)' }}>
            <span className="text-[11px] font-semibold uppercase tracking-[.08em]" style={{ color: '#A5B0FF' }}>About MedPoint Hospital</span>
          </div>
          <h1 className="font-extrabold text-white leading-[1.08] tracking-[-0.025em] mb-[14px]" style={{ fontSize: 'clamp(28px,5vw,52px)' }}>
            Trusted care for every Filipino family.
          </h1>
          <p className="text-base leading-[1.7] max-w-[580px] mx-auto" style={{ color: 'rgba(255,255,255,.72)' }}>
            A DOH-accredited hospital serving Metro Manila with compassion and world-class facilities since 2010.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="bg-white py-[88px]">
        <div className="max-w-[1440px] mx-auto px-10 grid gap-[72px] items-center about-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1 mb-4" style={{ background: '#EEEFFD', border: '1px solid #C7CAEF' }}>
              <span className="text-[11px] font-bold uppercase tracking-[.07em]" style={{ color: '#5B65DC' }}>Our Story</span>
            </div>
            <h2 className="font-extrabold leading-[1.1] tracking-[-0.025em] mb-4" style={{ fontSize: 'clamp(22px,3vw,36px)', color: '#122056' }}>
              Built from a commitment to better patient care.
            </h2>
            <p className="text-[15px] leading-[1.75] mb-[14px]" style={{ color: '#475569' }}>
              MedPoint Hospital was founded in 2010 by board-certified physicians who saw a gap: patients needed specialist expertise with genuine, patient-first service.
            </p>
            <p className="text-[15px] leading-[1.75] mb-6" style={{ color: '#475569' }}>
              Over 15 years, we've grown to 5 clinic branches, 50+ specialists, and a fully digital patient experience.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {MILESTONES.map(m => (
                <div key={m.year} className="rounded-lg p-[14px] px-4" style={{ background: '#F4F6F9', borderLeft: '3px solid #5B65DC' }}>
                  <div className="text-[18px] font-extrabold" style={{ color: '#122056' }}>{m.year}</div>
                  <div className="text-[12.5px] mt-[3px] leading-[1.4]" style={{ color: '#475569' }}>{m.event}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg overflow-hidden" style={{ boxShadow: '0 16px 52px rgba(18,32,86,.12)' }}>
            <img src="/images/hero-page.png" alt="MedPoint Hospital" className="w-full h-[360px] object-cover block" />
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ background: '#F4F6F9', padding: '88px 0' }}>
        <div className="max-w-[1440px] mx-auto px-10">
          <div className="text-center mb-11">
            <h2 className="font-extrabold tracking-[-0.025em] mb-[10px]" style={{ fontSize: 'clamp(22px,3vw,36px)', color: '#122056' }}>Our Mission & Values</h2>
          </div>
          <div className="grid gap-[14px] pillar-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
            {VALUES.map(v => (
              <div key={v.title} className="card py-[26px] px-[22px] text-center">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-[14px]" style={{ background: '#EEEFFD' }}>
                  <span className="material-icons-outlined text-2xl" style={{ color: '#5B65DC' }}>{v.icon}</span>
                </div>
                <h3 className="text-[14.5px] font-bold mb-[7px]" style={{ color: '#122056' }}>{v.title}</h3>
                <p className="text-[13px] leading-[1.65]" style={{ color: '#475569' }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: '#122056', padding: '56px 0' }}>
        <div className="max-w-[1440px] mx-auto px-10 grid stat-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
          {STATS.map((st, i) => (
            <div key={st.label} className="text-center py-6 px-4" style={{ borderRight: i < STATS.length - 1 ? '1px solid rgba(255,255,255,.08)' : 'none' }}>
              <div className="text-[34px] font-extrabold text-white tracking-[-0.02em] mb-1">{st.value}</div>
              <div className="text-[12.5px]" style={{ color: 'rgba(255,255,255,.6)' }}>{st.label}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
