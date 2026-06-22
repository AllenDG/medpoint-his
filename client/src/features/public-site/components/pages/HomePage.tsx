import React from 'react';
import { PortalActions } from '../../hooks/usePortalState';
import { FEATURES, NEWS_ALL, SERVICES, STATS, TESTIMONIALS } from '../../data/constants';

interface Props {
  actions: PortalActions;
}

export function HomePage({ actions }: Props) {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative min-h-[72vh] overflow-hidden">
        <img
          src="/images/hero-page.png"
          alt="MedPoint Hospital"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to right,rgba(18,32,86,.95) 0%,rgba(18,32,86,.78) 36%,rgba(18,32,86,.42) 60%,rgba(18,32,86,.12) 100%)' }}
        />
        <div className="relative z-10 max-w-[1440px] mx-auto px-10 py-[72px] pb-16 flex flex-col justify-center min-h-[72vh]">
          <div className="max-w-[640px]">
            <div
              data-animate=""
              className="inline-flex items-center gap-[7px] border rounded-lg px-[14px] py-[5px] mb-5"
              style={{ background: 'rgba(91,101,220,.25)', borderColor: 'rgba(91,101,220,.4)' }}
            >
              <span className="material-icons-outlined text-[13px]" style={{ color: '#A5B0FF' }}>verified</span>
              <span className="text-[11px] font-semibold uppercase tracking-[.1em]" style={{ color: '#A5B0FF' }}>DOH-Accredited · Est. 2010</span>
            </div>

            <h1
              data-animate="" data-delay="100"
              className="font-extrabold text-white leading-[1.08] tracking-[-0.025em] mb-4"
              style={{ fontSize: 'clamp(32px,4.5vw,58px)' }}
            >
              Where expert care<br />meets compassion.
            </h1>

            <p
              data-animate="" data-delay="220"
              className="text-base leading-[1.7] mb-7 max-w-[500px]"
              style={{ color: 'rgba(255,255,255,.75)' }}
            >
              Book with trusted, board-certified specialists across 5 clinic branches. Confirmed in minutes, no paperwork.
            </p>

            {/* Search widget */}
            <div
              data-animate="" data-delay="320"
              className="rounded-lg p-4 mb-7"
              style={{ background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.16)', backdropFilter: 'blur(20px)' }}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[.07em] mb-[10px]" style={{ color: 'rgba(255,255,255,.55)' }}>Find a Doctor</p>
              <div className="flex gap-[10px] flex-wrap items-center hero-search-row">
                <select className="h-select">
                  <option value="">All Specialties</option>
                  {['Cardiology','Neurology','Orthopedics','Pediatrics','Dermatology','Family Medicine','OB-GYN'].map(s => <option key={s}>{s}</option>)}
                </select>
                <select className="h-select">
                  <option value="">All Insurance</option>
                  {['Maxicare','MediCard','PhilHealth','Intellicare','Insular Health','Cocolife'].map(s => <option key={s}>{s}</option>)}
                </select>
                <button
                  onClick={actions.goBook}
                  className="btn-p h-12 px-6 text-sm flex-shrink-0"
                >
                  <span className="material-icons-outlined text-[18px]">search</span>Search
                </button>
              </div>
            </div>

            {/* Stats row */}
            <div data-animate="" data-delay="440" className="flex items-center flex-wrap gap-0">
              {[
                { val: '10k+', label: 'Appointments' },
                { val: '50+',  label: 'Specialist doctors' },
                { val: '4.9★', label: 'Patient rating' },
              ].map((st, i) => (
                <React.Fragment key={st.val}>
                  {i > 0 && <div className="w-px h-[26px] mx-5" style={{ background: 'rgba(255,255,255,.2)' }} />}
                  <div>
                    <div className="text-[22px] font-extrabold text-white">{st.val}</div>
                    <div className="text-[11px] mt-px" style={{ color: 'rgba(255,255,255,.6)' }}>{st.label}</div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── About snippet ── */}
      <section className="bg-white py-[88px]">
        <div className="max-w-[1440px] mx-auto px-10 grid gap-[72px] items-center about-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div data-animate="" className="relative">
            <div className="rounded-lg overflow-hidden" style={{ boxShadow: '0 16px 52px rgba(18,32,86,.12)' }}>
              <img src="/images/person_1.jpg" alt="Doctor at MedPoint" className="w-full h-[380px] object-cover object-top block" />
            </div>
            <div className="absolute -bottom-[14px] -right-[14px] rounded-lg p-4 px-5" style={{ background: '#122056', boxShadow: '0 8px 28px rgba(18,32,86,.2)' }}>
              <div className="text-2xl font-extrabold text-white">15+</div>
              <div className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,.6)' }}>Years of service</div>
            </div>
            <div className="absolute -top-[14px] -left-[14px] bg-white rounded-lg p-4 px-5" style={{ border: '1px solid #E4E8EF', boxShadow: '0 8px 28px rgba(18,32,86,.07)' }}>
              <div className="text-2xl font-extrabold" style={{ color: '#5B65DC' }}>4.9★</div>
              <div className="text-[11px] mt-0.5" style={{ color: '#94A3B8' }}>Patient rating</div>
            </div>
          </div>

          <div data-animate="" data-delay="150">
            <div className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1 mb-4" style={{ background: '#EEEFFD', border: '1px solid #C7CAEF' }}>
              <span className="text-[11px] font-bold uppercase tracking-[.07em]" style={{ color: '#5B65DC' }}>About MedPoint Hospital</span>
            </div>
            <h2 className="font-extrabold leading-[1.1] tracking-[-0.025em] mb-4" style={{ fontSize: 'clamp(24px,3vw,40px)', color: '#122056' }}>
              More than a clinic —<br />a complete care ecosystem.
            </h2>
            <p className="text-[15px] leading-[1.75] mb-6" style={{ color: '#475569' }}>
              MedPoint Hospital is a DOH-accredited multi-specialty healthcare facility in Manila, serving Filipinos since 2010. Hospital-grade care that is accessible, transparent, and truly patient-centered.
            </p>
            <div className="flex flex-col gap-3 mb-7">
              {[
                { icon: 'verified',      title: 'DOH-Accredited & PhilHealth-Affiliated', sub: 'Government-recognized since 2010.' },
                { icon: 'groups',        title: '50+ Board-Certified Specialists',          sub: 'Credential-verified and accredited.' },
                { icon: 'location_on',   title: '5 Clinic Branches in Metro Manila',        sub: 'City, North, East, West & South.' },
              ].map(item => (
                <div key={item.title} className="flex items-center gap-[10px]">
                  <div className="w-[34px] h-[34px] rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#EEEFFD' }}>
                    <span className="material-icons-outlined text-[17px]" style={{ color: '#5B65DC' }}>{item.icon}</span>
                  </div>
                  <div>
                    <div className="text-[13.5px] font-semibold" style={{ color: '#122056' }}>{item.title}</div>
                    <div className="text-[12px]" style={{ color: '#64748B' }}>{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={actions.goAbout} className="btn-n h-11 px-6 text-sm">
              Learn More <span className="material-icons-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── Services preview ── */}
      <section style={{ background: '#F4F6F9', padding: '88px 0' }}>
        <div className="max-w-[1440px] mx-auto px-10">
          <div data-animate="" className="flex items-end justify-between mb-11 flex-wrap gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1 mb-3" style={{ background: '#EEEFFD', border: '1px solid #C7CAEF' }}>
                <span className="text-[11px] font-bold uppercase tracking-[.07em]" style={{ color: '#5B65DC' }}>Our Services</span>
              </div>
              <h2 className="font-extrabold tracking-[-0.025em]" style={{ fontSize: 'clamp(22px,3vw,38px)', color: '#122056' }}>Specialist care, exactly when you need it.</h2>
            </div>
            <button onClick={actions.goServices} className="btn-o h-[38px] px-[18px] text-[13.5px] flex-shrink-0">
              View all <span className="material-icons-outlined text-[15px]">arrow_forward</span>
            </button>
          </div>
          <div className="grid gap-[14px] svc-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
            {SERVICES.map(svc => (
              <div key={svc.name} className="svc-card" data-animate="" data-delay={String(svc.delay)}>
                <div className="px-[22px] py-5 pb-4 flex items-center gap-3" style={{ background: '#122056' }}>
                  <div className="w-[42px] h-[42px] rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(91,101,220,.3)' }}>
                    <span className="material-icons-outlined text-[22px]" style={{ color: '#A5B0FF' }}>{svc.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white mb-0.5">{svc.name}</h3>
                    <span className="text-[10.5px] font-semibold px-[7px] py-0.5 rounded" style={{ color: 'rgba(255,255,255,.5)', background: 'rgba(255,255,255,.1)' }}>{svc.tag}</span>
                  </div>
                </div>
                <div className="px-[22px] py-4 pb-5">
                  <p className="text-[13px] leading-[1.65] mb-3" style={{ color: '#475569' }}>{svc.desc}</p>
                  <button onClick={actions.goBook} className="bg-transparent border-0 text-[13px] font-semibold cursor-pointer flex items-center gap-1 p-0" style={{ color: '#5B65DC', fontFamily: "'Poppins',sans-serif" }}>
                    Book this service <span className="material-icons-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="bg-white py-[88px]">
        <div className="max-w-[1440px] mx-auto px-10">
          <div data-animate="" className="text-center mb-11">
            <div className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1 mb-3" style={{ background: '#EEEFFD', border: '1px solid #C7CAEF' }}>
              <span className="text-[11px] font-bold uppercase tracking-[.07em]" style={{ color: '#5B65DC' }}>Why Patients Choose Us</span>
            </div>
            <h2 className="font-extrabold tracking-[-0.025em]" style={{ fontSize: 'clamp(22px,3vw,38px)', color: '#122056' }}>Healthcare built around your life.</h2>
          </div>
          <div className="grid gap-[14px] feat-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
            {FEATURES.map(feat => (
              <div key={feat.title} className="card p-[26px]" data-animate="" data-delay={String(feat.delay)}>
                <div className="w-11 h-11 rounded-lg flex items-center justify-center mb-[14px]" style={{ background: '#EEEFFD' }}>
                  <span className="material-icons-outlined text-[22px]" style={{ color: '#5B65DC' }}>{feat.icon}</span>
                </div>
                <h3 className="text-sm font-bold mb-[7px]" style={{ color: '#122056' }}>{feat.title}</h3>
                <p className="text-[13px] leading-[1.7]" style={{ color: '#475569' }}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── News preview ── */}
      <section style={{ background: '#F4F6F9', padding: '88px 0' }}>
        <div className="max-w-[1440px] mx-auto px-10">
          <div data-animate="" className="flex items-end justify-between mb-11 flex-wrap gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1 mb-3" style={{ background: '#EEEFFD', border: '1px solid #C7CAEF' }}>
                <span className="text-[11px] font-bold uppercase tracking-[.07em]" style={{ color: '#5B65DC' }}>What's New</span>
              </div>
              <h2 className="font-extrabold tracking-[-0.025em]" style={{ fontSize: 'clamp(22px,3vw,38px)', color: '#122056' }}>Latest from MedPoint Hospital.</h2>
            </div>
            <button onClick={actions.goNews} className="btn-o h-[38px] px-[18px] text-[13.5px] flex-shrink-0">
              View all <span className="material-icons-outlined text-[15px]">arrow_forward</span>
            </button>
          </div>
          <div className="grid gap-[14px] news-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
            {NEWS_ALL.slice(0, 3).map(n => (
              <div key={n.id} className="card overflow-hidden" data-animate="" data-delay={String(n.delay)}>
                <div className="h-1 rounded-t-lg" style={{ background: n.accentColor }} />
                <div className="p-[22px]">
                  <span className={n.tagClass}>{n.category}</span>
                  <h3 className="text-[14.5px] font-bold mb-[9px] leading-[1.4]" style={{ color: '#122056' }}>{n.title}</h3>
                  <p className="text-[13px] leading-[1.65] mb-4" style={{ color: '#475569' }}>{n.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px]" style={{ color: '#94A3B8' }}>{n.date}</span>
                    <button onClick={actions.goNews} className="bg-transparent border-0 text-[12.5px] font-semibold cursor-pointer p-0" style={{ color: '#5B65DC', fontFamily: "'Poppins',sans-serif" }}>Read more →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="bg-white py-[88px]">
        <div className="max-w-[1440px] mx-auto px-10">
          <div data-animate="" className="text-center mb-11">
            <div className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1 mb-3" style={{ background: '#EEEFFD', border: '1px solid #C7CAEF' }}>
              <span className="text-[11px] font-bold uppercase tracking-[.07em]" style={{ color: '#5B65DC' }}>Patient Stories</span>
            </div>
            <h2 className="font-extrabold tracking-[-0.025em]" style={{ fontSize: 'clamp(22px,3vw,38px)', color: '#122056' }}>Real patients. Real results.</h2>
          </div>
          <div className="grid gap-[14px] test-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="card p-[26px]" data-animate="" data-delay={String(t.delay)}>
                <div className="text-[15px] mb-3" style={{ color: '#F59E0B' }}>★★★★★</div>
                <p className="text-sm leading-[1.75] italic mb-[18px]" style={{ color: '#475569' }}>"{t.quote}"</p>
                <div className="flex items-center gap-[10px] pt-[14px]" style={{ borderTop: '1px solid #E4E8EF' }}>
                  <div className="w-[38px] h-[38px] rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: t.avatarBg }}>
                    <span className="text-[12px] font-bold text-white">{t.initials}</span>
                  </div>
                  <div>
                    <div className="text-[13.5px] font-bold" style={{ color: '#122056' }}>{t.name}</div>
                    <div className="text-[12px]" style={{ color: '#94A3B8' }}>{t.specialty}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats banner ── */}
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

      {/* ── CTA ── */}
      <section className="py-[88px] relative overflow-hidden" style={{ background: '#5B65DC' }}>
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle,#fff 1px,transparent 1px)', backgroundSize: '22px 22px' }} />
        <div data-animate="" className="max-w-[560px] mx-auto px-10 text-center relative z-10">
          <h2 className="font-extrabold text-white leading-[1.1] tracking-[-0.025em] mb-3" style={{ fontSize: 'clamp(26px,4vw,48px)' }}>
            Book Your Appointment Now.
          </h2>
          <p className="text-base mb-8 leading-[1.7]" style={{ color: 'rgba(255,255,255,.8)' }}>
            Reserve your slot with trusted specialists in minutes. One click, instant confirmation.
          </p>
          <button onClick={actions.goBook} className="btn-white h-[52px] px-10 text-[15px] font-bold mx-auto">
            <span className="material-icons-outlined text-[19px]">calendar_today</span>
            Book Your Appointment Now →
          </button>
        </div>
      </section>
    </>
  );
}
