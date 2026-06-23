import React from 'react';
import { MILESTONES, STATS, VALUES, TEAM, ACCREDITATIONS } from '../../data/constants';

export function AboutPage() {
  return (
    <>
      {/* ── Hero Banner ── */}
      <section className="py-[80px] pb-[72px] text-center relative overflow-hidden" style={{ background: '#122056' }}>
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle,#fff 1px,transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="max-w-[820px] mx-auto px-10 relative z-10">
          <div className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1 mb-4" style={{ background: 'rgba(91,101,220,.25)', border: '1px solid rgba(91,101,220,.4)' }}>
            <span className="text-[11px] font-semibold uppercase tracking-[.08em]" style={{ color: '#A5B0FF' }}>About MedPoint Hospital</span>
          </div>
          <h1 className="font-extrabold text-white leading-[1.08] tracking-[-0.025em] mb-4" style={{ fontSize: 'clamp(28px,5vw,54px)' }}>
            Trusted care for every<br />Filipino family.
          </h1>
          <p className="text-base leading-[1.75] max-w-[580px] mx-auto" style={{ color: 'rgba(255,255,255,.75)' }}>
            A DOH-accredited, multi-specialty hospital serving Metro Manila with compassion, transparency, and world-class facilities since 2010.
          </p>
          <div className="flex items-center justify-center gap-8 mt-10 flex-wrap">
            {[
              { val: '15+', label: 'Years of Service' },
              { val: '50+', label: 'Specialist Doctors' },
              { val: '5',   label: 'Clinic Branches' },
              { val: '4.9★', label: 'Patient Rating' },
            ].map((s, i) => (
              <React.Fragment key={s.val}>
                {i > 0 && <div className="w-px h-8 hidden md:block" style={{ background: 'rgba(255,255,255,.15)' }} />}
                <div className="text-center">
                  <div className="text-[26px] font-extrabold text-white">{s.val}</div>
                  <div className="text-[11px]" style={{ color: 'rgba(255,255,255,.55)' }}>{s.label}</div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Story ── */}
      <section className="bg-white py-[88px]">
        <div className="max-w-[1440px] mx-auto px-10 grid gap-[72px] items-center about-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div data-animate="">
            <div className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1 mb-4" style={{ background: '#EEEFFD', border: '1px solid #C7CAEF' }}>
              <span className="text-[11px] font-bold uppercase tracking-[.07em]" style={{ color: '#5B65DC' }}>Our Story</span>
            </div>
            <h2 className="font-extrabold leading-[1.1] tracking-[-0.025em] mb-4" style={{ fontSize: 'clamp(22px,3vw,36px)', color: '#122056' }}>
              Built from a commitment<br />to better patient care.
            </h2>
            <p className="text-[15px] leading-[1.75] mb-4" style={{ color: '#475569' }}>
              MedPoint Hospital was founded in 2010 by a group of board-certified physicians who saw a clear gap in Metro Manila's healthcare landscape: patients needed immediate access to genuine specialist expertise — delivered with real, patient-first service and without the red tape.
            </p>
            <p className="text-[15px] leading-[1.75] mb-6" style={{ color: '#475569' }}>
              Over 15 years, we've grown to 5 clinic branches, 50+ specialists, a DOH-accredited facility standard, and a fully digital patient experience. Our growth has always been guided by a single mission: make quality healthcare as accessible as a phone call.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {MILESTONES.map(m => (
                <div key={m.year} className="rounded-xl p-[14px] px-[18px]" style={{ background: '#F4F6F9', borderLeft: '3px solid #5B65DC' }}>
                  <div className="text-[20px] font-extrabold" style={{ color: '#122056' }}>{m.year}</div>
                  <div className="text-[12.5px] mt-[3px] leading-[1.45]" style={{ color: '#475569' }}>{m.event}</div>
                </div>
              ))}
            </div>
          </div>
          <div data-animate="" data-delay="100" className="rounded-2xl overflow-hidden relative" style={{ boxShadow: '0 20px 60px rgba(18,32,86,.13)' }}>
            <img src="/images/hero-page.png" alt="MedPoint Hospital" className="w-full h-[420px] object-cover block" />
            <div className="absolute inset-0 flex items-end p-6 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(18,32,86,.85) 0%, transparent 55%)' }}>
              <div>
                <div className="text-white text-[15px] font-semibold mb-1">DOH-Accredited Facility</div>
                <div className="text-[13px]" style={{ color: 'rgba(255,255,255,.65)' }}>Licensed since 2010 · JCI-standard protocols</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission & Values ── */}
      <section style={{ background: '#F4F6F9', padding: '88px 0' }}>
        <div className="max-w-[1440px] mx-auto px-10">
          <div data-animate="" className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1 mb-3" style={{ background: '#EEEFFD', border: '1px solid #C7CAEF' }}>
              <span className="text-[11px] font-bold uppercase tracking-[.07em]" style={{ color: '#5B65DC' }}>Mission & Values</span>
            </div>
            <h2 className="font-extrabold tracking-[-0.025em] mb-3" style={{ fontSize: 'clamp(22px,3vw,36px)', color: '#122056' }}>Our Mission & Core Values</h2>
            <p className="text-[15px] mx-auto" style={{ color: '#64748B', maxWidth: 500 }}>
              Every decision at MedPoint is guided by four core principles that define how we care for our patients.
            </p>
          </div>
          <div className="grid gap-[14px] pillar-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
            {VALUES.map((v, i) => (
              <div key={v.title} className="card py-[28px] px-[22px] text-center" data-animate="" data-delay={String(i * 80)}>
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-[14px]" style={{ background: '#122056' }}>
                  <span className="material-icons-outlined text-[26px] text-white">{v.icon}</span>
                </div>
                <h3 className="text-[15px] font-bold mb-[8px]" style={{ color: '#122056' }}>{v.title}</h3>
                <p className="text-[13px] leading-[1.65]" style={{ color: '#475569' }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Leadership Team ── */}
      <section className="bg-white py-[88px]">
        <div className="max-w-[1440px] mx-auto px-10">
          <div data-animate="" className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1 mb-3" style={{ background: '#EEEFFD', border: '1px solid #C7CAEF' }}>
              <span className="text-[11px] font-bold uppercase tracking-[.07em]" style={{ color: '#5B65DC' }}>Leadership</span>
            </div>
            <h2 className="font-extrabold tracking-[-0.025em] mb-3" style={{ fontSize: 'clamp(22px,3vw,36px)', color: '#122056' }}>
              Meet the team behind MedPoint.
            </h2>
            <p className="text-[15px] mx-auto" style={{ color: '#64748B', maxWidth: 480 }}>
              Experienced clinicians and healthcare administrators who have spent decades improving patient care in the Philippines.
            </p>
          </div>
          <div className="grid gap-5 team-grid">
            {TEAM.map((member, i) => (
              <div key={member.name} className="team-card" data-animate="" data-delay={String(i * 80)}>
                <div
                  className="w-[72px] h-[72px] rounded-full flex items-center justify-center mx-auto mb-4 text-white text-[22px] font-bold"
                  style={{ background: `hsl(${member.hue} 50% 38%)` }}
                >
                  {member.initials}
                </div>
                <div className="text-[15px] font-bold mb-0.5" style={{ color: '#122056' }}>{member.name}</div>
                <div className="text-[12.5px] font-semibold mb-1" style={{ color: '#5B65DC' }}>{member.role}</div>
                <div className="text-[11.5px] font-medium mb-3" style={{ color: '#94A3B8' }}>{member.creds}</div>
                <p className="text-[13px] leading-[1.65]" style={{ color: '#475569' }}>{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Accreditations ── */}
      <section style={{ background: '#F4F6F9', padding: '72px 0' }}>
        <div className="max-w-[1440px] mx-auto px-10">
          <div data-animate="" className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1 mb-3" style={{ background: '#EEEFFD', border: '1px solid #C7CAEF' }}>
              <span className="text-[11px] font-bold uppercase tracking-[.07em]" style={{ color: '#5B65DC' }}>Certifications</span>
            </div>
            <h2 className="font-extrabold tracking-[-0.025em]" style={{ fontSize: 'clamp(20px,2.5vw,32px)', color: '#122056' }}>
              Recognized, accredited, and certified.
            </h2>
          </div>
          <div data-animate="" data-delay="100" className="flex flex-wrap justify-center gap-4">
            {ACCREDITATIONS.map(acc => (
              <div key={acc.label} className="accred-badge" style={{ minWidth: 170 }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#EEEFFD' }}>
                  <span className="material-icons-outlined text-2xl" style={{ color: '#5B65DC' }}>{acc.icon}</span>
                </div>
                <div className="text-[14px] font-bold" style={{ color: '#122056' }}>{acc.label}</div>
                <div className="text-[11.5px]" style={{ color: '#94A3B8' }}>{acc.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ background: '#122056', padding: '56px 0' }}>
        <div className="max-w-[1440px] mx-auto px-10 grid stat-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
          {STATS.map((st, i) => (
            <div key={st.label} className="text-center py-6 px-4" style={{ borderRight: i < STATS.length - 1 ? '1px solid rgba(255,255,255,.08)' : 'none' }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: 'rgba(91,101,220,.3)' }}>
                <span className="material-icons-outlined text-[22px]" style={{ color: '#A5B0FF' }}>{st.icon}</span>
              </div>
              <div className="text-[36px] font-extrabold text-white tracking-[-0.02em] mb-1">{st.value}</div>
              <div className="text-[13px]" style={{ color: 'rgba(255,255,255,.6)' }}>{st.label}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
