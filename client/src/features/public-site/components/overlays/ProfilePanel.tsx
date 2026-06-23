import React from 'react';
import { Doctor, ProfileTab } from '../../types';
import { TIMES, TODAY, WDAYS, MONTHS_ARR } from '../../data/constants';

interface DateItem {
  day: string;
  num: number;
  month: string;
  key: string;
  selected: boolean;
  onSelect: () => void;
}

interface SlotItem {
  label: string;
  available: boolean;
  selected: boolean;
  onSelect?: () => void;
}

interface Props {
  open: boolean;
  doc: Doctor;
  tab: ProfileTab;
  dates: DateItem[];
  slots: SlotItem[];
  profileDate: string;
  profileSlot: string;
  canBook: boolean;
  onClose: () => void;
  onSetTab: (t: ProfileTab) => void;
  onBook: () => void;
}

export function ProfilePanel({
  open, doc, tab, dates, slots, profileDate, canBook, onClose, onSetTab, onBook,
}: Props) {
  if (!open) return null;

  const avatarBg = `hsl(${doc.hue} 55% 38%)`;
  const bookLabel = canBook ? `Book ${profileDate}` : 'Select a Date & Time';

  return (
    <div
      className="fixed inset-0 z-[800] flex justify-end"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(18,32,86,.5)', backdropFilter: 'blur(3px)' }}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className="panel-enter relative z-10 bg-white w-full max-w-[520px] h-screen overflow-y-auto"
        style={{ boxShadow: '-24px 0 80px rgba(18,32,86,.15)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-6 py-[22px] flex items-start gap-[14px] sticky top-0 z-10"
          style={{ background: '#122056' }}
        >
          <div
            className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-xl font-bold"
            style={{ background: avatarBg }}
          >
            {doc.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[18px] font-bold text-white mb-0.5">{doc.name}</div>
            <div className="text-[12.5px] mb-1.5" style={{ color: 'rgba(255,255,255,.65)' }}>{doc.creds} · {doc.specialty}</div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[12px] font-semibold px-[9px] py-0.5 rounded" style={{ color: '#A5B0FF', background: 'rgba(91,101,220,.28)' }}>{doc.branch}</span>
              <span className="text-[12px]" style={{ color: 'rgba(255,255,255,.6)' }}>{doc.rating.toFixed(1)}★ · {doc.exp} yrs exp</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg w-[34px] h-[34px] flex items-center justify-center text-white flex-shrink-0"
            style={{ background: 'rgba(255,255,255,.12)', border: 'none', cursor: 'pointer' }}
            aria-label="Close"
          >
            <span className="material-icons-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex bg-white sticky z-[9]" style={{ top: 112, borderBottom: '1px solid #E4E8EF' }}>
          <button onClick={() => onSetTab('about')} className={`tab-btn ${tab === 'about' ? 'active' : ''}`}>
            <span className="material-icons-outlined text-sm align-middle mr-1">person</span>About
          </button>
          <button onClick={() => onSetTab('slots')} className={`tab-btn ${tab === 'slots' ? 'active' : ''}`}>
            <span className="material-icons-outlined text-sm align-middle mr-1">calendar_month</span>Available Slots
          </button>
        </div>

        {/* Tab: About */}
        {tab === 'about' && (
          <div className="p-[22px]">
            <div className="mb-5">
              <h3 className="text-[13px] font-bold uppercase tracking-[.05em] mb-2" style={{ color: '#122056' }}>About</h3>
              <p className="text-sm leading-[1.72]" style={{ color: '#475569' }}>{doc.bio}</p>
            </div>
            <div className="rounded-lg p-4 grid grid-cols-2 gap-[14px] mb-5" style={{ background: '#F4F6F9' }}>
              {[
                { label: 'Specialty',   val: doc.specialty },
                { label: 'Languages',   val: doc.langs },
                { label: 'Branch',      val: doc.branch },
                { label: 'Experience',  val: `${doc.exp}+ years` },
              ].map(r => (
                <div key={r.label}>
                  <p className="text-[11px] font-bold uppercase tracking-[.06em] mb-[3px]" style={{ color: '#94A3B8' }}>{r.label}</p>
                  <p className="text-sm font-semibold" style={{ color: '#122056' }}>{r.val}</p>
                </div>
              ))}
            </div>
            <div>
              <h3 className="text-[13px] font-bold uppercase tracking-[.05em] mb-[10px]" style={{ color: '#122056' }}>Accepted Insurance</h3>
              <div className="flex gap-[7px] flex-wrap">
                {doc.insurance.map(ins => (
                  <div key={ins} className="flex items-center gap-[5px] px-[11px] py-[5px] rounded-lg" style={{ background: '#EEEFFD' }}>
                    <span className="material-icons-outlined text-[13px]" style={{ color: '#5B65DC' }}>check_circle</span>
                    <span className="text-[13px] font-medium" style={{ color: '#122056' }}>{ins}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Slots */}
        {tab === 'slots' && (
          <div className="p-[22px]">
            <h3 className="text-[13px] font-bold uppercase tracking-[.05em] mb-[10px]" style={{ color: '#122056' }}>Select a Date</h3>
            <div className="flex gap-[5px] mb-5">
              {dates.map(d => (
                <button
                  key={d.key}
                  onClick={d.onSelect}
                  className={`date-btn ${d.selected ? 'sel' : ''}`}
                >
                  <div className="text-[10px] font-semibold opacity-70">{d.day}</div>
                  <div className="text-[15px] font-extrabold leading-[1.1] my-0.5">{d.num}</div>
                  <div className="text-[10px] opacity-70">{d.month}</div>
                </button>
              ))}
            </div>

            {slots.length > 0 ? (
              <>
                <h3 className="text-[13px] font-bold uppercase tracking-[.05em] mb-[10px]" style={{ color: '#122056' }}>Available Times</h3>
                <div className="flex gap-2 flex-wrap mb-2">
                  {slots.map(sl => (
                    <button
                      key={sl.label}
                      onClick={sl.onSelect}
                      className={`slot-btn ${sl.selected ? 'sel' : ''} ${!sl.available ? 'unavail' : ''}`}
                    >
                      {sl.label}
                    </button>
                  ))}
                </div>
                <p className="text-[11.5px]" style={{ color: '#94A3B8' }}>
                  <span style={{ textDecoration: 'line-through' }}>Strikethrough</span> = already booked
                </p>
              </>
            ) : (
              <div className="rounded-lg px-5 py-7 text-center" style={{ background: '#F4F6F9' }}>
                <span className="material-icons-outlined text-[32px] block mb-2" style={{ color: '#CBD5E1' }}>event</span>
                <p className="text-[13.5px]" style={{ color: '#94A3B8' }}>Select a date to view available time slots.</p>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="px-[22px] py-4 sticky bottom-0 bg-white flex gap-[10px]" style={{ borderTop: '1px solid #E4E8EF' }}>
          <button onClick={onBook} className="btn-p flex-1 h-[46px] text-sm font-bold justify-center">
            <span className="material-icons-outlined text-[17px]">calendar_today</span>
            {bookLabel}
          </button>
          <button onClick={onClose} className="btn-o h-[46px] px-[18px] text-sm">Close</button>
        </div>
      </div>
    </div>
  );
}
