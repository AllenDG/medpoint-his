import React from 'react';
import { PortalActions } from '../../hooks/usePortalState';
import { Doctor, SortBy } from '../../types';
import { INS_LIST } from '../../data/constants';

interface SpecPill {
  name: string;
  icon: string;
  spec: string;
  active: boolean;
  onSelect: () => void;
}

interface Props {
  actions: PortalActions;
  filteredDocs: Doctor[];
  specPills: SpecPill[];
  searchQuery: string;
  sortBy: SortBy;
  fBranch: string;
  fAvail: boolean;
  selectedSpec: string;
  hasFilters: boolean;
  annOffset: number;
}

export function BookPage({
  actions, filteredDocs, specPills,
  searchQuery, sortBy, fBranch, fAvail, hasFilters, annOffset,
}: Props) {
  return (
    <>
      {/* ── Page header + filters ── */}
      <div className="bg-white" style={{ borderBottom: '1.5px solid #E4E8EF' }}>
        <div className="max-w-[1440px] mx-auto px-10 pt-7 pb-0">

          {/* Title row */}
          <div className="flex items-end justify-between mb-5 flex-wrap gap-3">
            <div>
              <h1 className="text-[24px] font-extrabold mb-1" style={{ color: '#122056' }}>Find & Book a Doctor</h1>
              <p className="text-[13.5px]" style={{ color: '#64748B' }}>
                {filteredDocs.length} doctor{filteredDocs.length !== 1 ? 's' : ''} available · Board-certified · Insurance pre-verified
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { icon: 'verified', text: 'DOH Accredited' },
                { icon: 'health_and_safety', text: 'Insurance Ready' },
                { icon: 'timer', text: 'Live Availability' },
              ].map(b => (
                <div key={b.text} className="flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-full" style={{ background: '#EEEFFD', color: '#5B65DC' }}>
                  <span className="material-icons-outlined text-[14px]">{b.icon}</span>
                  {b.text}
                </div>
              ))}
            </div>
          </div>

          {/* Search + sort row */}
          <div className="flex gap-[10px] items-center flex-wrap mb-4">
            <div
              className="flex-1 min-w-[260px] flex items-center gap-[10px] rounded-xl px-[14px] h-[48px] search-wrap"
              style={{ background: '#F4F6F9', border: '1.5px solid #E4E8EF' }}
            >
              <span className="material-icons-outlined text-[19px] flex-shrink-0" style={{ color: '#94A3B8' }}>search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={e => actions.setSearch(e.target.value)}
                placeholder="Search by doctor name, specialty, or branch…"
                className="flex-1 border-0 bg-transparent text-sm outline-none"
                style={{ fontFamily: "'Poppins',sans-serif", color: '#122056' }}
              />
              {searchQuery && (
                <button onClick={() => actions.setSearch('')} className="bg-transparent border-0 cursor-pointer flex items-center p-0" style={{ color: '#94A3B8' }}>
                  <span className="material-icons-outlined text-[17px]">close</span>
                </button>
              )}
            </div>
            <select
              value={sortBy}
              onChange={e => actions.setSort(e.target.value as SortBy)}
              className="h-[48px] rounded-xl px-[14px] text-[13.5px] outline-none cursor-pointer min-w-[180px]"
              style={{ border: '1.5px solid #E4E8EF', fontFamily: "'Poppins',sans-serif", color: '#122056', background: '#fff' }}
            >
              <option value="rating">Highest Rated</option>
              <option value="availability">Available Today</option>
              <option value="name">Name A–Z</option>
            </select>
          </div>

          {/* Specialty pills */}
          <div className="flex gap-2 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none' }}>
            {specPills.map(sp => (
              <button
                key={sp.name}
                onClick={sp.onSelect}
                className={`spec-pill ${sp.active ? 'active' : ''}`}
              >
                <span className="material-icons-outlined text-sm">{sp.icon}</span>
                {sp.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body: sidebar + list ── */}
      <div className="max-w-[1440px] mx-auto px-10 py-6 pb-[72px] book-layout" style={{ gap: 20 }}>

        {/* Sidebar */}
        <aside
          className="bg-white rounded-xl p-[18px] book-sidebar"
          style={{ border: '1.5px solid #E4E8EF', position: 'sticky', top: annOffset + 80 }}
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="material-icons-outlined text-[17px]" style={{ color: '#5B65DC' }}>tune</span>
              <h2 className="text-sm font-bold" style={{ color: '#122056' }}>Filters</h2>
            </div>
            {hasFilters && (
              <button onClick={actions.clearFilters} className="bg-transparent border-0 text-[12.5px] font-semibold cursor-pointer p-0" style={{ color: '#5B65DC', fontFamily: "'Poppins',sans-serif" }}>
                Clear all
              </button>
            )}
          </div>

          {/* Insurance */}
          <div className="mb-5 pb-5" style={{ borderBottom: '1px solid #F1F5F9' }}>
            <p className="text-[11px] font-bold uppercase tracking-[.06em] mb-3" style={{ color: '#94A3B8' }}>Insurance</p>
            <div className="flex flex-col gap-[8px]">
              {INS_LIST.map(opt => (
                <label key={opt} className="flex items-center gap-2.5 cursor-pointer text-[13px]" style={{ color: '#122056' }}>
                  <input type="checkbox" className="w-[15px] h-[15px] cursor-pointer flex-shrink-0 rounded" style={{ accentColor: '#5B65DC' }} />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          {/* Branch */}
          <div className="mb-5 pb-5" style={{ borderBottom: '1px solid #F1F5F9' }}>
            <p className="text-[11px] font-bold uppercase tracking-[.06em] mb-3" style={{ color: '#94A3B8' }}>Branch</p>
            <select
              value={fBranch}
              onChange={e => actions.setFBranch(e.target.value)}
              className="w-full h-9 rounded-lg px-[10px] text-[13px] outline-none cursor-pointer"
              style={{ border: '1.5px solid #E4E8EF', color: '#122056', background: '#fff', fontFamily: "'Poppins',sans-serif" }}
            >
              <option value="">All branches</option>
              {['City Clinic','North Branch','East Clinic','West Branch','South Clinic'].map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          {/* Availability */}
          <div className="mb-5 pb-5" style={{ borderBottom: '1px solid #F1F5F9' }}>
            <p className="text-[11px] font-bold uppercase tracking-[.06em] mb-3" style={{ color: '#94A3B8' }}>Availability</p>
            <label className="flex items-center justify-between cursor-pointer" style={{ color: '#122056' }}>
              <span className="text-[13px] font-medium">Available today</span>
              <input
                type="checkbox"
                checked={fAvail}
                onChange={e => actions.setFAvail(e.target.checked)}
                className="w-4 h-4 cursor-pointer"
                style={{ accentColor: '#5B65DC' }}
              />
            </label>
          </div>

          {/* Trust signals */}
          <div className="flex flex-col gap-2">
            {[
              { icon: 'verified',        text: 'All doctors DOH-accredited' },
              { icon: 'health_and_safety', text: 'Insurance pre-verified' },
              { icon: 'lock',            text: 'Secure & private booking' },
            ].map(s => (
              <div key={s.text} className="flex items-center gap-2 text-[11.5px]" style={{ color: '#64748B' }}>
                <span className="material-icons-outlined text-[14px]" style={{ color: '#16A34A' }}>{s.icon}</span>
                {s.text}
              </div>
            ))}
          </div>
        </aside>

        {/* Doctor list */}
        <div className="flex flex-col gap-4">
          {filteredDocs.length === 0 && (
            <div className="bg-white rounded-xl py-[52px] px-6 text-center" style={{ border: '1.5px solid #E4E8EF' }}>
              <div className="w-[56px] h-[56px] rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: '#F4F6F9' }}>
                <span className="material-icons-outlined text-[28px]" style={{ color: '#94A3B8' }}>person_search</span>
              </div>
              <h3 className="text-[16px] font-bold mb-2" style={{ color: '#122056' }}>No doctors found</h3>
              <p className="text-[13.5px] mb-5" style={{ color: '#64748B' }}>Try adjusting your filters or search terms.</p>
              <button onClick={actions.clearFilters} className="btn-p" style={{ height: 40, paddingLeft: 20, paddingRight: 20, fontSize: 13.5 }}>
                Reset all filters
              </button>
            </div>
          )}
          {filteredDocs.map(doc => (
            <DoctorRow key={doc.id} doc={doc} actions={actions} />
          ))}
        </div>
      </div>
    </>
  );
}

function DoctorRow({ doc, actions }: { doc: Doctor; actions: PortalActions }) {
  const avatarBg = `hsl(${doc.hue} 52% 36%)`;
  const avatarBgLight = `hsl(${doc.hue} 52% 96%)`;
  const avatarColor = `hsl(${doc.hue} 52% 36%)`;
  const insTags = doc.insurance.slice(0, 3);
  const insExtra = doc.insurance.length > 3 ? doc.insurance.length - 3 : 0;
  const isToday = doc.next === 'Today';

  return (
    <div className="doc-row">
      <div className="p-6 flex gap-5 flex-wrap">

        {/* Avatar */}
        <div className="flex flex-col items-center gap-2 flex-shrink-0">
          <div
            className="w-[72px] h-[72px] rounded-2xl flex items-center justify-center text-white text-xl font-extrabold"
            style={{ background: avatarBg }}
          >
            {doc.initials}
          </div>
          <div
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold"
            style={{ background: avatarBgLight, color: avatarColor }}
          >
            <span className="material-icons-outlined text-[11px]">favorite</span>
            {doc.specialty.split(' ')[0]}
          </div>
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span className="text-[17px] font-extrabold" style={{ color: '#122056' }}>{doc.name}</span>
                <span className="text-[11.5px] font-semibold px-2 py-0.5 rounded" style={{ background: '#EEEFFD', color: '#5B65DC' }}>{doc.creds}</span>
              </div>
              <div className="text-[13px] flex items-center gap-1.5 flex-wrap" style={{ color: '#64748B' }}>
                <span className="material-icons-outlined text-[13px]">local_hospital</span>{doc.branch}
                <span style={{ color: '#D1D5DB' }}>·</span>
                <span className="material-icons-outlined text-[13px]">schedule</span>{doc.exp} yrs experience
                <span style={{ color: '#D1D5DB' }}>·</span>
                <span className="material-icons-outlined text-[13px]">translate</span>{doc.langs}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-[20px] font-extrabold leading-none" style={{ color: '#122056' }}>{doc.rating.toFixed(1)}</div>
              <div className="flex mt-0.5">
                {[1,2,3,4,5].map(s => (
                  <span key={s} style={{ color: s <= Math.round(doc.rating) ? '#F59E0B' : '#E4E8EF', fontSize: 12 }}>★</span>
                ))}
              </div>
              <div className="text-[11.5px] mt-0.5" style={{ color: '#94A3B8' }}>{doc.reviews} reviews</div>
            </div>
          </div>

          <p className="text-[13px] leading-[1.65] mb-3" style={{ color: '#475569' }}>
            {doc.bio.slice(0, 160)}{doc.bio.length > 160 ? '…' : ''}
          </p>

          {/* Insurance tags */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-semibold uppercase tracking-[.05em]" style={{ color: '#94A3B8' }}>Insurance:</span>
            {insTags.map(ins => (
              <span key={ins} className="text-[11.5px] px-2 py-0.5 rounded-full font-medium" style={{ background: '#F4F6F9', border: '1px solid #E4E8EF', color: '#475569' }}>{ins}</span>
            ))}
            {insExtra > 0 && (
              <span className="text-[11.5px] px-2 py-0.5 rounded-full font-medium" style={{ background: '#EEEFFD', color: '#5B65DC' }}>+{insExtra} more</span>
            )}
          </div>
        </div>
      </div>

      {/* Card footer */}
      <div className="px-6 py-3.5 flex items-center justify-between flex-wrap gap-3" style={{ background: '#F8F9FC', borderTop: '1.5px solid #E4E8EF' }}>
        <div className="flex items-center gap-3 flex-wrap">
          {isToday ? (
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full portal-ping flex-shrink-0" style={{ background: '#16A34A' }} />
              <span className="text-[13px] font-semibold" style={{ color: '#16A34A' }}>Available today</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="material-icons-outlined text-[14px]" style={{ color: '#94A3B8' }}>schedule</span>
              <span className="text-[13px]" style={{ color: '#64748B' }}>Next: {doc.next}</span>
            </div>
          )}
          <span style={{ color: '#D1D5DB' }}>·</span>
          <span className="text-[13px]" style={{ color: '#64748B' }}>
            Earliest slot: <strong style={{ color: '#122056' }}>{doc.nextSlot}</strong>
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => actions.openProfile(doc)}
            className="btn-o"
            style={{ height: 38, paddingLeft: 16, paddingRight: 16, fontSize: 13 }}
          >
            <span className="material-icons-outlined text-sm">person</span>View Profile
          </button>
          <button
            onClick={() => actions.openBookModal(doc)}
            className="btn-p"
            style={{ height: 38, paddingLeft: 18, paddingRight: 18, fontSize: 13 }}
          >
            <span className="material-icons-outlined text-sm">calendar_today</span>Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
