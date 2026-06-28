import React from 'react';
import { NewsFilter } from '../../types';
import { NEWS_ALL } from '../../data/constants';

interface Props {
  newsFilter: NewsFilter;
  newsFiltered: typeof NEWS_ALL[number][];
  onFilter: (f: NewsFilter) => void;
}

const FILTERS: { label: string; value: NewsFilter }[] = [
  { label: 'All',           value: 'all' },
  { label: 'Announcements', value: 'announcement' },
  { label: 'New Services',  value: 'service' },
  { label: 'Health Tips',   value: 'health' },
];

export function NewsPage({ newsFilter, newsFiltered, onFilter }: Props) {
  const featured = newsFiltered[0];
  const rest = newsFiltered.slice(1);

  return (
    <>
      {/* ── Hero ── */}
      <section className="py-[80px] pb-[72px] text-center relative overflow-hidden" style={{ background: '#122056' }}>
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle,#fff 1px,transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="max-w-[700px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
          <div className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1 mb-4" style={{ background: 'rgba(91,101,220,.25)', border: '1px solid rgba(91,101,220,.4)' }}>
            <span className="text-[11px] font-semibold uppercase tracking-[.08em]" style={{ color: '#A5B0FF' }}>Hospital News</span>
          </div>
          <h1 className="font-extrabold text-white leading-[1.1] tracking-[-0.025em] mb-4" style={{ fontSize: 'clamp(28px,5vw,50px)' }}>
            News & updates from<br />MedPoint Hospital.
          </h1>
          <p className="text-base leading-[1.75] max-w-[520px] mx-auto" style={{ color: 'rgba(255,255,255,.72)' }}>
            Stay informed on service announcements, new doctor additions, health campaigns, and what's happening across our 5 branches.
          </p>
        </div>
      </section>

      {/* ── Filter + Articles ── */}
      <section style={{ background: '#F4F6F9', padding: '56px 0 80px' }}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">

          {/* Filter pills */}
          <div className="flex gap-2 mb-10 flex-wrap">
            {FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => onFilter(f.value)}
                className="h-9 px-[18px] rounded-full text-[13px] font-semibold cursor-pointer transition-all"
                style={{
                  fontFamily: "'Poppins',sans-serif",
                  background: newsFilter === f.value ? '#5B65DC' : '#fff',
                  color:      newsFilter === f.value ? '#fff'    : '#475569',
                  border:     newsFilter === f.value ? '1.5px solid #5B65DC' : '1.5px solid #E4E8EF',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {featured && (
            <>
              {/* Featured article — full-width card */}
              <div className="card overflow-hidden mb-6" data-animate="">
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Accent panel */}
                  <div className="flex flex-col justify-between p-10" style={{ background: featured.accentColor, minHeight: 240 }}>
                    <div>
                      <span className="inline-block px-3 py-1 rounded-full text-[10.5px] font-bold uppercase tracking-[.08em] mb-4" style={{ background: 'rgba(255,255,255,.18)', color: '#fff' }}>
                        {featured.category}
                      </span>
                      <h2 className="font-extrabold text-white leading-[1.2] tracking-[-0.02em] mb-3" style={{ fontSize: 'clamp(18px,2.5vw,28px)' }}>
                        {featured.title}
                      </h2>
                    </div>
                    <div className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,.65)' }}>
                      <span className="material-icons-outlined text-[15px]">schedule</span>
                      <span className="text-[13px] font-medium">{featured.date}</span>
                      <span className="ml-auto text-[11px] font-semibold px-2 py-0.5 rounded" style={{ background: 'rgba(255,255,255,.15)' }}>Featured</span>
                    </div>
                  </div>
                  {/* Content panel */}
                  <div className="p-8 flex flex-col justify-between bg-white">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[.08em] mb-3" style={{ color: '#94A3B8' }}>Latest Update</p>
                      <p className="text-[15px] leading-[1.75] mb-5" style={{ color: '#475569' }}>{featured.excerpt}</p>
                      <p className="text-[14px] leading-[1.7]" style={{ color: '#475569' }}>
                        This update reflects our ongoing commitment to making healthcare faster, more accessible, and patient-centered across all 5 Metro Manila branches. All existing appointments remain unaffected.
                      </p>
                    </div>
                    <button className="mt-6 self-start flex items-center gap-1.5 font-bold text-[14px] bg-transparent border-0 cursor-pointer p-0" style={{ color: '#5B65DC', fontFamily: "'Poppins',sans-serif" }}>
                      Read full article <span className="material-icons-outlined text-base">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Remaining articles grid */}
              {rest.length > 0 && (
                <div className="grid gap-4 news-grid">
                  {rest.map(n => (
                    <div key={n.id} className="card overflow-hidden" data-animate="" data-delay={String(n.delay)}>
                      <div className="h-1.5 rounded-t-[14px]" style={{ background: n.accentColor }} />
                      <div className="p-[22px]">
                        <div className="flex items-center justify-between mb-[10px]">
                          <span className={n.tagClass} style={{ marginBottom: 0 }}>{n.category}</span>
                          <span className="text-[12px]" style={{ color: '#94A3B8' }}>{n.date}</span>
                        </div>
                        <h3 className="text-[14.5px] font-bold mb-[9px] leading-[1.4]" style={{ color: '#122056' }}>{n.title}</h3>
                        <p className="text-[13px] leading-[1.65] mb-4" style={{ color: '#475569' }}>{n.excerpt}</p>
                        <button className="bg-transparent border-0 text-[13px] font-semibold cursor-pointer p-0 flex items-center gap-1" style={{ color: '#5B65DC', fontFamily: "'Poppins',sans-serif" }}>
                          Read article <span className="material-icons-outlined text-sm">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {newsFiltered.length === 0 && (
            <div className="card py-16 px-6 text-center">
              <span className="material-icons-outlined text-[40px] mb-4 block" style={{ color: '#C7CAEF' }}>article</span>
              <h3 className="text-[15px] font-bold mb-2" style={{ color: '#122056' }}>No articles found</h3>
              <p className="text-[13.5px]" style={{ color: '#64748B' }}>Try a different filter above.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Newsletter signup ── */}
      <section className="py-[72px]" style={{ background: '#5B65DC' }}>
        <div className="max-w-[640px] mx-auto px-4 sm:px-6 lg:px-10 text-center">
          <div data-animate="">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: 'rgba(255,255,255,.15)' }}>
              <span className="material-icons-outlined text-[26px] text-white">mail_outline</span>
            </div>
            <h2 className="font-extrabold text-white tracking-[-0.025em] mb-3" style={{ fontSize: 'clamp(22px,3.5vw,36px)' }}>
              Stay in the loop.
            </h2>
            <p className="text-[15px] mb-8 leading-[1.7]" style={{ color: 'rgba(255,255,255,.8)' }}>
              Get MedPoint health tips, new service announcements, and branch updates delivered to your inbox — once a month, no spam.
            </p>
            <div className="nl-wrap max-w-[460px] mx-auto">
              <input
                type="email"
                className="nl-input"
                placeholder="Enter your email address…"
              />
              <button
                className="flex-shrink-0 font-bold text-[13.5px] px-5 cursor-pointer border-0"
                style={{ background: '#fff', color: '#5B65DC', height: 52, borderRadius: '0 10px 10px 0', fontFamily: "'Poppins',sans-serif" }}
              >
                Subscribe
              </button>
            </div>
            <p className="text-[12px] mt-4" style={{ color: 'rgba(255,255,255,.5)' }}>
              No spam. Unsubscribe anytime. We respect your privacy.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
