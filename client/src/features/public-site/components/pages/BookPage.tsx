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
      {/* Header */}
      <div className="bg-white" style={{ borderBottom: '1px solid #E4E8EF' }}>
        <div className="max-w-[1440px] mx-auto px-10 pt-6 pb-0">
          <h1 className="text-[22px] font-extrabold mb-1" style={{ color: '#122056' }}>Find & Book a Doctor</h1>
          <p className="text-[13.5px] mb-[18px]" style={{ color: '#64748B' }}>
            {filteredDocs.length} doctor{filteredDocs.length !== 1 ? 's' : ''} available · Search by specialty, insurance, or name
          </p>

          <div className="flex gap-[10px] items-center flex-wrap mb-4">
            {/* Search */}
            <div
              className="flex-1 min-w-[260px] flex items-center gap-[10px] rounded-lg px-[14px] h-[46px] search-wrap"
              style={{ background: '#F4F6F9', border: '1.5px solid #E4E8EF' }}
            >
              <span className="material-icons-outlined text-[19px] flex-shrink-0" style={{ color: '#94A3B8' }}>search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={e => actions.setSearch(e.target.value)}
                placeholder="Search by doctor name or specialty…"
                className="flex-1 border-0 bg-transparent text-sm outline-none"
                style={{ fontFamily: "'Poppins',sans-serif", color: '#122056' }}
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={e => actions.setSort(e.target.value as SortBy)}
              className="h-[46px] rounded-lg px-[14px] text-[13.5px] outline-none cursor-pointer min-w-[172px]"
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

      {/* Body */}
      <div
        className="max-w-[1440px] mx-auto px-10 py-6 pb-[72px] grid items-start book-layout"
        style={{ gridTemplateColumns: '200px 1fr', gap: 16 }}
      >
        {/* Sidebar */}
        <aside
          className="bg-white rounded-lg p-[18px] book-sidebar"
          style={{ border: '1px solid #E4E8EF', position: 'sticky', top: annOffset + 80 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold" style={{ color: '#122056' }}>Filters</h2>
            {hasFilters && (
              <button onClick={actions.clearFilters} className="bg-transparent border-0 text-[12.5px] font-semibold cursor-pointer p-0" style={{ color: '#5B65DC', fontFamily: "'Poppins',sans-serif" }}>
                Clear all
              </button>
            )}
          </div>

          {/* Insurance */}
          <div className="mb-4 pb-4" style={{ borderBottom: '1px solid #F1F5F9' }}>
            <p className="text-[11px] font-bold uppercase tracking-[.06em] mb-[9px]" style={{ color: '#94A3B8' }}>Insurance</p>
            <div className="flex flex-col gap-[7px]">
              {INS_LIST.map(opt => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer text-[13px]" style={{ color: '#122056' }}>
                  <input type="checkbox" className="w-[15px] h-[15px] cursor-pointer flex-shrink-0" style={{ accentColor: '#5B65DC' }} />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          {/* Branch */}
          <div className="mb-4 pb-4" style={{ borderBottom: '1px solid #F1F5F9' }}>
            <p className="text-[11px] font-bold uppercase tracking-[.06em] mb-[9px]" style={{ color: '#94A3B8' }}>Branch</p>
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
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.06em] mb-[9px]" style={{ color: '#94A3B8' }}>Availability</p>
            <label className="flex items-center justify-between cursor-pointer text-[13px] font-medium" style={{ color: '#122056' }}>
              Available today
              <input
                type="checkbox"
                checked={fAvail}
                onChange={e => actions.setFAvail(e.target.checked)}
                className="w-4 h-4 cursor-pointer"
                style={{ accentColor: '#5B65DC' }}
              />
            </label>
          </div>
        </aside>

        {/* Doctor list */}
        <div className="flex flex-col gap-3">
          {filteredDocs.length === 0 && (
            <div className="bg-white rounded-lg py-[52px] px-6 text-center" style={{ border: '1px solid #E4E8EF' }}>
              <div className="w-[52px] h-[52px] rounded-lg flex items-center justify-center mx-auto mb-[14px]" style={{ background: '#F4F6F9' }}>
                <span className="material-icons-outlined text-[26px]" style={{ color: '#94A3B8' }}>person_search</span>
              </div>
              <h3 className="text-[15px] font-bold mb-2" style={{ color: '#122056' }}>No doctors found</h3>
              <p className="text-[13.5px] mb-[18px]" style={{ color: '#64748B' }}>Try adjusting your filters or search terms.</p>
              <button onClick={actions.clearFilters} className="btn-p h-10 px-5 text-sm">Reset filters</button>
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
  const avatarBg = `hsl(${doc.hue} 55% 38%)`;
  const insTags = doc.insurance.slice(0, 3);
  const insExtra = doc.insurance.length > 3 ? `+${doc.insurance.length - 3} more` : null;
  const bioShort = doc.bio.slice(0, 138) + '…';

  return (
    <div className="doc-row">
      <div className="p-[20px] px-[22px] flex gap-4 flex-wrap">
        {/* Avatar */}
        <div
          className="w-[68px] h-[68px] rounded-lg flex items-center justify-center flex-shrink-0 text-white text-lg font-bold"
          style={{ background: avatarBg }}
        >
          {doc.initials}
        </div>

        <div className="flex-1 min-w-[180px]">
          <div className="flex items-start justify-between flex-wrap gap-1.5 mb-[3px]">
            <div>
              <div className="text-base font-bold mb-px" style={{ color: '#122056' }}>{doc.name}</div>
              <div className="text-[12.5px]" style={{ color: '#64748B' }}>
                {doc.creds} · <span className="font-semibold" style={{ color: '#5B65DC' }}>{doc.specialty}</span> · {doc.branch} · {doc.exp} yrs
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-[15px] font-extrabold" style={{ color: '#122056' }}>{doc.rating.toFixed(1)}★</div>
              <div className="text-[11.5px]" style={{ color: '#94A3B8' }}>({doc.reviews})</div>
            </div>
          </div>

          <p className="text-[13px] leading-[1.6] mb-[10px]" style={{ color: '#475569' }}>{bioShort}</p>

          <div className="flex items-center gap-1.5 flex-wrap">
            {insTags.map(ins => (
              <span key={ins} className="text-[11.5px] px-2 py-0.5 rounded font-medium" style={{ background: '#F4F6F9', border: '1px solid #E4E8EF', color: '#475569' }}>{ins}</span>
            ))}
            {insExtra && (
              <span className="text-[11.5px] px-2 py-0.5 rounded" style={{ background: '#F4F6F9', border: '1px solid #E4E8EF', color: '#94A3B8' }}>{insExtra}</span>
            )}
          </div>
        </div>
      </div>

      <div className="px-[22px] py-3 flex items-center justify-between flex-wrap gap-[10px] doc-bottom-row" style={{ background: '#F4F6F9', borderTop: '1px solid #E4E8EF' }}>
        <div className="flex items-center gap-2 flex-wrap">
          {doc.next === 'Today' ? (
            <div className="flex items-center gap-1.5">
              <div className="w-[7px] h-[7px] rounded-full portal-ping" style={{ background: '#5B65DC' }} />
              <span className="text-[13px] font-semibold" style={{ color: '#5B65DC' }}>Available today</span>
            </div>
          ) : (
            <span className="text-[13px]" style={{ color: '#94A3B8' }}>Next: {doc.next}</span>
          )}
          <span style={{ color: '#D1D5DB' }}>·</span>
          <span className="text-[13px]" style={{ color: '#64748B' }}>
            Next: <span className="font-semibold" style={{ color: '#122056' }}>{doc.nextSlot}</span>
          </span>
        </div>

        <div className="flex gap-2 doc-btn-row">
          <button
            onClick={() => actions.openProfile(doc)}
            className="btn-o h-[37px] px-4 text-[13px]"
            data-tip="View full profile and available slots"
          >
            <span className="material-icons-outlined text-sm">person</span>View Profile
          </button>
          <button
            onClick={() => actions.openBookModal(doc)}
            className="btn-p h-[37px] px-[18px] text-[13px]"
            data-tip="Book appointment with this doctor"
          >
            <span className="material-icons-outlined text-sm">calendar_today</span>Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
}
