import React from 'react';
import { PortalActions } from '../../hooks/usePortalState';
import { FEATURES, NEWS_ALL, SERVICES, STATS, TESTIMONIALS, PROCESS_STEPS, INS_PARTNERS } from '../../data/constants';

interface Props { actions: PortalActions; }

export function HomePage({ actions }: Props) {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative min-h-[80vh] overflow-hidden">
        <img
          src="/images/hero-page.png"
          alt="MedPoint Hospital"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to right,rgba(10,18,60,.97) 0%,rgba(18,32,86,.88) 38%,rgba(18,32,86,.5) 62%,rgba(18,32,86,.10) 100%)' }}
        />
        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-[80px] pb-20 flex flex-col justify-center min-h-[80vh]">
          <div className="max-w-[660px]">
            <div
              data-animate=""
              className="inline-flex items-center gap-[7px] border rounded-lg px-[14px] py-[5px] mb-5"
              style={{ background: 'rgba(91,101,220,.22)', borderColor: 'rgba(91,101,220,.45)' }}
            >
              <span className="material-icons-outlined text-[13px]" style={{ color: '#A5B0FF' }}>local_hospital</span>
              <span className="text-[11px] font-semibold uppercase tracking-[.1em]" style={{ color: '#A5B0FF' }}>Board-Certified Specialists · Est. 2010 · 5 Branches</span>
            </div>

            <h1
              data-animate="" data-delay="100"
              className="font-extrabold text-white leading-[1.07] tracking-[-0.025em] mb-5"
              style={{ fontSize: 'clamp(34px,5vw,62px)' }}
            >
              Where expert care<br />meets compassion.
            </h1>

            <p
              data-animate="" data-delay="220"
              className="text-base leading-[1.75] mb-8 max-w-[520px] text-white"
              style={{ fontSize: 16, opacity: 0.92 }}
            >
              Book with trusted, board-certified specialists across 5 Metro Manila clinic branches. Confirmed in minutes — no paperwork, no queues.
            </p>

            {/* Search widget */}
            <div
              data-animate="" data-delay="320"
              className="rounded-xl p-5 mb-8"
              style={{ background: 'rgba(255,255,255,.09)', border: '1px solid rgba(255,255,255,.18)', backdropFilter: 'blur(20px)' }}
            >
              <div className="flex items-center gap-1.5 mb-3">
                <span className="material-icons-outlined text-[13px]" style={{ color: 'rgba(255,255,255,.5)' }}>manage_search</span>
                <p className="text-[11px] font-semibold uppercase tracking-[.07em]" style={{ color: 'rgba(255,255,255,.6)' }}>Find a Doctor</p>
              </div>
              <div className="flex gap-[10px] items-center">
                <div className="relative flex-1 min-w-0">
                  <select className="h-select" style={{ width: '100%', paddingRight: 32 }}>
                    <option value="">All Specialties</option>
                    {['Cardiology','Neurology','Orthopedics','Pediatrics','Dermatology','Family Medicine','OB-GYN','ENT','Geriatrics'].map(s => <option key={s}>{s}</option>)}
                  </select>
                  <span className="material-icons-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ fontSize: 16, color: '#6B7280' }}>expand_more</span>
                </div>
                <div className="relative flex-1 min-w-0">
                  <select className="h-select" style={{ width: '100%', paddingRight: 32 }}>
                    <option value="">All Insurance</option>
                    {['Maxicare','MediCard','PhilHealth','Intellicare','Insular Health','Cocolife'].map(s => <option key={s}>{s}</option>)}
                  </select>
                  <span className="material-icons-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ fontSize: 16, color: '#6B7280' }}>expand_more</span>
                </div>
                <div className="relative flex-1 min-w-0">
                  <select className="h-select" style={{ width: '100%', paddingRight: 32 }}>
                    <option value="">Any Branch</option>
                    {['City Clinic','North Branch','East Clinic','West Branch','South Clinic'].map(b => <option key={b}>{b}</option>)}
                  </select>
                  <span className="material-icons-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ fontSize: 16, color: '#6B7280' }}>expand_more</span>
                </div>
                <button onClick={actions.goBook} className="btn-p shrink-0" style={{ height: 48, paddingLeft: 20, paddingRight: 20, whiteSpace: 'nowrap' }}>
                  <span className="material-icons-outlined text-[18px]">search</span>Find a Doctor
                </button>
              </div>
            </div>

            {/* Stats row */}
            <div data-animate="" data-delay="440" className="flex items-center flex-wrap gap-0">
              {[
                { val: '10k+', label: 'Appointments' },
                { val: '50+',  label: 'Specialists' },
                { val: '4.9★', label: 'Patient rating' },
                { val: '5',    label: 'Branches' },
              ].map((st, i) => (
                <React.Fragment key={st.val}>
                  {i > 0 && <div className="w-px h-[26px] mx-5" style={{ background: 'rgba(255,255,255,.2)' }} />}
                  <div>
                    <div className="text-[24px] font-extrabold text-white">{st.val}</div>
                    <div className="text-[11px] mt-px" style={{ color: 'rgba(255,255,255,.6)' }}>{st.label}</div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section style={{ background: '#F4F6F9', padding: '88px 0' }}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div data-animate="" className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1 mb-3" style={{ background: '#EEEFFD', border: '1px solid #C7CAEF' }}>
              <span className="text-[11px] font-bold uppercase tracking-[.07em]" style={{ color: '#5B65DC' }}>How It Works</span>
            </div>
            <h2 className="font-extrabold tracking-[-0.025em] mb-3" style={{ fontSize: 'clamp(22px,3vw,38px)', color: '#122056' }}>
              Book your appointment in 4 simple steps.
            </h2>
            <p className="text-[15px] mx-auto" style={{ color: '#64748B', maxWidth: 520 }}>
              No phone calls, no waiting rooms. From search to confirmation in under 3 minutes.
            </p>
          </div>
          <div className="grid gap-5 proc-grid">
            {PROCESS_STEPS.map((step, i) => (
              <div key={step.num} data-animate="" data-delay={String(i * 80)} className="relative">
                <div className="bg-white rounded-2xl p-7 h-full flex flex-col" style={{ border: '1.5px solid #E4E8EF' }}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-extrabold text-sm" style={{ background: '#EEEFFD', color: '#5B65DC' }}>
                      {step.num}
                    </div>
                    <div className="h-px flex-1" style={{ background: '#E4E8EF' }} />
                  </div>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: '#122056' }}>
                    <span className="material-icons-outlined text-[22px] text-white">{step.icon}</span>
                  </div>
                  <h3 className="text-[15px] font-bold mb-2" style={{ color: '#122056' }}>{step.title}</h3>
                  <p className="text-[13px] leading-[1.7] mt-auto pt-1" style={{ color: '#64748B' }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div data-animate="" className="text-center mt-8">
            <button onClick={actions.goBook} className="btn-p" style={{ height: 46, paddingLeft: 28, paddingRight: 28, fontSize: 14 }}>
              <span className="material-icons-outlined text-[17px]">calendar_today</span>
              Book an Appointment Now
            </button>
          </div>
        </div>
      </section>

      {/* ── About snippet ── */}
      <section className="bg-white py-[88px]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 grid gap-[72px] items-center about-grid">
          <div data-animate="" className="relative">
            <div className="rounded-2xl overflow-hidden" style={{ boxShadow: '0 20px 60px rgba(18,32,86,.14)' }}>
              <img src="/images/person_1.jpg" alt="Doctor at MedPoint" className="w-full h-[420px] object-cover object-top block" />
            </div>
            <div className="absolute -bottom-[16px] -right-[16px] rounded-xl px-6 py-4" style={{ background: '#122056', boxShadow: '0 8px 28px rgba(18,32,86,.22)' }}>
              <div className="text-2xl font-extrabold text-white">15+</div>
              <div className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,.6)' }}>Years of service</div>
            </div>
            <div className="absolute -top-[16px] -left-[16px] bg-white rounded-xl px-6 py-4" style={{ border: '1.5px solid #E4E8EF', boxShadow: '0 8px 28px rgba(18,32,86,.08)' }}>
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
            <p className="text-[15px] leading-[1.75] mb-4" style={{ color: '#475569' }}>
              MedPoint Hospital is a licensed multi-specialty healthcare facility in Manila, serving Filipinos since 2010. We combine hospital-grade care with a genuinely patient-centered experience — accessible, transparent, and built around your life.
            </p>
            <p className="text-[15px] leading-[1.75] mb-6" style={{ color: '#475569' }}>
              With 50+ board-certified specialists, 5 clinic branches across Metro Manila, and a fully digital booking platform, we make quality healthcare easier to access than ever before.
            </p>
            <div className="flex flex-col gap-[11px] mb-7">
              {[
                { icon: 'health_and_safety', title: 'PhilHealth-Affiliated & Licensed', sub: 'Recognized healthcare provider. JCI-standard protocols.' },
                { icon: 'groups',       title: '50+ Board-Certified Specialists',          sub: 'Credential-verified, active PRC license holders.' },
                { icon: 'location_on',  title: '5 Clinic Branches in Metro Manila',        sub: 'City, North, East, West & South — near you.' },
                { icon: 'phone_iphone', title: 'Fully Digital Patient Experience',          sub: 'Book, track, and manage your health from your phone.' },
              ].map(item => (
                <div key={item.title} className="flex items-center gap-[11px]">
                  <div className="w-[36px] h-[36px] rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#EEEFFD' }}>
                    <span className="material-icons-outlined text-[17px]" style={{ color: '#5B65DC' }}>{item.icon}</span>
                  </div>
                  <div>
                    <div className="text-[13.5px] font-semibold" style={{ color: '#122056' }}>{item.title}</div>
                    <div className="text-[12px]" style={{ color: '#64748B' }}>{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <button onClick={actions.goAbout} className="btn-n" style={{ height: 44, paddingLeft: 22, paddingRight: 22, fontSize: 14 }}>
                About MedPoint <span className="material-icons-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
              </button>
              <button onClick={actions.goContact} className="btn-o" style={{ height: 44 }}>
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services preview ── */}
      <section style={{ background: '#F4F6F9', padding: '88px 0' }}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div data-animate="" className="flex items-end justify-between mb-11 flex-wrap gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1 mb-3" style={{ background: '#EEEFFD', border: '1px solid #C7CAEF' }}>
                <span className="text-[11px] font-bold uppercase tracking-[.07em]" style={{ color: '#5B65DC' }}>Our Services</span>
              </div>
              <h2 className="font-extrabold tracking-[-0.025em] mb-2" style={{ fontSize: 'clamp(22px,3vw,38px)', color: '#122056' }}>
                Specialist care, exactly when you need it.
              </h2>
              <p className="text-[14.5px]" style={{ color: '#64748B', maxWidth: 480 }}>
                From general consultations to advanced diagnostics — all available at your branch.
              </p>
            </div>
            <button onClick={actions.goServices} className="btn-o" style={{ height: 40, paddingLeft: 20, paddingRight: 20, fontSize: 13.5, flexShrink: 0 }}>
              View all services <span className="material-icons-outlined text-sm">arrow_forward</span>
            </button>
          </div>
          <div className="grid gap-[14px] svc-grid">
            {SERVICES.map(svc => (
              <div key={svc.name} className="svc-card" data-animate="" data-delay={String(svc.delay)}>
                <div className="px-[22px] py-5 pb-4 flex items-center gap-3" style={{ background: '#122056' }}>
                  <div className="w-[44px] h-[44px] rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(91,101,220,.32)' }}>
                    <span className="material-icons-outlined text-[22px]" style={{ color: '#A5B0FF' }}>{svc.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white mb-0.5">{svc.name}</h3>
                    <span className="text-[10.5px] font-semibold px-[7px] py-0.5 rounded" style={{ color: 'rgba(255,255,255,.55)', background: 'rgba(255,255,255,.1)' }}>{svc.tag}</span>
                  </div>
                </div>
                <div className="px-[22px] py-4 pb-5">
                  <p className="text-[13px] leading-[1.65] mb-3" style={{ color: '#475569' }}>{svc.desc}</p>
                  <div className="flex items-center gap-[7px] text-[12px] font-medium mb-4" style={{ color: '#64748B' }}>
                    <span className="material-icons-outlined text-sm flex-shrink-0" style={{ color: '#16A34A' }}>check_circle</span>Available at all branches
                    <span className="material-icons-outlined text-sm flex-shrink-0 ml-1" style={{ color: '#16A34A' }}>check_circle</span>Insurance verified
                  </div>
                  <button onClick={actions.goBook} className="bg-transparent border-0 text-[13px] font-semibold cursor-pointer flex items-center gap-1 p-0" style={{ color: '#5B65DC', fontFamily: "'Poppins',sans-serif" }}>
                    Book this service <span className="material-icons-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Patients Choose Us ── */}
      <section className="bg-white py-[88px]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div data-animate="" className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1 mb-3" style={{ background: '#EEEFFD', border: '1px solid #C7CAEF' }}>
              <span className="text-[11px] font-bold uppercase tracking-[.07em]" style={{ color: '#5B65DC' }}>Why Patients Choose Us</span>
            </div>
            <h2 className="font-extrabold tracking-[-0.025em] mb-3" style={{ fontSize: 'clamp(22px,3vw,38px)', color: '#122056' }}>
              Healthcare built around your life.
            </h2>
            <p className="text-[15px] mx-auto" style={{ color: '#64748B', maxWidth: 500 }}>
              Every feature designed to remove friction from your healthcare journey.
            </p>
          </div>

          {/* Top 2 — highlighted */}
          <div className="grid grid-cols-1 gap-5 mb-5 md:grid-cols-2">
            {FEATURES.slice(0, 2).map(feat => (
              <div key={feat.title} className="card p-7 flex gap-5" data-animate="" data-delay={String(feat.delay)}>
                <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#122056' }}>
                  <span className="material-icons-outlined text-[26px] text-white">{feat.icon}</span>
                </div>
                <div>
                  <h3 className="text-[15px] font-bold mb-2" style={{ color: '#122056' }}>{feat.title}</h3>
                  <p className="text-[13.5px] leading-[1.7]" style={{ color: '#475569' }}>{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom 4 — standard grid */}
          <div className="grid gap-[14px] feat-grid">
            {FEATURES.slice(2).map(feat => (
              <div key={feat.title} className="card p-[22px]" data-animate="" data-delay={String(feat.delay)}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-[13px]" style={{ background: '#EEEFFD' }}>
                  <span className="material-icons-outlined text-[22px]" style={{ color: '#5B65DC' }}>{feat.icon}</span>
                </div>
                <h3 className="text-sm font-bold mb-[6px]" style={{ color: '#122056' }}>{feat.title}</h3>
                <p className="text-[13px] leading-[1.7]" style={{ color: '#475569' }}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Insurance Partners ── */}
      <section style={{ background: '#F4F6F9', padding: '60px 0' }}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div data-animate="" className="text-center mb-8">
            <p className="text-[12px] font-bold uppercase tracking-[.1em]" style={{ color: '#94A3B8' }}>Accepted Insurance Partners</p>
            <h2 className="font-extrabold tracking-[-0.02em] mt-2" style={{ fontSize: 'clamp(18px,2.5vw,28px)', color: '#122056' }}>
              Coverage verified before your visit. No billing surprises.
            </h2>
          </div>
          <div data-animate="" data-delay="100" className="flex flex-wrap justify-center gap-3">
            {INS_PARTNERS.map(ins => (
              <div key={ins.name} className="ins-badge">
                <span className="material-icons-outlined text-[18px]" style={{ color: ins.color }}>{ins.icon}</span>
                {ins.name}
              </div>
            ))}
          </div>
          <p data-animate="" data-delay="200" className="text-center text-sm mt-5" style={{ color: '#94A3B8' }}>
            Don't see your insurance? <button onClick={actions.goContact} className="bg-transparent border-0 cursor-pointer p-0 text-sm font-semibold underline" style={{ color: '#5B65DC', fontFamily: "'Poppins',sans-serif" }}>Contact us to confirm coverage</button>
          </p>
        </div>
      </section>

      {/* ── News preview ── */}
      <section className="bg-white py-[88px]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div data-animate="" className="flex items-end justify-between mb-11 flex-wrap gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1 mb-3" style={{ background: '#EEEFFD', border: '1px solid #C7CAEF' }}>
                <span className="text-[11px] font-bold uppercase tracking-[.07em]" style={{ color: '#5B65DC' }}>What's New</span>
              </div>
              <h2 className="font-extrabold tracking-[-0.025em]" style={{ fontSize: 'clamp(22px,3vw,38px)', color: '#122056' }}>
                Latest from MedPoint Hospital.
              </h2>
            </div>
            <button onClick={actions.goNews} className="btn-o" style={{ height: 40, paddingLeft: 18, paddingRight: 18, fontSize: 13.5, flexShrink: 0 }}>
              View all <span className="material-icons-outlined text-sm">arrow_forward</span>
            </button>
          </div>
          <div className="grid gap-[14px] news-grid">
            {NEWS_ALL.slice(0, 3).map(n => (
              <div key={n.id} className="card overflow-hidden" data-animate="" data-delay={String(n.delay)}>
                <div className="h-1.5 rounded-t-[14px]" style={{ background: n.accentColor }} />
                <div className="p-[22px]">
                  <span className={n.tagClass}>{n.category}</span>
                  <h3 className="text-[14.5px] font-bold mb-[9px] leading-[1.4]" style={{ color: '#122056' }}>{n.title}</h3>
                  <p className="text-[13px] leading-[1.65] mb-4" style={{ color: '#475569' }}>{n.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px]" style={{ color: '#94A3B8' }}>{n.date}</span>
                    <button onClick={actions.goNews} className="bg-transparent border-0 text-[12.5px] font-semibold cursor-pointer p-0 flex items-center gap-0.5" style={{ color: '#5B65DC', fontFamily: "'Poppins',sans-serif" }}>
                      Read more <span className="material-icons-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={{ background: '#F4F6F9', padding: '88px 0' }}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div data-animate="" className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1 mb-3" style={{ background: '#EEEFFD', border: '1px solid #C7CAEF' }}>
              <span className="text-[11px] font-bold uppercase tracking-[.07em]" style={{ color: '#5B65DC' }}>Patient Stories</span>
            </div>
            <h2 className="font-extrabold tracking-[-0.025em] mb-3" style={{ fontSize: 'clamp(22px,3vw,38px)', color: '#122056' }}>Real patients. Real results.</h2>
            <p className="text-[15px] mx-auto" style={{ color: '#64748B', maxWidth: 420 }}>
              Hear from the thousands of patients who've trusted MedPoint for their healthcare.
            </p>
          </div>
          <div className="grid gap-[14px] test-grid">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="card p-[28px] flex flex-col" data-animate="" data-delay={String(t.delay)}>
                <div className="text-[28px] font-extrabold mb-3 leading-none" style={{ color: '#5B65DC', fontFamily: 'Georgia, serif' }}>"</div>
                <div className="flex mb-3">
                  {[1,2,3,4,5].map(s => (
                    <span key={s} className="text-[16px]" style={{ color: '#F59E0B' }}>★</span>
                  ))}
                </div>
                <p className="text-sm leading-[1.8] mb-5 flex-1" style={{ color: '#475569' }}>{t.quote}</p>
                <div className="flex items-center gap-[11px] pt-[16px]" style={{ borderTop: '1px solid #E4E8EF' }}>
                  <div className="w-[40px] h-[40px] rounded-full flex items-center justify-center flex-shrink-0" style={{ background: t.avatarBg }}>
                    <span className="text-[12px] font-bold text-white">{t.initials}</span>
                  </div>
                  <div>
                    <div className="text-[13.5px] font-bold" style={{ color: '#122056' }}>{t.name}</div>
                    <div className="text-[12px]" style={{ color: '#94A3B8' }}>Patient · {t.specialty}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats banner ── */}
      <section style={{ background: '#122056', padding: '56px 0' }}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 grid stat-grid">
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

      {/* ── CTA ── */}
      <section className="py-[88px] relative overflow-hidden" style={{ background: '#5B65DC' }}>
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle,#fff 1px,transparent 1px)', backgroundSize: '22px 22px' }} />
        <div data-animate="" className="max-w-[580px] mx-auto px-4 sm:px-6 lg:px-10 text-center relative z-10">
          <h2 className="font-extrabold text-white leading-[1.1] tracking-[-0.025em] mb-3" style={{ fontSize: 'clamp(26px,4vw,48px)' }}>
            Book Your Appointment Now.
          </h2>
          <p className="text-base mb-3 leading-[1.7]" style={{ color: 'rgba(255,255,255,.85)' }}>
            Reserve your slot with trusted specialists in minutes.
          </p>
          <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,.65)' }}>
            Instant confirmation · Insurance pre-verified · No paperwork
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button onClick={actions.goBook} className="btn-white" style={{ height: 52, paddingLeft: 32, paddingRight: 32, fontSize: 15 }}>
              <span className="material-icons-outlined text-[19px]">calendar_today</span>
              Book an Appointment
            </button>
            <button onClick={actions.goContact} className="btn-o" style={{ height: 52, paddingLeft: 24, paddingRight: 24, fontSize: 14, background: 'transparent', color: '#fff', borderColor: 'rgba(255,255,255,.4)' }}>
              Talk to Us
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
