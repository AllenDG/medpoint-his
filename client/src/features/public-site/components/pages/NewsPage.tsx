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
  return (
    <>
      <section className="py-[72px] pb-16 text-center" style={{ background: '#122056' }}>
        <div className="max-w-[700px] mx-auto px-10">
          <div className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1 mb-4" style={{ background: 'rgba(91,101,220,.25)', border: '1px solid rgba(91,101,220,.4)' }}>
            <span className="text-[11px] font-semibold uppercase tracking-[.08em]" style={{ color: '#A5B0FF' }}>Hospital News</span>
          </div>
          <h1 className="font-extrabold text-white leading-[1.1] tracking-[-0.025em] mb-[14px]" style={{ fontSize: 'clamp(28px,5vw,50px)' }}>
            News from MedPoint Hospital.
          </h1>
        </div>
      </section>

      <section style={{ background: '#F4F6F9', padding: '56px 0 80px' }}>
        <div className="max-w-[1440px] mx-auto px-10">
          <div className="flex gap-2 mb-8 flex-wrap">
            {FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => onFilter(f.value)}
                className="h-9 px-[18px] rounded-lg text-[13px] font-medium cursor-pointer transition-all"
                style={{
                  fontFamily: "'Poppins',sans-serif",
                  background: newsFilter === f.value ? '#EEEFFD' : '#fff',
                  color:      newsFilter === f.value ? '#5B65DC' : '#122056',
                  border:     newsFilter === f.value ? '1.5px solid #5B65DC' : '1.5px solid #E4E8EF',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="grid gap-4 news-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
            {newsFiltered.map(n => (
              <div key={n.id} className="card overflow-hidden">
                <div className="h-1 rounded-t-lg" style={{ background: n.accentColor }} />
                <div className="p-[22px]">
                  <div className="flex items-center justify-between mb-[10px]">
                    <span className={n.tagClass} style={{ marginBottom: 0 }}>{n.category}</span>
                    <span className="text-[12px]" style={{ color: '#94A3B8' }}>{n.date}</span>
                  </div>
                  <h3 className="text-[15px] font-bold mb-[9px] leading-[1.4]" style={{ color: '#122056' }}>{n.title}</h3>
                  <p className="text-[13px] leading-[1.65] mb-4" style={{ color: '#475569' }}>{n.excerpt}</p>
                  <button className="bg-transparent border-0 text-[13px] font-semibold cursor-pointer p-0 flex items-center gap-1" style={{ color: '#5B65DC', fontFamily: "'Poppins',sans-serif" }}>
                    Read article <span className="material-icons-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
